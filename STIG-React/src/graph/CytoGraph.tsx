import React, { useContext, useEffect, useRef, useState } from 'react';

import cytoscape from 'cytoscape';
import { EventContext } from '@/contexts/EventContext';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '../contexts/useTheme';
import { compound_style, edge_style, modified_select_style, modified_unselect_style, node_style, select_node_style, view_utils_options } from './graphOptions';
import { StixNode, StixNodeData } from '@/types/StixNodeData';
import moment from 'moment';
import { Indicator } from '@/types/Indicator';
import { ObservedData } from '@/types/ObservedData';
import { Report } from "@/types/Report";
import { DataSourceType, StixType } from '@/types/Core';
import { layouts } from './graphOptions';
import cosebilkent from 'cytoscape-cose-bilkent';
import dagre from 'cytoscape-dagre';
import klay from 'cytoscape-klay';
import spread from 'cytoscape-spread';
import viewUtilities from 'cytoscape-view-utilities';

import cxtmenu from 'cytoscape-cxtmenu';
import { edgehandles_style, setup_edge_handles } from './edge-handles';
import { useStigPropsContext } from '@/contexts/StigPropsContext';
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
    const { cyInstance, setCyInstance } = useStigPropsContext();

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
    }, [theme, cyInstance, edgeColorDark, edgeColorLight]);

    useEffect(() => {
        const handleCustomEvent = (payload: any) => {
            //const id = payload.data.detail.id;
            const label = payload.data.detail.label;
            const imageUrl = payload.data.detail.imageUrl;
            const position = payload.data.detail.position;
            const customEvent = new CustomEvent('addNode', {
                detail: {
                    label,
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
                    setupCtxMenu(cy, viewUtil);
                }
            }
            catch (e) {
                console.error('View utilities could not be initialized.', e);
            }
            setCyInstance(cy);

            const handleAddNode = (event: CustomEvent) => {
                const { label, imageUrl, position } = event.detail;

                // TODO: Create stix object
                const node = handleAddStixNode(label, imageUrl, position, 'GUI');
                node.group = 'nodes';

                cy?.add(node);

                // cyInstance.add({
                //     group: 'nodes',
                //     data: { id, label, image: imageUrl },
                //     position: position,
                // });
                //cyInstance.layout({ name: 'grid' }).run(); // TODO: Change to selected layout...
            };

            const handleClearGraph = () => {
                cy.elements().remove();
                cy.reset();
            }
            const handleLayoutChangeEvent = (event: CustomEvent) => {
                const { layout } = event.detail;
                // Select all nodes with no parents or children
                const orphans = cy.elements(':orphan').filter(':childless');
                const cyLayout = orphans.layout(layouts[layout]);
                cyLayout.run();
            }

            const graphElement = cyContainerRef.current;
            graphElement.addEventListener('addNode', handleAddNode as EventListener);
            graphElement.addEventListener('clearGraph', handleClearGraph);
            graphElement.addEventListener('changeLayout', handleLayoutChangeEvent as EventListener);
            return () => {
                graphElement.removeEventListener('addNode', handleAddNode as EventListener);
                graphElement.removeEventListener('clearGraph', handleClearGraph);
                graphElement.removeEventListener('changeLayout', handleLayoutChangeEvent as EventListener);

            };
        }
    }, []);

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        const id = uuidv4();
        const label = event.dataTransfer.getData('text');
        const imageUrl = event.dataTransfer.getData('imageUrl');
        const position = cyContainerRef.current ? cyContainerRef.current.getBoundingClientRect() : { x: 0, y: 0 };
        const x = event.clientX - position.x;
        const y = event.clientY - position.y;

        // TODO: Create/Add Stix Node!!!
        handleAddStixNode

        const customEvent = new CustomEvent('addNode', {
            detail: {
                id,
                label,
                imageUrl,
                position: { x, y },
            },
        });

        cyContainerRef.current?.dispatchEvent(customEvent);
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
    };

    function handleAddStixNode(nodeType: StixType, imgUrl: string, position: any, dSource: DataSourceType): StixNode {
        const opts: StixNodeData = {
            type: nodeType,
            id: nodeType + '--' + uuidv4(),
            created: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            level: 1,
        };
        if (nodeType === 'indicator') {
            (opts as Indicator).valid_from = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        } else if (nodeType === 'observed-data') {
            (opts as ObservedData).first_observed = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            (opts as ObservedData).last_observed = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        } else if (nodeType === 'report') {
            (opts as Report).published = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        }

        if (nodeType !== 'marking-definition') {
            opts.name = nodeType;
            opts.modified = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        }

        const style: CSSStyleDeclaration = { backgroundImage: imgUrl } as unknown as CSSStyleDeclaration; //node_img[nodeType]
        let rtnNode: StixNode = { data: opts, style: style, position: position, classes: 'stix_node' };

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
        rtnNode.data.label = nodelabel;
        nodelabel = (nodelabel && nodelabel.length > 60) ? nodelabel.substring(0, 60).concat('...') : nodelabel;
        rtnNode.data.name = nodelabel;
        rtnNode.data.data_source = dSource;
        rtnNode.data.raw_data = rtnNode.data;
        rtnNode.data.description = '??'; // TODO: Must be when adding a node from database... ?? Will need to track this down...
        rtnNode.data.saved = (dSource === 'DB' || dSource === 'IGNORE');
        return rtnNode
    };

    return <div ref={cyContainerRef}
        style={{ width: '100%', height: '100%' }}
        onDrop={handleDrop}
        onDragOver={handleDragOver} />;
};

export default Graph;
