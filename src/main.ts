// /*
// Copyright 2018 Southern California Edison Company

// ALL RIGHTS RESERVED
//  */

import uuid from 'uuid';
import {
  Relationship,
  StixObject,
  Indicator,
  ObservedData,
  Report,
  StixNode,
  BundleType,
  SDO,
  SRO,
} from './stix';
import * as stix from './stix';
import fileSaver from 'file-saver';
import {
  compound_style,
  edge_style,
  node_style,
  select_node_style,
  view_utils_options,
  modified_unselect_style,
  modified_select_style,
  layouts
} from './graph/graphOptions';
import cola from 'cytoscape-cola';
import cosebilkent from 'cytoscape-cose-bilkent';
import dagre from 'cytoscape-dagre';
import euler from 'cytoscape-euler';
import spread from 'cytoscape-spread';
import { setup_edge_handles, edgehandles_style } from './graph/edge-handles';
import { setup_ctx_menu } from './graph/context-menu';
import { GraphUtils } from './graph/graphFunctions';
import { StixEditor } from './ui/stix-editor';
import Split from 'split.js';
import cytoscape, { CytoscapeOptions } from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import moment from 'moment';
import { QueryStorageService, StigSettings } from './storage';
import { graph_copy, graph_paste } from './ui/clipboard';
import { openDatabaseConfiguration } from './ui/database-config-widget';
import { check_db, commit, get_diff, query } from './ui/dbFunctions';
import { commit_all, delete_selected } from './ui/ipc-render-handlers';
import { QueryHistoryDialog } from './ui/queryHistoryWidget';
import { DiffDialog } from './ui/diff-dialog';
import { removeCompoundNodes, initDefenseGraph, initKillChainGraph } from './contextLayouts/contextLayouts';
import tippy from 'tippy.js';
import { organizeOrphans } from './contextLayouts/graphLayoutFunctions';

import killChain from './contextLayouts/killChainSchema.json';
import defense from './contextLayouts/defenseInDepthSchema.json';
import { openDatabaseUpload } from './ui/database-upload-widget';
import { openBundleExport } from './ui/export-bundle-widget';
import { isRelationship } from './stix/stix2';

declare global {
  interface Window {
    cycore: cytoscape.Core;
    layout: string;
  }
}

// Returns nodes positions
const getNodeMetadata = (nodes) => {
  return nodes.map(obj => ({
    id: obj.id(),
    position: obj.position(),
  }));
};

function layoutHandler (graph_utils: GraphUtils, settings: StigSettings, layout: string) {
  return () => {
    $('a').filter(function (_index: number, ele: HTMLElement) { return ele.id.includes('dd-layout'); }).prop('style', 'background-color: white');
    $('#dd-layoutCose').prop('style', 'background-color: #0d6efd');

    graph_utils.myLayout(layout);
    settings.layout = layout;
  };
}

export class Main {
  public run () {
    // Initialize tippy tooltips
    tippy('[data-tippy-content]', {
      theme: 'light',
    });
    // Initialize the query storage object
    const storage: QueryStorageService = QueryStorageService.Instance;

    // Initialize the settings object
    const settings = StigSettings.Instance;

    document.addEventListener('DOMContentLoaded', () => {
      const cyto_options: CytoscapeOptions = {
        container: $('#cy')[0],
        style: [node_style, compound_style, edge_style, select_node_style, modified_select_style, modified_unselect_style, ...edgehandles_style],
        wheelSensitivity: 0.25,
      };

      // set up cytoscape
      const cy = cytoscape(cyto_options);
      window.cycore = cy;
      const graph_utils = new GraphUtils(cy);

      // used by some events to make cytoscape respond
      window.addEventListener('resize', () => cy.resize(), false);

      Split(['#cy', '#editpane'], {
        direction: 'horizontal',
        sizes: [75, 25],
        gutterSize: 8,
        cursor: 'col-resize',
        onDragEnd: () => cy.resize(),
      });

      // Add event listeners to dropdown menu items

      // GRAPH
      $('#dd-copyElem').on('click', () => {
        graph_copy();
      });
      $('#dd-cutElem').on('click', () => {
        const selected = window.cycore.$(':selected');
        graph_copy();
        window.cycore.remove(selected);
      });
      $('#dd-pasteElem').on('click', () => {
        graph_paste();
      });
      $('#dd-commitElem').on('click', () => {
        void commit_all();
      });
      $('#dd-dbDelete').on('click', () => {
        delete_selected();
      });
      $('#dd-selectElem').on('click', () => {
        window.cycore.elements().select();
      });
      $('#dd-invertSelect').on('click', () => {
        const unselected = window.cycore.$(':unselected');
        const selected = window.cycore.$(':selected');
        selected.unselect();
        unselected.select();
      });
      $('#dd-viewEmbeddedRels').on('click', () => {
        // list all objects with property "object_refs"
        const has_object_refs = ['report', 'opinion', 'grouping', 'note', 'observed-data'];

        // get all current objects
        let nodes = window.cycore.$(':visible');
        nodes = nodes.union(nodes.connectedEdges());
        // let new_rels = []

        // if an object has "object_refs" property, create relationships for all reference objects
        nodes.each((ele) => {
          const obj = ele.data('raw_data');
          if (obj !== undefined && has_object_refs.includes(obj.type) && obj.object_refs) {
            for (const ref_id of obj.object_refs) {
              // Step 1.
              const rel_id = uuid.v4();
              const opts: stix.VisualEdgeData = {
                raw_data: 'visual_edge',
                id: rel_id,
                target: ref_id,
                source: obj.id
              };

              // Step 2.
              const rel_node = new stix.VisualEdge(opts);

              // Step 3.
              try{
                cy.add(rel_node);
              }catch(err){
                console.warn(err);
              }
            }
          }
        });
      });

      let relationshipsOn = true;
      $('#dd-toggleRelationships').on('click', () => {
        if (relationshipsOn) {
          view_util.hide(cy.edges());
        } else {
          view_util.show(cy.edges());
        }
        relationshipsOn = !relationshipsOn;
      });

      // EXPORT
      const exportCb = (cyQuery: string) => {
        const bundle_id = 'bundle--' + uuid.v4();
        const bundle: BundleType = { type: 'bundle', id: bundle_id, objects: [] } as any;

        const nodes = window.cycore.$(cyQuery);
        nodes.each((ele) => {
          if (ele.length === 0) {
            return;
          }
          // logic to remove null on json export
          if (ele.data('raw_data') !== undefined) {
            bundle.objects.push(ele.data('raw_data'));
          }
        });

        openBundleExport(bundle);
      };
      $('#dd-exportSelected').on('click', ()=>exportCb(":selected"));
      $('#dd-exportGraph').on('click', ()=>exportCb(":visible"));
      $('#dd-exportAll').on('click', () => {
        const bundle_id = 'bundle--' + uuid.v4();
        const bundle: BundleType = { type: 'bundle', id: bundle_id, objects: [] } as any;
        let nodes = window.cycore.$(':visible');
        nodes = nodes.union(nodes.connectedEdges());
        nodes.each((ele) => {
          if (ele.length === 0) {
            return;
          }
          // logic to remove null on json export
          if (ele.data('raw_data') !== undefined) {
            bundle.objects.push(ele.data('raw_data'));
          }
        });
        bundle.metadata = getNodeMetadata(nodes);

        openBundleExport(bundle);
      });
      $('#dd-exportPos').on('click', () => {
        const nodes = window.cycore.$(':visible');

        const jsonObj = JSON.stringify({ metadata: getNodeMetadata(nodes) }, null, 2);
        const blob = new Blob([jsonObj], { type: 'application/json' });
        fileSaver.saveAs(blob, 'metadata.json');
        $('.message-status').html('exported metadata');
      });

      // LAYOUT
      $('#dd-layoutCose').on('click', layoutHandler(graph_utils, settings, 'cose'));
      $('#dd-layoutCircle').on('click', layoutHandler(graph_utils, settings, 'circle'));
      $('#dd-layoutSpread').on('click', layoutHandler(graph_utils, settings, 'spread'));
      $('#dd-layoutCoseBilkent').on('click', layoutHandler(graph_utils, settings, 'cose_bilkent'));
      $('#dd-layoutKlay').on('click', layoutHandler(graph_utils, settings, 'klay'));
      $('#dd-layoutDagre').on('click', layoutHandler(graph_utils, settings, 'dagre'));
      $('#dd-layoutRandom').on('click', layoutHandler(graph_utils, settings, 'random'));
      $('#dd-layoutConcentric').on('click', layoutHandler(graph_utils, settings, 'concentric'));
      $('#dd-layoutBreadthfirst').on('click', layoutHandler(graph_utils, settings, 'breadthfirst'));
      $('#dd-layoutGrid').on('click', layoutHandler(graph_utils, settings, 'grid'));

      // CONTEXT LAYOUTS
      $('#dd-ctxLayoutNone').prop('style', 'background-color: #0d6efd');
      $('#dd-ctxLayoutNone').on('click', () => {
        $('a').filter(function (_index: number, ele: HTMLElement) { return ele.id.includes('dd-ctxLayout'); }).prop('style', 'background-color: white');
        $('#dd-ctxLayoutNone').prop('style', 'background-color: #0d6efd');

        removeCompoundNodes();
        // Position the nodes with a layout
        graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());
      });
      $('#dd-ctxLayoutDefInDepth').on('click', () => {
        $('a').filter(function (_index: number, ele: HTMLElement) { return ele.id.includes('dd-ctxLayout'); }).prop('style', 'background-color: white');
        $('#dd-ctxLayoutDefInDepth').prop('style', 'background-color: #0d6efd');

        removeCompoundNodes();
        initDefenseGraph();
        organizeOrphans();
      });
      killChain['kill-chain'].forEach(kc => {
        $('#contextLayoutOptions').append(`<li><a id=ctxLayout${kc.type} class="dropdown-item latout-option">${kc.type}</a></li>`);
        $(`#ctxLayout${kc.type}`).on('click', () => {
          $('a').filter(function (_index: number, ele: HTMLElement) { return ele.id.includes('dd-ctxLayout'); }).prop('style', 'background-color: white');
          $(`#dd-ctxLayout${kc.type}`).prop('style', 'background-color: #0d6efd');

          removeCompoundNodes();
          void initKillChainGraph(kc.type);
        });
      });

      // DATABASE
      $('#database').on('click', () => {
        openDatabaseConfiguration();
      });
      $('#databaseUpload').on('click', () => {
        openDatabaseUpload();
      });

      // Graph handling functions

      // configures edge behaviors
      edgehandles(cytoscape);
      const eh = setup_edge_handles(cy);

      // Disable edgehandles for compound nodes
      cy.on('mouseover', ':parent', _ => { eh.hide(); });

      // set up view utilities
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const jquery = require('jquery');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const viewUtilities = require('cytoscape-view-utilities');
      viewUtilities(cytoscape, jquery);
      const view_util = cy.viewUtilities(view_utils_options);
      // context menus inside the graph
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const cxtmenu = require('cytoscape-cxtmenu');
      cxtmenu(cytoscape);
      setup_ctx_menu(cy, view_util);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const klay = require('cytoscape-klay');
      klay(cytoscape);
      cola(cytoscape);
      cosebilkent(cytoscape);
      dagre(cytoscape);
      euler(cytoscape);
      // ngraph(cytoscape);
      spread(cytoscape);

      // Get the layout from storage and set the graph layout
      const layout = settings.layout;
      if (layouts[layout]) {
        graph_utils.myLayout(layout);
      }

      // the editor form that is filled when a node is clicked
      const editor = new StixEditor(cy);
      // #endregion

      // function to search elements inside the displayed graph
      function search (prop: string, searchterm: string | number): cytoscape.CollectionReturnValue {
        let prop2: string | null = null;
        let prop3: string | null = null;
        searchterm = searchterm.toString().trim();
        if (prop.includes('.')) {
          const s = prop.split('.');
          prop2 = s[0];
          prop3 = s[1];
        }

        return cy.elements().filter((ele) => {
          let ret: boolean = false;
          if (ele.data('raw_data')) {
            if (prop3 !== null) {
              if (ele.data('raw_data')[prop2!].length) {
                ele.data('raw_data')[prop2!].forEach((eleArr: Record<string, string>) => {
                  ret = eleArr[prop3 as any].trim() === searchterm;
                });
              } else {
                ret = ele.data('raw_data')[prop2!][0][prop3].trim() === searchterm;
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

      $('#btn-graph-search').on('click', (e: JQuery.Event) => {
        e.preventDefault();
        e.stopPropagation();
        $('.search-status').html('');
        const text: string = $('#toSearch').val() as string;
        let prop = 'name';
        let searchparam = '';
        if (text.indexOf(':')) {
          const s = text.split(':');
          prop = s[0];
          searchparam = s[1];
        }
        let selected = cy.$(':selected');
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
      $('#toSearch').on('keyup', (e: JQuery.Event) => {
        e.preventDefault();
        e.stopPropagation();
        const key = e.which;
        if (key === 13) {
          $('#btn-graph-search').trigger('click');
        }
      });

      // Query history dialog holds a history of DB queries
      const hist_dialog = new QueryHistoryDialog($('#query-anchor'));
      $('#btn-db-history').on('click', () => {
        hist_dialog.open();
      });

      // handler for DB search button click
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      $('#btn-db-search').on('click', async (e: JQuery.Event) => {
        e.preventDefault();
        e.stopPropagation();
        const text = $('#dbSearch').val() as string;
        if (text.length === 0) {
          return;
        }
        storage.add(text);

        const result = await query(text);

        let vertices = 0;
        let edges = 0;
        result.forEach((item: StixObject) => {
          if (cy.getElementById(item.id_!).length !== 0) { return; }
          if (isRelationship(item)) { edges++; }
          else { vertices++; }
        });
        $('#query-status').html(`Returned ${vertices} nodes and ${edges} edges.`);
        addToGraph({ type: 'bundle', objects: result }, 'DB');
      });

      // Handler to make DB search happen upon ctrl-enter
      $('#dbSearch').on('keyup', (e: JQuery.Event) => {
        $('#query-status').html('');
        const key = e.which;
        if (key === 17) {
          e.preventDefault();
          e.stopPropagation();
          $('#btn-db-search').trigger('click');
        }
      });

      // clears all items from displayed graph
      $('#button-clear-graph').on('click', (e: JQuery.Event) => {
        e.preventDefault();
        e.stopPropagation();
        cy.elements().remove();
        $('#metawidget').empty();
        cy.reset();
        $('#query-status').html('No Results');
      });

      // Show stix form on click
      cy.on('click', 'node, edge', (evt: cytoscape.EventObject) => {
        const ele: cytoscape.CollectionReturnValue = evt.target;
        cy.$(':selected').unselect();
        if (ele.empty() || ele.length > 1) {
          return true;
        }
        const input_data = ele.data('raw_data');
        if (input_data === undefined) { return true; }
        if (ele.isNode()) {
          // load the form for this node
          try {
            editor.buildWidget(ele, ele.data('type'), input_data);
          } catch (_) { }
        } else {
          // edge
          let relationship_file = '';

          // objects that shouldn't be related to other objects or only require the fundamental relationship types
          const common = ['artifact', 'autonomous-system', 'directory', 'domain-name', 'email-addr',
            'email-message', 'file', 'grouping', 'ipv4-addr', 'ipv6-addr', 'language-content',
            'location', 'mac-addr', 'mutex', 'network-traffic', 'note', 'observed-data',
            'opinion', 'process', 'report', 'software', 'url', 'user-account', 'vulnerability',
            'windows-registry-key', 'x509-certificate'];

          const target_obj_type = (input_data.source_ref).slice(0, -38);

          // get the file name for the corresponding source object
          if (common.includes(target_obj_type)) {
            relationship_file = 'common-relationship';
          } else {
            relationship_file = target_obj_type + '-relationship';
          }

          editor.buildWidget(ele, relationship_file, input_data);
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
        e.preventDefault();
        e.stopPropagation();
        const form_data = editor.editor.getValue();
        const jsonToSave = JSON.stringify(form_data, null, 2);
        const jsonSingleSave = new Blob([jsonToSave], { type: 'application/json' });
        fileSaver.saveAs(jsonSingleSave, `${form_data.id}.json`);
        $('.message-status').html(`Exported ${form_data.id} objects`);
      });

      // Clear Stix form editor when node/edge is unselected
      cy.on('unselect', 'node, edge', (evt: cytoscape.EventObject) => {
        $('#metawidget').empty();
        $('#current_node').empty();
        $('button.btn-commit').button('option', 'disabled', true);
        $('button#btn-export-single').button('option', 'disabled', true);
      });

      // Handler for when an edge is created via the graph editor
      cy.on('add', 'edge', (evt: cytoscape.EventObject) => {
        const my_map = new Map();

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
          const src_obj_type = ele.source().data('raw_data').type;
          let default_relationship = '';
          if (my_map.has(src_obj_type)) {
            default_relationship = my_map.get(src_obj_type);
          } else {
            default_relationship = 'related-to';
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

      //  Handlers for drag and drop of files containing stix bundles
      const uploader: HTMLElement = document.getElementById('cy')!;

      /**
       *  Event handler for when a file is dropped into the UI
       *
       * @param {DragEvent} evt
       */
      function handleFileDrop (evt: DragEvent) {
        evt.preventDefault();
        handleFiles(evt.dataTransfer!.files);
      }

      /**
       * @description Event handler for drag in progress
       * @param {DragEvent} evt
       */
      function handleDragOver (evt: DragEvent) {
        evt.preventDefault();
        evt.dataTransfer!.dropEffect = 'copy'; // Explicitly show this is a copy.
      }

      /**
       * Handles files added to UI via drag and drop or file selector
       *
       * @param {FileList} files
       */
      function handleFiles (files: FileList) {
        for (const file of files) {
          document.getElementById('chosen-files')!.innerText += file.name + ' ';

          const r = new FileReader();
          r.onload = (_e: Event) => {
            addToGraph(JSON.parse(r.result as string), 'GUI');
          };
          r.readAsText(file);
        }
      }

      /**
       * Adds a stix bundle to the current graph.
       *
       * @param {BundleType} pkg
       */
      function addToGraph (pkg: BundleType, data_source: stix.DataSourceType) {
        const added = graph_utils.buildNodes(pkg.objects, data_source);
        $('.message-status').html(`Added ${added.length} elements to graph.`);
        if (pkg.metadata) {
          // Position the nodes
          for (const node of pkg.metadata) {
            // Find the element on the graph
            cy.$id(node.id).animate({ position: node.position, duration: 1000, complete: () => cy.fit() });
          }
        } else {
          let canLayout = true;

          // Check if defense in depth is on
          if (cy.nodes(`#${defense.name.replaceAll(' ', '_')}`).length > 0) {
            canLayout = false;
            $('#dd-ctxLayoutDefInDepth').trigger('click');
          }

          // Check if a kill chain is on
          killChain['kill-chain'].forEach(kc => {
            // `#ctxLayout${kc.type}`
            if (cy.nodes(`#${kc.type}`).length > 0) {
              canLayout = false;
              $(`#ctxLayout${kc.type}`).trigger('click');
            }
          });

          // Only do this if there aren't any defense in depth or kill chain layouts open
          if (canLayout) {
            graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());
          }
        }
      }
      uploader.addEventListener('dragover', handleDragOver, false);
      uploader.addEventListener('drop', handleFileDrop, false);

      /**
       * Handler for Import Bundle button
       */
      $(document).on('change', '#btn-import-bundle', (e) => {
        handleFiles(e.target.files);
      });

      /**
       * Handler for Export Bundle button
       */
      $(document).on('click', '#btn-export-bundle', () => {
        // Get raw data from all cy elements
        // Create bundle object
        const bundle_id = 'bundle--' + uuid.v4();
        let bundle: BundleType = { type: 'bundle', id: bundle_id, objects: [] } as any;
        let nodes = window.cycore.$(':visible');
        nodes = nodes.union(nodes.connectedEdges());
        
        //ATTN: the following logic may actually do nothing at all. If that is the case, this problem can be solved by doing the filter like on the visual edges
        // logic to remove null on json export
        nodes.each((ele) => {
          if (ele.length === 0) {
            return;
          }
          if (ele.data('raw_data') !== undefined) {
            bundle.objects.push(ele.data('raw_data'));
          }
        });

        //filter out embedded relationship visual edges
        bundle.objects = bundle.objects.filter((bundleObj: any) => {
          return bundleObj !== "visual_edge";
        })

        // Open the export widget
        openBundleExport(bundle);
      });

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      $(document).on('click', '#btn-diff', async () => {
        const node = editor.editor.getValue();
        const diff = await get_diff(node);
        if (diff) {
          const diff_dialog = new DiffDialog($('#diff-anchor'));
          diff_dialog.addDiff(node.id, diff, node, node.name);
          diff_dialog.open();
        }
      });

      /** ************************************* *
       *        Save stix form to DB on click
       *************************************** */
      $('button').button();
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      $('button.btn-commit').on('click', async (e: JQuery.Event) => {
        e.preventDefault();
        e.stopPropagation();
        const formdata: StixObject = editor.editor.getValue();
        const [cnodes] = await commit([formdata], []);
        if (cnodes.size > 0) {
          // Find the node in the graph
          const node = cy.elements().filter((ele) => {
            return ele?.data('id') === formdata.id;
          });

          // Set it as saved
          if (node[0]) {
            node[0].data('saved', true);
          }

          $('.message-status').html('Committed 1 object to the database.');
        }

        $('button.btn-commit').button('option', 'disabled', true);
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
      function event_add_node (node_type: string): StixNode {
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

        if (node_type !== 'marking-definition') {
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
      function widget_bar_onclick<HTMLElement> (evt: JQuery.ClickEvent<HTMLElement, { name: string }>): boolean {
        // alert(evt.data['name'] + " clicked");
        const my_node = event_add_node(evt.data.name);
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
        $(element).on('click',
          null,
          { name: $(element).attr('name') },
          (e: JQuery.ClickEvent<HTMLElement, { name: string }>) => widget_bar_onclick(e));

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
          // handle widgets being dragged in from the widget bar
          stop: function (_, ui) {
            const my_node = event_add_node($(element).attr('name')!);
            const view_pos = cy._private.renderer.projectIntoViewport(ui.position.left, ui.position.top);
            my_node.position = {
              x: view_pos[0],
              y: view_pos[1],
            };
            cy.add(my_node);
          },
        });
      });
    });

    setInterval(check_db, 10000);
  }
}
