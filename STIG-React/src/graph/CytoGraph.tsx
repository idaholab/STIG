import React, { useContext, useEffect, useRef } from 'react';
import cytoscape, { SingularElementReturnValue } from 'cytoscape';
import { EventContext } from '@/contexts/EventContext';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '../contexts/useTheme';
import { compound_style, modified_select_style, modified_unselect_style, view_utils_options } from './graphOptions';
import { CytoscapeNode } from '@/types/cytoscapeTypes/CytoscapeNode';
import { CytoscapeNodeData } from '@/types/cytoscapeTypes/CytoscapeNodeData';
import moment from 'moment';
import { DataSourceType } from '@/types/DataSourceType';
import { useStixPropsContext } from '@/contexts/StixPropsContext';
import cosebilkent from 'cytoscape-cose-bilkent';
import dagre from 'cytoscape-dagre';
import klay from 'cytoscape-klay';
import spread from 'cytoscape-spread';
import viewUtilities from 'cytoscape-view-utilities';
import cxtmenu from 'cytoscape-cxtmenu';
import { useStigContext } from '@/contexts/StigContext';
import { setupCtxMenu } from '@/util/GraphUtils';
import { createCytoscapeNode } from '@/stix/stix';
import { stencilItems } from '@/components/elements/StencilItems';
import { setup_edge_handles, updateEdgeHandlesStyle } from './graphEdgeHandles';
import { updateEdgeSelectedStyle, updateEdgeStyle } from './graphEdgeStyles';
import { updateNodeSelectedStyle, updateNodeStyle } from './graphNodeStyles';
import edgehandles from 'cytoscape-edgehandles';
import { importGraph } from './importGraph';
import { useNotificationContext } from '@/contexts/NotificationContext';

cytoscape.use(viewUtilities);
cytoscape.use(cxtmenu);
cytoscape.use(edgehandles);

cosebilkent(cytoscape);
dagre(cytoscape);
klay(cytoscape);
spread(cytoscape);

const Graph: React.FC = () => {
    const cyContainerRef = useRef<HTMLDivElement>(null);
    const { addEventListener, removeEventListener } = useContext(EventContext);
    const { theme } = useTheme();
    const { cyInstance, setCyInstance, isPropertyPanelOpen, setIsPropertyPanelOpen, getStigLayoutSettingsFromStore, runLayout } = useStigContext();
    const { selectedSTIXObject, setSelectedSTIXObject, setSelectionExists, setNodesExist } = useStixPropsContext();
    const { addNotification } = useNotificationContext();

    // Dynamically updates the styles on the nodes and edges
    useEffect(() => {
        if (cyContainerRef.current && cyInstance) {
            updateNodeStyle(cyInstance);
            updateNodeSelectedStyle(cyInstance);
            updateEdgeStyle(cyInstance);
            updateEdgeSelectedStyle(cyInstance);
            updateEdgeHandlesStyle(cyInstance);
        }
    }, [theme, cyInstance]);

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
            setSelectionExists(false);
        }
        addEventListener('clearGraphClickEvent', handleClearGraphClickEvent);

        const handleLayoutChangeEvent = (payload: any) => {
            const layout = payload.data.detail.layout;
            const layoutChangeEvent = new CustomEvent('changeLayout', {
                detail: { layout }
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
                style: [compound_style, modified_select_style, modified_unselect_style],
                wheelSensitivity: .1

            });
            runLayout(getStigLayoutSettingsFromStore(), cy);
            setup_edge_handles(cy);

            // View Utilities
            try {
                let viewUtil = cy?.viewUtilities(view_utils_options);
                if (viewUtil) {
                    setupCtxMenu(cy, setIsPropertyPanelOpen,
                        selectedSTIXObject, setSelectedSTIXObject, setSelectionExists, viewUtil);
                }
            }
            catch (e) {
                console.error('View utilities could not be initialized.', e);
            }
            setCyInstance(cy);

            const handleAddNode = (event: CustomEvent) => {
                const { label, type, imageUrl } = event.detail;
                const node = handleAddNewCytoscapeNode(label, type, imageUrl, 'GUI');
                node.position = { x: 0, y: 0 };
                node.group = 'nodes';
                let addedNode = cy?.add(node);
                runLayout(getStigLayoutSettingsFromStore(), cy);
                // Auto Select the new node
                autoSelectNewNode(cy, addedNode);
            };

            const handleLayoutChangeEvent = (event: CustomEvent) => {
                const { layout } = event.detail;
                runLayout(layout, cy);
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
                    setupCtxMenu(cyInstance, setIsPropertyPanelOpen,
                        selectedSTIXObject, setSelectedSTIXObject, setSelectionExists, viewUtil);
                }
            }
            catch (e) {
                console.error('View utilities could not be initialized.', e);
            }
        }
    }, [isPropertyPanelOpen, selectedSTIXObject]);

    // Needed to move handleClearGraph out of the above useEffect so that
    // isPropertyPanelOpen and cyInstance would properly update and clearing the
    // graph would properly know when to also close the properties panel.
    useEffect(() => {
        const handleClearGraph = () => {
            cyInstance?.elements().remove();
            cyInstance?.reset();
            setSelectedSTIXObject(undefined);
            setIsPropertyPanelOpen(false);
            setSelectionExists(false);
        }

        const graphElement = cyContainerRef.current;
        graphElement?.addEventListener('clearGraph', handleClearGraph);

        return () => {
            graphElement?.removeEventListener('clearGraph', handleClearGraph);
        };
    }, [isPropertyPanelOpen, cyInstance]);

    // Triggered on edit of a node's properties
    useEffect(() => {
        if (selectedSTIXObject === undefined) {
            return;
        }

        let elementId = selectedSTIXObject.id;
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

    const handleDrop = async (event: React.DragEvent) => {
        if (cyInstance === undefined) {
            return;
        }

        event.preventDefault();

        if (event.dataTransfer.files) {
            const files = Array.from(event.dataTransfer.files).filter(f => f.name.endsWith('.json'));
            if (files.length > 0) {
                addNotification("Importing files....", "info");
                const { alerts, layout } = await importGraph(cyInstance, event.dataTransfer.files);
                for (const { message, type } of alerts) {
                    addNotification(message, type);
                }
                if (layout) {
                    // Perform layout if some bundle had no metadata
                    runLayout(getStigLayoutSettingsFromStore(), cyInstance);
                }
                return;
            }
        }

        const label = event.dataTransfer.getData('text');
        const imageUrl = event.dataTransfer.getData('imageUrl');
        const type = event.dataTransfer.getData('type');
        let position = cyContainerRef.current ? cyContainerRef.current.getBoundingClientRect() : { x: 0, y: 0 };
        const x = event.clientX - position.x;
        const y = event.clientY - position.y;
        const zoom = cyInstance.zoom();
        const pan = cyInstance.pan();
        const adjustedX = (x - pan.x) / zoom;
        const adjustedY = (y - pan.y) / zoom;

        position = { x: adjustedX, y: adjustedY }
        let newNode = handleAddNewCytoscapeNode(label, type, imageUrl, 'GUI');
        newNode.position = position;
        // Add Node
        const addedNode: SingularElementReturnValue = cyInstance.add(newNode) as SingularElementReturnValue;
        runLayout(getStigLayoutSettingsFromStore(), cyInstance);
        // Auto Select
        autoSelectNewNode(cyInstance, addedNode);
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
    };

    function handleAddNewCytoscapeNode(label: string, nodeType: string, imgUrl: string, dSource: DataSourceType): CytoscapeNode {
        // Will be 'sco', 'sdo', or 'smo'
        const stixObjectCategory = stencilItems.find(stencilItem => stencilItem.id === nodeType)?.type;

        const cytoscapeNode: CytoscapeNodeData = {
            type: nodeType,
            id: nodeType + '--' + uuidv4(),
            // SCOs do not have the created property
            created: stixObjectCategory !== 'sco' ?
                moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
                : undefined,
            // SCOs and Marking Definitions do not have the modified property
            modified: stixObjectCategory !== 'sco' && nodeType !== "marking-definition" ?
                moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
                : undefined,
            spec_version: "2.1",
            label: label
        };
        // SCOs do not have the created or modified property
        if (stixObjectCategory !== 'sco') {
            cytoscapeNode.created = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            if (nodeType !== "marking-definition") {
                cytoscapeNode.modified = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
            }
        }
        return createCytoscapeNode(cytoscapeNode, dSource, true, imgUrl);
    }

    // Auto Select the Added Node if nothing else is already selected.
    function autoSelectNewNode(cy: cytoscape.Core, addedNode: SingularElementReturnValue) {
        if (cy) {
            const selectedNodes = cy.$(':selected');
            if (selectedNodes.length === 0) {
                addedNode.select();
                setSelectedSTIXObject(addedNode.data("raw_data"));
                setSelectionExists(true);
                setIsPropertyPanelOpen(true);
            }
        }
    }

    // Show STIX props panel on node/edge click
    cyInstance?.on('click', 'node, edge', (evt: cytoscape.EventObject) => {
        const ele: cytoscape.CollectionReturnValue = evt.target;
        cyInstance.$(':selected').unselect();
        if (ele.empty() || ele.length > 1) {
            return;
        }
        setSelectedSTIXObject(ele.data("raw_data"));
        setSelectionExists(true);
        setIsPropertyPanelOpen(true);
    });

    cyInstance?.on('boxselect', 'node, edge', (evt: cytoscape.EventObject) => {
        const ele: cytoscape.CollectionReturnValue = evt.target;
        if (selectedSTIXObject || ele.empty() || ele.length > 1) return;
        const data = ele.data("raw_data");
        if (!data) return;
        setSelectedSTIXObject(data);
        setSelectionExists(true);
        setIsPropertyPanelOpen(true);
    });

    cyInstance?.on('add', 'node', () => setNodesExist(true));
    cyInstance?.on('remove', 'node', () => setNodesExist(cyInstance.$('node').length > 0));

    // NOTE: For some reason, dragging a node and running the layout loses the edge handles. Need to figure out how to fix this before forcing nodes to relayout when the user tries to drag them.
    // cyInstance?.on('dragfree', 'node', () => {
    //     if (cyInstance) {
    //         runLayout(getStigLayoutSettingsFromStore(), cyInstance);
    //     }
    //     //
    // });

    // Hide STIX props panel when node/edge is unselected
    cyInstance?.on('unselect', 'node, edge', (evt: cytoscape.EventObject) => {
        setSelectedSTIXObject(undefined);
        setSelectionExists(false);
        setIsPropertyPanelOpen(false);
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
