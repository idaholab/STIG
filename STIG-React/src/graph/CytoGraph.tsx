import React, { useContext, useEffect, useRef } from 'react';

import cytoscape, { EventHandler } from 'cytoscape';
import { EventContext } from '@/contexts/EventContext';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '../contexts/useTheme';
import { compound_style, edge_style, modified_select_style, modified_unselect_style, node_style, select_node_style, view_utils_options } from './graphOptions';
import { CytoscapeNode } from '@/types/cytoscapeTypes/CytoscapeNode';
import { CytoscapeNodeData } from '@/types/cytoscapeTypes/CytoscapeNodeData';
import moment from 'moment';
import { DataSourceType } from '@/types/DataSourceType';
import { useStixPropsContext } from '@/contexts/StixPropsContext';
import { layouts } from './graphOptions';
import cosebilkent from 'cytoscape-cose-bilkent';
import dagre from 'cytoscape-dagre';
import klay from 'cytoscape-klay';
import spread from 'cytoscape-spread';
import viewUtilities from 'cytoscape-view-utilities';
import cxtmenu from 'cytoscape-cxtmenu';
import { edgehandles_style, setup_edge_handles } from './edge-handles';
import { useStigContext } from '@/contexts/StigContext';
import { setupCtxMenu } from '@/util/GraphUtils';


cytoscape.use(viewUtilities);
cytoscape.use(cxtmenu);
//cytoscape.use(edgehandles);

cosebilkent(cytoscape);
dagre(cytoscape);
klay(cytoscape);
spread(cytoscape);

const Graph: React.FC = () => {
    const cyContainerRef = useRef<HTMLDivElement>(null);
    const { addEventListener, removeEventListener } = useContext(EventContext);
    const { theme, toggleTheme } = useTheme();
    const nodeTextLightColor: string = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-dark-hex-100');
    const nodeTextDarkColor: string = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-dark-hex-900');
    const selectedColor = getComputedStyle(document.documentElement).getPropertyValue('--selected-node-border-color');
    const edgeColorDark = getComputedStyle(document.documentElement).getPropertyValue('--edge-dark-color');
    const edgeColorLight = getComputedStyle(document.documentElement).getPropertyValue('--edge-light-color');
    const { cyInstance, setCyInstance, isDrawerOpen, toggleDrawer } = useStigContext();
    const { selectedSTIXObject, setSelectedSTIXObject } = useStixPropsContext();

    useEffect(() => {
        if (cyInstance) {
            cyInstance.style()
                .selector('node')
                .style({
                    'color': theme === 'dark' ? nodeTextLightColor : nodeTextDarkColor,
                    //'text-outline-color': theme === 'dark' ? '#fff' : '#000',
                    'text-background-opacity': 0,
                    'target-arrow-color': theme === 'dark' ? edgeColorDark : edgeColorLight,
                    'line-color': theme === 'dark' ? edgeColorDark : edgeColorLight,
                })
                .selector('edge')
                .style({
                    'color': theme === 'dark' ? nodeTextLightColor : nodeTextDarkColor,
                    'target-arrow-color': theme === 'dark' ? edgeColorDark : edgeColorLight,
                    'line-color': theme === 'dark' ? edgeColorDark : edgeColorLight,
                })
                .selector(':selected')
                .style({
                    'border-color': selectedColor.trim(),
                    'target-arrow-color': selectedColor.trim(),
                    'line-color': selectedColor.trim(),
                })
                .selector('.eh-handle')
                .style({
                    'background-color': theme === 'dark' ? edgeColorDark : edgeColorLight,
                })
                .update();
        }
    }, [theme, cyInstance, edgeColorDark, edgeColorLight, nodeTextLightColor, nodeTextDarkColor, selectedColor]);

    useEffect(() => {
        const handleCustomEvent = (payload: any) => {
            //const id = payload.data.detail.id;
            const label = payload.data.detail.label;
            const type = payload.data.detail.type;
            const imageUrl = payload.data.detail.imageUrl;
            const position = payload.data.detail.position;
            const customEvent = new CustomEvent('addNode', {
                detail: {
                    label,
                    type,
                    imageUrl,
                    position: position,
                },
            });
            cyContainerRef.current?.dispatchEvent(customEvent);
        };

        addEventListener('stencilMouseUpEvent', handleCustomEvent);

        const handleClearGraphClickEvent = () => {
            const clearGraphEvent = new CustomEvent('clearGraph');
            cyContainerRef.current?.dispatchEvent(clearGraphEvent);
        }
        addEventListener('clearGraphClickEvent', handleClearGraphClickEvent);

        const handleLayoutChangeEvent = (payload: any) => {
            const layout = payload.data.detail.layout;
            const layoutChangeEvent = new CustomEvent('changeLayout', {
                detail: {
                    layout
                }
            });
            cyContainerRef.current?.dispatchEvent(layoutChangeEvent);
        };
        addEventListener('layoutSelect', handleLayoutChangeEvent);

        return () => {
            removeEventListener('stencilMouseUpEvent', handleCustomEvent);
            removeEventListener('clearGraphClickEvent', handleClearGraphClickEvent);
            removeEventListener('layoutSelect', handleLayoutChangeEvent);
        };
    }, [addEventListener, removeEventListener]);

    useEffect(() => {
        if (cyContainerRef.current) {
            let cy = cytoscape({
                container: cyContainerRef.current,
                style: [node_style, compound_style, edge_style, select_node_style, modified_select_style, modified_unselect_style, ...edgehandles_style],
                layout: {
                    name: 'grid',
                    rows: 1,
                },
            });

            const eh = setup_edge_handles(cy);
            // cy.on('ehcomplete', (event, sourceNode, targetNode, addedEles) => {
            //     console.log('Edge created:', addedEles);
            // });

            // View Utilities
            try {
                let viewUtil = cy?.viewUtilities(view_utils_options);
                if (viewUtil) {
                    setupCtxMenu(cy, isDrawerOpen, toggleDrawer,
                        selectedSTIXObject, setSelectedSTIXObject, viewUtil);
                }
            }
            catch (e) {
                console.error('View utilities could not be initialized.', e);
            }
            setCyInstance(cy);

            const handleAddNode = (event: CustomEvent) => {
                const { label, type, imageUrl, position } = event.detail;

                // TODO: Create stix object
                const node = handleAddStixNode(label, type, imageUrl, position, 'GUI');
                node.group = 'nodes';

                cy?.add(node);

                // cyInstance.add({
                //     group: 'nodes',
                //     data: { id, label, image: imageUrl },
                //     position: position,
                // });
                //cyInstance.layout({ name: 'grid' }).run(); // TODO: Change to selected layout...
            };

            const handleLayoutChangeEvent = (event: CustomEvent) => {
                const { layout } = event.detail;
                // Select all nodes with no parents or children
                const orphans = cy.elements(':orphan').filter(':childless');
                const cyLayout = orphans.layout(layouts[layout]);

                if (layout === 'mitre_timeline') {
                    layoutByTimeframe(cy);
                }
                else {
                    cyLayout.run();
                }
            }

            const graphElement = cyContainerRef.current;
            graphElement.addEventListener('addNode', handleAddNode as EventListener);
            graphElement.addEventListener('changeLayout', handleLayoutChangeEvent as EventListener);
            return () => {
                graphElement.removeEventListener('addNode', handleAddNode as EventListener);
                graphElement.removeEventListener('changeLayout', handleLayoutChangeEvent as EventListener);

            };
        }
    }, []);

    useEffect(() => {
        if (cyInstance) {
            // View Utilities
            try {
                let viewUtil = cyInstance.viewUtilities(view_utils_options);
                if (viewUtil) {
                    setupCtxMenu(cyInstance, isDrawerOpen, toggleDrawer,
                        selectedSTIXObject, setSelectedSTIXObject, viewUtil);
                }
            }
            catch (e) {
                console.error('View utilities could not be initialized.', e);
            }
        }
    }, [isDrawerOpen, selectedSTIXObject]);

    // Needed to move handleClearGraph out of the above useEffect so that
    // isDrawerOpen and cyInstance would properly update and clearing the
    // graph would properly know when to also close the properties panel.
    useEffect(() => {
        const handleClearGraph = () => {
            cyInstance?.elements().remove();
            cyInstance?.reset();
            setSelectedSTIXObject(undefined);
            if (isDrawerOpen) {
                toggleDrawer();
            }
        }

        const graphElement = cyContainerRef.current;
        graphElement?.addEventListener('clearGraph', handleClearGraph);

        return () => {
            graphElement?.removeEventListener('clearGraph', handleClearGraph);
        };
    }, [isDrawerOpen, cyInstance]);

    // Triggered on edit of a node's properties
    useEffect(() => {
        let elementId = selectedSTIXObject?.id;
        if (selectedSTIXObject?.type === "relationship") {
            elementId = elementId?.replace("relationship--", "");
        }
        // If a relationship is created via the application (as opposed to imported), its cytoscape id will be
        // its raw_data id with "relationship--" on the front
        let cytoElement = cyInstance?.getElementById(elementId);
        if (cytoElement?.length === 0) {
            cytoElement = cyInstance?.getElementById(selectedSTIXObject?.id);
        }
        if (cytoElement === undefined) { return }
        cytoElement.data("raw_data", selectedSTIXObject);
        if (elementId) {
            let cytoElement = cyInstance?.getElementById(elementId);
            if (cytoElement?.length === 0 && selectedSTIXObject) {
                cytoElement = cyInstance?.getElementById(selectedSTIXObject?.id);
            }
            if (cytoElement === undefined) { return }
            cytoElement.data("raw_data", selectedSTIXObject);
        }
    }, [selectedSTIXObject]);

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        const label = event.dataTransfer.getData('text');
        const imageUrl = event.dataTransfer.getData('imageUrl');
        const type = event.dataTransfer.getData('type');
        const position = cyContainerRef.current ? cyContainerRef.current.getBoundingClientRect() : { x: 0, y: 0 };
        const x = event.clientX - position.x;
        const y = event.clientY - position.y;

        // TODO: Create/Add Stix Node!!!
        handleAddStixNode

        const customEvent = new CustomEvent('addNode', {
            detail: {
                label,
                type,
                imageUrl,
                position: { x, y },
            },
        });

        cyContainerRef.current?.dispatchEvent(customEvent);
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
    };

    function handleAddStixNode(label: string, nodeType: string, imgUrl: string, position: any, dSource: DataSourceType): CytoscapeNode {
        const opts: CytoscapeNodeData = {
            type: nodeType,
            id: nodeType + '--' + uuidv4(),
            created: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            spec_version: "2.1"
        };
        if (nodeType === 'indicator') {
            opts.valid_from = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        } else if (nodeType === 'observed-data') {
            opts.first_observed = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            opts.last_observed = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        } else if (nodeType === 'report') {
            opts.published = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        }

        if (nodeType !== 'marking-definition') {
            opts.name = nodeType;
            opts.modified = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        }

        const style: CSSStyleDeclaration = { backgroundImage: imgUrl } as unknown as CSSStyleDeclaration; //node_img[nodeType]
        let rtnNode: CytoscapeNode = { data: opts, style: style, position: position, classes: 'stix_node' };

        const labelorder = ['name', 'value', 'key', 'path', 'product', 'dst_port', 'command_line', 'type', 'id'];
        let nodelabel: string | undefined;
        if (nodeType === 'marking-definition') {
            nodelabel = rtnNode.data.name;
        } else {
            for (const element of labelorder) {
                if (Object.prototype.hasOwnProperty.call(rtnNode.data, element)) {
                    if (element === 'dst_port') {
                        const { [element]: nodelabel1, src_port, protocols } = rtnNode.data;
                        nodelabel = src_port.toString().concat(' -> ', nodelabel1.toString(), '/', protocols.toString());
                    } else {
                        const { [element]: nodelabel1 } = rtnNode.data;
                        nodelabel = nodelabel1;
                    }
                    break;
                }
            }
        }

        if (nodeType === 'observed-data') {
            nodelabel = `${label} (Last Observed: ${opts.last_observed})`;
        }

        nodelabel = (nodelabel && nodelabel.length > 60) ? nodelabel.substring(0, 60).concat('...') : nodelabel;


        const raw_data = {
            ...opts,
            name: nodelabel
        };
        delete raw_data.label;

        rtnNode.data.label = nodelabel;
        rtnNode.data.raw_data = raw_data;
        // rtnNode.data.saved = (dSource === 'DB' || dSource === 'IGNORE');
        return rtnNode;
    };

    function layoutByTimeframe(cy: cytoscape.Core) {
        const observedDataNodes = cy.nodes().filter(node => node.data('raw_data')?.last_observed && node.data('type') === 'observed-data');
        const relationshipEdges = cy.edges().filter(edge => edge.data('raw_data')?.type === 'relationship');
        const positionedAttackPatternNodes = new Set<string>(); // Track positioned node IDs

        // Sort observed nodes by 'last_observed'
        observedDataNodes.sort((a, b) => new Date(a.data('raw_data')?.last_observed).getTime() - new Date(b.data('raw_data')?.last_observed).getTime());

        const startX = 0;
        const gap = 200; // Spacing between nodes
        const animations: Promise<EventHandler>[] = [];

        let maxYTimeline = 0;

        observedDataNodes.forEach((observedNode, index) => {
            const newX = startX + index * gap;

            // Animate
            animations.push(observedNode.animate({
                position: { x: newX, y: 0 }
            }, {
                duration: 1000,
                easing: 'ease-in-out'
            }).promiseOn('position'));

            observedNode.position({ x: newX, y: 0 });
            maxYTimeline = Math.max(maxYTimeline, 0);


            // Filter the edges to find connected attack-pattern nodes
            const connectedAttackPatternNodes = relationshipEdges.filter(edge => {
                const sourceIsObserved = edge.data('raw_data')?.source_ref === observedNode.data('id') &&
                    cy.getElementById(edge.data('raw_data').target_ref).data('type') === 'attack-pattern';
                const targetIsObserved = edge.data('raw_data').target_ref === observedNode.data('id') &&
                    cy.getElementById(edge.data('raw_data').source_ref).data('type') === 'attack-pattern';
                return sourceIsObserved || targetIsObserved;
            }).map(edge => {
                return cy.getElementById(edge.data('raw_data').source_ref === observedNode.data('id')
                    ? edge.data('raw_data').target_ref
                    : edge.data('raw_data').source_ref);
            });

            // Get attack-pattern nodes from object_refs
            const objectRefs = observedNode.data('raw_data').object_refs || [];
            objectRefs.forEach((refId: string) => {
                const refNode = cy.getElementById(refId);
                if (refNode.data('type') === 'attack-pattern') {
                    connectedAttackPatternNodes.push(refNode);
                }
            });

            // Deduplicate attack-pattern nodes (avoid positioning the same node multiple times)
            const uniqueAttackPatternNodes = [...new Set(connectedAttackPatternNodes)];

            // Position each connected attack-pattern node
            uniqueAttackPatternNodes.forEach((attackPatternNode, attackIndex) => {
                // Ensure attack-pattern nodes are only positioned once
                if (!positionedAttackPatternNodes.has(attackPatternNode.id())) {
                    const newY = 200 + attackIndex * gap;

                    animations.push(attackPatternNode.animate({
                        position: { x: newX, y: newY }
                    }, {
                        duration: 1000,
                        easing: 'ease-in-out'
                    }).promiseOn('position'));

                    attackPatternNode.position({ x: newX, y: newY });
                    maxYTimeline = Math.max(maxYTimeline, newY);
                    positionedAttackPatternNodes.add(attackPatternNode.id());
                }
            });
        });

        const bufferSpace = 100;
        const newYForNonTimelineNodes = maxYTimeline + bufferSpace;

        const nonTimelineNodes = cy.nodes().filter(node => node.data('type') !== 'observed-data' && node.data('type') !== 'attack-pattern');
        nonTimelineNodes.forEach(nonTimelineNode => {
            const nodePosition = nonTimelineNode.position();

            animations.push(nonTimelineNode.animate({
                position: { x: nodePosition.x, y: nodePosition.y + newYForNonTimelineNodes }
            }, {
                duration: 1000,
                easing: 'ease-in-out'
            }).promiseOn('position'));

            nonTimelineNode.position({ x: nodePosition.x, y: nodePosition.y + newYForNonTimelineNodes });

        });

        // Run the preset layout
        cy.layout({ name: 'preset' }).run();
    }

    // Show STIX props panel on node/edge click
    cyInstance?.on('click', 'node, edge', (evt: cytoscape.EventObject) => {
        if (!isDrawerOpen) {
            toggleDrawer();
        }
        const ele: cytoscape.CollectionReturnValue = evt.target;
        cyInstance.$(':selected').unselect();
        if (ele.empty() || ele.length > 1) {
            return;
        }
        setSelectedSTIXObject(ele.data("raw_data"));
    });

    // Hide STIX props panel when node/edge is unselected
    cyInstance?.on('unselect', 'node, edge', (evt: cytoscape.EventObject) => {
        if (isDrawerOpen) {
            toggleDrawer();
        }
    });

    // Handler for when an edge is created via the graph editor
    cyInstance?.on('add', 'edge', (evt: cytoscape.EventObject) => {
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

            const raw_data = {
                // get source node
                source_ref: ele.source().data('raw_data').id,
                // get target node
                target_ref: ele.target().data('raw_data').id,
                type: 'relationship',
                created: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                modified: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                id: 'relationship--' + ele.id(),
                relationship_type: (default_relationship),
                spec_version: "2.1"
            };
            ele.data("raw_data", raw_data);
            ele.data('label', default_relationship);
            //   ele.data('saved', false);
        }
        ele.classes('edge');
    });

    return <div ref={cyContainerRef}
        style={{ width: '100%', height: '100%' }}
        onDrop={handleDrop}
        onDragOver={handleDragOver} />;
};

export default Graph;
