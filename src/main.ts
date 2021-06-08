/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import * as moment from 'moment';
import * as unhandled from 'electron-unhandled';
import * as uuid from 'uuid';
import {
    BundleType,
    Relationship,
    SDO,
    SRO,
    StixObject,
    Indicator,
    ObservedData,
    Report,
    StixNode,
} from './stix';
import * as stix from './stix';
import * as fileSaver from 'file-saver';
// import { ViewUtilitiesOptions } from './cytoscape-view-utilities';
import { StigDB } from './db/db';
import {
    edge_style,
    node_style,
    select_node_style,
    view_utils_options,
    modified_unselect_style,
    modified_select_style,
} from './graph/graphOptions';
import * as cola from 'cytoscape-cola';
import * as cosebilkent from 'cytoscape-cose-bilkent';
import * as dagre from 'cytoscape-dagre';
import * as euler from 'cytoscape-euler';
import * as ngraph from 'cytoscape-ngraph.forcelayout';
import * as spread from 'cytoscape-spread';
import { QueryHistoryDialog } from './ui/queryHistoryWidget';
import { setup_edge_handles, edgehandles_style } from './graph/edge-handles';
import { setup_ctx_menu } from './graph/context-menu';
import { GraphUtils } from './graph/graphFunctions';
import { StixEditor } from './ui/stix-editor';
import * as Split from 'split.js';
import * as cytoscape from 'cytoscape';
import { ViewUtilitiesOptions } from './graph/graphOptions';
import { ipcRenderer } from 'electron';
import { GraphQueryResult } from './db/db_types';
import * as edgehandles from 'cytoscape-edgehandles';
import { QueryStorageService, DatabaseConfigurationStorage, StigSettings } from './storage';
import { setHandlers } from './ui/ipc-render-handlers';

declare global {
    interface Window {
        cycore: cytoscape.Core;
        layout: string;
    }
}

// tslint:disable-next-line:class-name
export class main {
    // tslint:disable-next-line:no-empty
    constructor() { }

    public run() {
        const storage: QueryStorageService = QueryStorageService.Instance;
        let loading: boolean = false;

        document.addEventListener('DOMContentLoaded', async () => {
            unhandled();
            const cyto_options: cytoscape.CytoscapeOptions = {
                container: $('#cy')[0],
                style: [node_style, edge_style, select_node_style, modified_select_style, modified_unselect_style, ...edgehandles_style],
                // wheelSensitivity: 0.25,
            } as cytoscape.CytoscapeOptions;

            // set up cytoscape
            const cy = cytoscape(cyto_options);
            window.cycore = cy;

            // used by some events to make cytoscape respond
            window.addEventListener("resize", () => cy.resize(), false);
            const call_forceRender = () => {
                cy.resize();
            };

            Split(['#cy', '#editpane'], {
                direction: 'horizontal',
                sizes: [75, 25],
                gutterSize: 8,
                cursor: 'col-resize',
                onDragEnd: call_forceRender,
            });
            const current_db_config = DatabaseConfigurationStorage.Instance.current;
            const db = new StigDB(current_db_config);

            // Graph handling functions
            const graph_utils = new GraphUtils(cy, db);
            // configures edge behaviors
            edgehandles(cytoscape);
            setup_edge_handles(cy);

            // set up view utilities
            const jquery = require('jquery');
            // var jquery;
            const viewUtilities = require('cytoscape-view-utilities');
            viewUtilities(cytoscape, jquery);
            const view_util = cy.viewUtilities(view_utils_options as ViewUtilitiesOptions);
            // context menus inside the graph
            const cxtmenu = require('cytoscape-cxtmenu');
            cxtmenu(cytoscape);
            setup_ctx_menu(cy, db, view_util);
            const klay = require('cytoscape-klay');
            klay(cytoscape);
            cola(cytoscape);
            cosebilkent(cytoscape);
            dagre(cytoscape);
            euler(cytoscape);
            ngraph(cytoscape);
            spread(cytoscape);
            setHandlers();

            // the editor form that is filled when a node is clicked
            const editor = new StixEditor(cy, db);
            //#endregion

            // function to search elements inside the displayed graph
            function search(prop: string, searchterm: string | number): cytoscape.CollectionReturnValue {
                let prop2: string = null;
                let prop3: string = null;
                searchterm = searchterm.toString().trim();
                if (prop.indexOf('.') !== -1) {
                    const s = prop.split('.');
                    prop2 = s[0];
                    prop3 = s[1];
                }

                return cy.elements().filter((ele) => {
                    let ret: boolean = false;
                    if (ele.data('raw_data')) {
                        if (prop3 !== null) {
                            try {
                                if (ele.data('raw_data')[prop2].length) {
                                    ele.data('raw_data')[prop2].forEach((eleArr: { [x: string]: string; }) => {
                                        ret = eleArr[prop3].trim() === searchterm;
                                    });
                                } else {
                                    ret = ele.data('raw_data')[prop2][0][prop3].trim() === searchterm;
                                }
                            } catch (error) {
                                // console.log('error here, value: ', prop, searchterm, error);
                            }
                        } else {
                            ret = ele.data('raw_data')[prop] === searchterm;
                        }
                    }
                    if (ele.data(prop) !== undefined) {
                        ret = ele.data(prop).toString() === searchterm;
                    }
                    return ret;
                });
            }

            $("#btn-graph-search").on("click", (e: JQuery.Event) => {
                e.preventDefault();
                e.stopPropagation();
                $('.search-status').html('');
                const text: string = $("#toSearch").val() as string;
                let prop = 'name';
                let searchparam = '';
                if (text.indexOf(':')) {
                    const s = text.split(':');
                    prop = s[0];
                    searchparam = s[1];
                }
                let selected = cy.$(':selected');
                // view_util.removeHighlights(selected);
                selected.unselect();
                const eles = search(prop, searchparam);
                selected = eles;

                if (eles.length) {
                    eles.forEach((ele) => {
                        if (ele.isEdge()) {
                            selected = selected.add(ele.sources());
                            selected = selected.add(ele.targets());
                        }
                    });
                    selected.select();
                    // view_util.highlight(selected);
                    // cy.center(selected);
                    // cy.fit(selected);
                    $('.search-status').html(`Found ${selected.length} elements`);
                    cy.animate({
                        fit: {
                            eles: cy.elements(),
                            padding: 50,
                        },
                        step: () => undefined,
                        duration: 1000,
                    });
                    cy.animate({
                        fit: {
                            eles: selected,
                            padding: 50,
                        },
                        step: () => undefined,
                        duration: 1000,
                    });
                } else {
                    $('.search-status').html('Found 0 elements');
                }
            });

            // make the graph display search do the search when enter key is pressed
            $("#toSearch").on("keyup", (e: JQuery.Event) => {
                e.preventDefault();
                e.stopPropagation();
                const key = e.which;
                if (key === 13) {
                    // e.preventDefault();
                    // e.stopPropagation();
                    $("#btn-graph-search").trigger("click");
                }
            });

            // Query history dialog holds a history of DB queries
            const hist_dialog = new QueryHistoryDialog($('#query-anchor'));
            $("#btn-db-history").on('click', () => {
                hist_dialog.open();
            });

            // handler for DB search button click
            $("#btn-db-search").on("click", async (e: JQuery.Event) => {
                e.preventDefault();
                e.stopPropagation();
                const text = $("#dbSearch").val() as string;
                if (text.length === 0) {
                    return;
                }
                storage.add(text);
                hist_dialog.addToHistoryDialog();
                const result = await db.doGraphQuery({
                    command: text,
                    mode: 'graph',
                    parameters: [],
                });
                if (result.graph === undefined || result.graph.vertices === undefined) {
                    $('#query-status').html('No results');
                    return;
                }
                // console.log(result);
                $('#query-status').html(`Returned ${result.graph.vertices.length} nodes and ${result.graph.edges.length} edges.`);
                const add_graph: GraphQueryResult = {
                    graph: {
                        vertices: [],
                        edges: [],
                    },
                };
                let results: StixObject[] = [];
                results = results.concat(result.graph.edges, result.graph.vertices);
                // results.concat(result.graph.vertices);
                loading = true;
                results.forEach((item: StixObject) => {
                    if (cy.getElementById(item.id_).length === 0) {
                        /((r|R)elationship)|((s|S)ighting)/.exec(item.type) ? add_graph.graph.edges.push(item as SRO) : add_graph.graph.vertices.push(item as SDO);
                    }
                });
                try {
                    const bundle = await db.handleResponse(add_graph);
                    const new_nodes = await graph_utils.buildNodes(bundle, true);
                    // const selected = cy.$(':selected');
                    // view_util.removeHighlights(selected);
                    cy.elements().unselect();
                    graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());
                    new_nodes.select();
                    $('.message-status').html(`Added ${new_nodes.length} elements to graph`);
                    loading = false;
                } catch (err) {
                    loading = false;
                    throw err;
                }
            });

            // Handler to make DB search happen upon ctrl-enter
            $("#dbSearch").on("keyup", async (e: JQuery.Event) => {
                $('#query-status').html('');
                const key = e.which;
                if (key === 17) {
                    e.preventDefault();
                    e.stopPropagation();
                    $("#btn-db-search").trigger("click");
                }
            });
            // clears all items from displayed graph
            $("#button-clear-graph").on("click", (e: JQuery.Event) => {
                e.preventDefault();
                e.stopPropagation();
                cy.elements().remove();
                $('#metawidget').empty();
                db.diff_dialog.reset();
                cy.reset();
                $("#query-status").html("No Results");
            });

            // Show stix form on click
            cy.on("click", 'node, edge', (evt: cytoscape.EventObject) => {
                const ele: cytoscape.CollectionReturnValue = evt.target;
                cy.$(':selected').unselect();
                if (ele.empty() || ele.length > 1 || loading === true) {
                    return true;
                }
                const input_data = ele.data('raw_data');
                if (input_data === undefined) { return true; }
                if (ele.isNode()) {
                    // load the form for this node
                    try {
                        editor.buildWidget(ele, ele.data('type'), input_data);
                    }
                    catch(err) {
                        if(err.message === "Cannot read property '$ref' of undefined"){
                            // added to handle sub directory 'observables'
                            editor.buildWidget(ele, 'observables/' + ele.data('type'), input_data);
                        }
                        else{
                            console.error(err);
                        }
                    }
                } else {
                    // edge
                    // input_data.type 
                    let relationship_file = "";

                    // objects that shouldn't be related to other objects or only require the fundamental relationship types
                    let common = ["artifact", "autonomous-system", "directory", "domain-name", "email-addr", 
                                  "email-message", "file", "grouping", "ipv4-addr", "ipv6-addr", "language-content",
                                  "location", "mac-addr", "mutex", "network-traffic", "note", "observed-data",
                                  "opinion", "process", "report", "software", "url", "user-account", "vulnerability", 
                                  "windows-registry-key", "x509-certificate"];

                    let target_obj_type = (input_data.source_ref).slice(0,-38);

                    // get the file name for the corresponding source object
                    if (common.includes(target_obj_type)) {
                        relationship_file = "common-relationship";
                    } else {
                        relationship_file = target_obj_type + "-relationship";
                    }
                    
                    editor.buildWidget(ele, relationship_file , input_data);
                }
                $('button#btn-export-single').button('option', 'disabled', false);
                if (ele.data('saved') === false) {
                    $('button.btn-commit').button('option', 'disabled', false);
                } else {
                    $('button.btn-commit').button('option', 'disabled', true);
                }
                return true;
            });

            $('#btn-export-single').on('click', (e: JQuery.Event) => {
                // console.log(editor.root.getValue())
                e.preventDefault();
                e.stopPropagation();
                const form_data = editor.editor.getEditor('root').getValue();
                const jsonToSave = JSON.stringify(form_data, null, 2);
                const jsonSingleSave = new Blob([jsonToSave], { type: "application/json" });
                fileSaver.saveAs(jsonSingleSave, `${form_data.id}.json`);
                $('.message-status').html(`Exported ${form_data.id} objects`);
            });

            // Clear Stix form editor when node/edge is unselected
            cy.on("unselect", 'node, edge', (_evt: cytoscape.EventObject) => {
                // editor.editor.destroy();
                $('#metawidget').empty();
                $('#current_node').empty();
                $('button.btn-commit').button('option', 'disabled', true);
                $('button#btn-export-single').button('option', 'disabled', true);
            });

            // Handler for when an edge is created via the graph editor
            cy.on('add', 'edge', (evt: cytoscape.EventObject) => {
                let my_map = new Map();
                my_map.set('attack-pattern', 'uses');
                my_map.set('campaign', 'uses');
                my_map.set('course-of-action', 'mitigates');
                my_map.set('identity', 'located-at');
                my_map.set('indicator', 'indicates');
                my_map.set('infrastructure', 'consists-of');
                my_map.set('intrusion-set', 'uses');
                my_map.set('malware', 'targets');
                my_map.set('malware-analysis', 'analysis-of');
                my_map.set('threat-actor', 'uses');
                my_map.set('tool', 'targets');

                const ele = evt.target;
                // first check to see if the edge has been completed
                // if either end of the edge doesn't have raw_data it hasn't been completed
                if (ele.source().data('raw_data') === undefined || ele.target().data('raw_data') === undefined) {
                    return;
                }
                
                const input_data = ele.data('raw_data');
                if (input_data === undefined) {

                    let src_obj_type = ele.source().data('raw_data').type;
                    let default_relationship = "";
                    if (my_map.has(src_obj_type)) {
                        default_relationship = my_map.get(src_obj_type);
                    } else {
                        default_relationship = "related-to";
                    }

                    const raw_data: Relationship = {
                        // get source node
                        source_ref: ele.source().data('raw_data').id,
                        // get target node
                        target_ref: ele.target().data('raw_data').id,
                        type: 'relationship',
                        created: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                        modified: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                        id: 'relationship--' + ele.id(),
                        relationship_type: (default_relationship),
                    };
                    ele.data('raw_data', raw_data);
                    ele.data('saved', false);
                    ele.style('label', default_relationship);
                }
            });

            ipcRenderer.on("layout", (_event: Electron.Event, layout_type: string) => {
                // layout = layout_type;
                // window.layout = layout_type;
                graph_utils.myLayout(layout_type);
            });

            ipcRenderer.on('database_reconfigured', () => {
                cy.elements().remove();
                $('#metawidget').empty();
                db.diff_dialog.reset();
                cy.reset();
                $("#query-status").html("No Results");
            });

            //  Handlers for drag and drop of files containing stix bundles
            const uploader: HTMLElement = document.getElementById('cy')!;

            /**
             *  Event handler for when a file is dropped into the UI
             *
             * @param {DragEvent} evt
             */
            function handleFileDrop(evt: DragEvent) {
                // evt.stopPropagation();
                evt.preventDefault();

                handleFiles(evt.dataTransfer.files);
            }

            /**
             * @description Event handler for drag in progress
             * @param {DragEvent} evt
             */
            function handleDragOver(evt: DragEvent) {
                // evt.stopPropagation();
                evt.preventDefault();
                evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
            }

            /**
             * Handles files added to UI via drag and drop
             *
             * @param {FileList} files
             */
            function handleFiles(files: FileList) {
                // files is a FileList of File objects (in our case, just one)
                let f;
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < files.length; i++) {
                    if (files[i] && files[i] instanceof File) {
                        f = files[i];
                        document.getElementById('chosen-files')!.innerText += f.name + " ";
                        // hideMessages();

                        const r = new FileReader();
                        r.onload = (_e: Event) => {
                            // this.result
                            // addToGraph(JSON.parse(e.target.result))
                            addToGraph(JSON.parse(r.result as string));
                            graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());
                        };
                        r.readAsText(f);
                    }
                }
            }

            /**
             * Adds a stix bundle to the current graph.
             *
             * @param {BundleType} pkg
             */
            function addToGraph(pkg: BundleType) {
                graph_utils.buildNodes(pkg, false).then((added) => {
                    $('.message-status').html(`Added ${added.length} elements to graph.`);
                });
                graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());
            }
            uploader.addEventListener('dragover', handleDragOver, false);
            uploader.addEventListener('drop', handleFileDrop, false);

            /**
             * Handler for Export Bundle button
             *
             */
            $(document).on('click', '#btn-export-bundle', () => {
                // Get raw data from all cy elements
                // Create bundle object
                const bundle_id = 'bundle--' + uuid.v4();
                const bundle = { type: 'bundle', id: bundle_id, objects: [] } as BundleType;
                let nodes = cy.$(':visible');
                nodes = nodes.union(nodes.connectedEdges());
                nodes.each((ele) => {
                    if (ele.length === 0) {
                        return;
                    }
                    //logic to remove null on json export
                    if(ele.data('raw_data')!==undefined){
                        bundle.objects.push(ele.data('raw_data'));
                    }

                });
                // cy.edges().each((ele) => {
                //     // TODO FIXME: Do not save created_by edges, and other implicit edges
                //     bundle.objects.push(ele.data('raw_data'));
                // });

                // Convert to JSON and save
                const jsonToSave = JSON.stringify(bundle, null, 2);
                const jsonBundleSave = new Blob([jsonToSave], { type: "application/json" });
                fileSaver.saveAs(jsonBundleSave, "bundle.json");
                $('.message-status').html(`Exported ${bundle.objects.length} objects`);
            });

            $(document).on('click', '#btn-diff', () => {
                db.diff_dialog.open();
            });

            /***************************************** *
            *        Save stix form to DB on click
            *************************************** */
            $('button').button();
            $('button.btn-commit').on("click", (e: JQuery.Event) => {
                e.preventDefault();
                e.stopPropagation();
                let result: StixObject[];
                try {
                    const formdata: StixObject = editor.editor.getValue();
                    db.updateDB(formdata).then((r) => { result = r; });
                } catch (e) {
                    console.error('Error saving to database:');
                    console.error(e);
                    throw e;
                }
                $('button.btn-commit').button('option', 'disabled', true);
                $('.message-status').html(`Committed: ${JSON.stringify(result)}`);
            });

            /***********************************************************************************
            *
            *  Widget Bar Code
            *
            ***********************************************************************************/
            /**
             * @description Helper function to build a stixnode to insert into the graph
             * @param {string} node_type
             * @returns {Promise<StixNode>}
             */
            async function event_add_node(node_type: string): Promise<StixNode> {
                const opts: stix.StixNodeData = {
                    type: node_type,
                    id: node_type + '--' + uuid.v4(),
                    created: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                };

                if (node_type === 'indicator') {
                    (opts as Indicator).valid_from = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
                } else if (node_type === 'observed-data') {
                    (opts as ObservedData).first_observed = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
                    (opts as ObservedData).last_observed = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
                } else if (node_type === 'report') {
                    (opts as Report).published = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
                }

                if (node_type !== "marking-definition") {
                    opts.name = node_type;
                    opts.modified = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
                }

                return new StixNode(opts, node_type, 'GUI');
            }

            /**
             * Event handler for when an icon in the top widget bar is clicked.
             * It adds a node of that type to the canvas.
             *
             *
             * @template HTMLElement
             * @param {JQuery.ClickEvent<HTMLElement, { name: string; }>} evt
             * @returns {Promise<boolean>}
             */
            async function widget_bar_onclick<HTMLElement>(evt: JQuery.ClickEvent<HTMLElement, { name: string; }>): Promise<boolean> {
                // alert(evt.data['name'] + " clicked");
                const my_node = await event_add_node(evt.data.name);
                cy.add(my_node);
                return true;
            }

            /**
             * Load Widget Bar
             */
            const node_img = stix.node_img;
            $('.loadlater').each((_index: number, element: HTMLElement) => {
                const ele = $(element);
                if (ele === undefined) {
                    return;
                }
                // click handler for icons in the widget bar
                $(element).on("click",
                    null,
                    { name: $(element).attr('name') },
                    (e: JQuery.ClickEvent<HTMLElement, { name: string; }>) => widget_bar_onclick(e));

                // associate the name of stix object represented by the icon to the icon. This association is used later to
                // look up the correct stix schema
                const name = ele.attr('name');
                const src = ele.attr('src');
                if (name === undefined || src === undefined) {
                    return;
                } else {
                    node_img[name] = src;
                }
                // make icons draggable
                $(element).draggable({
                    opacity: 0.7,
                    helper: 'clone',
                    zIndex: 999,
                    start() {
                        // console.log('icon position:' + $(element).attr('position').x + $(element).attr('position').y)
                        // console.log('drag start:' + ui.position.left.toString() + ' ' + ui.position.top.toString())
                    },
                    // handle widgets being dragged in from the widget bar
                    stop: async (evt: DragEvent) => {
                        const my_node = await event_add_node($(element).attr('name')!);
                        const view_pos = cy._private.renderer.projectIntoViewport(evt.clientX, evt.clientY);
                        my_node.position = {
                            x: view_pos[0],
                            y: view_pos[1],
                        };
                        cy.add(my_node);
                    },
                });
                return;
            });
        },
        );
        //
        /*document.addEventListener("DOMContentLoaded", function() {
            var cy = (window.cy = cytoscape({
              container: document.getElementsByClassName("icon-box"),
              style: [{
                  selector: "node",
                  style: {
                    content: "data(id)"
                  }
                }
              ],
            }));
          
            function makePopper(ele) {
              let ref = ele.popperRef(); // used only for positioning
          
              ele.tippy = tippy(ref, { // tippy options:
                content: () => {
                  let content = document.createElement('div');
          
                  content.innerHTML = ele.id();
          
                  return content;
                },
                trigger: 'manual' // probably want manual mode
              });
            }
          
            cy.ready(function() {
              cy.elements().forEach(function(ele) {
                makePopper(ele);
              });
            });
          
            cy.elements().unbind('mouseover');
            cy.elements().bind('mouseover', (event) => event.target.tippy.show());
          
            cy.elements().unbind('mouseout');
            cy.elements().bind('mouseout', (event) => event.target.tippy.hide());
          
        });
        //*/
    }
}
