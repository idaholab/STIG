import React, { useContext, useEffect, useRef, useState } from 'react';
import cytoscape, { CytoscapeOptions } from 'cytoscape';
import { EventContext } from '@/contexts/EventContext';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '../../contexts/useTheme';
import { compound_style, edge_style, modified_select_style, modified_unselect_style, node_style, select_node_style } from './graphOptions';
import { edgehandles_style, setup_edge_handles } from './edge-handles';
import edgehandles from 'cytoscape-edgehandles';
import { StixNode, StixNodeData } from '@/types/StixNodeData';
import moment from 'moment';
import { Indicator } from '@/types/Indicator';
import { ObservedData } from '@/types/ObservedData';
import { Report } from "@/types/Report";
import { StixType } from '@/types/Core';

cytoscape.use(edgehandles);

const Graph: React.FC = () => {
    const cyRef = useRef<HTMLDivElement>(null);
    const [cy, setCy] = useState<cytoscape.Core | null>(null);
    const { addEventListener, removeEventListener } = useContext(EventContext);
    const { theme, toggleTheme } = useTheme();

    const nodeTextLightColor: string = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-dark-hex-100');
    const nodeTextDarkColor: string = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-dark-hex-900');
    const selectedColor = getComputedStyle(document.documentElement).getPropertyValue('--selected-node-border-color');
    const edgeColorDark = getComputedStyle(document.documentElement).getPropertyValue('--edge-dark-color');
    const edgeColorLight = getComputedStyle(document.documentElement).getPropertyValue('--edge-light-color');

    useEffect(() => {
        if (cy) {
            cy.style()
                .selector('node')
                .style({
                    'color': theme === 'dark' ? nodeTextLightColor : nodeTextDarkColor,
                    //'text-outline-color': theme === 'light' ? '#fff' : '#000'
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
    }, [theme, cy]);

    useEffect(() => {
        const handleCustomEvent = (payload: any) => {
            //const id = payload.data.detail.id;
            const id = uuidv4();
            const label = payload.data.detail.label;
            const imageUrl = payload.data.detail.imageUrl;
            const position = payload.data.detail.position;
            const customEvent = new CustomEvent('addNode', {
                detail: {
                    id,
                    label,
                    imageUrl,
                    position: position,
                },
            });
            cyRef.current?.dispatchEvent(customEvent);
        };

        addEventListener('stencilMouseUpEvent', handleCustomEvent);

        const handleClearGraphClickEvent = () => {
            const clearGraphEvent = new CustomEvent('clearGraph');
            cyRef.current?.dispatchEvent(clearGraphEvent);
        }
        addEventListener('clearGraphClickEvent', handleClearGraphClickEvent);

        return () => {
            removeEventListener('stencilMouseUpEvent', handleCustomEvent);
            removeEventListener('clearGraphClickEvent', handleClearGraphClickEvent);
        };
    }, [addEventListener, removeEventListener]);


    useEffect(() => {
        if (cyRef.current) {

            const cyto_options: CytoscapeOptions = {
                container: cyRef.current,
                style: [node_style, compound_style, edge_style, select_node_style, modified_select_style, modified_unselect_style, ...edgehandles_style],
                wheelSensitivity: 0.25,
                layout: {
                    name: 'grid',
                    rows: 1,
                },
            };
            const cyInstance = cytoscape(cyto_options);
            setCy(cyInstance);

            const eh = setup_edge_handles(cyInstance);

            // const eh = cyInstance.edgehandles({
            //     toggleOffOnLeave: true,
            //     handleNodes: 'node',
            //     handlePosition: function (node) {
            //         return 'middle top';
            //     },
            //     edgeType: function (sourceNode, targetNode) {
            //         return 'flat';
            //     },
            //     complete: function (sourceNode, targetNode, addedEles) {
            //         console.log('Edge created:', addedEles);
            //     },
            // });
            cyInstance.on('ehcomplete', (event, sourceNode, targetNode, addedEles) => {
                console.log('Edge created:', addedEles);
            });



            const handleAddNode = (event: CustomEvent) => {
                const { id, label, imageUrl, position } = event.detail;

                // TODO: Create stix object
                //let node = handleAddStixNode(label);

                cyInstance.add({
                    group: 'nodes',
                    data: { id, label, image: imageUrl },
                    position: position,
                });
                //cyInstance.layout({ name: 'grid' }).run(); // TODO: Change to selected layout...
            };

            const handleClearGraph = () => {
                cyInstance.elements().remove();
                cyInstance.reset();
            }

            const graphElement = cyRef.current;
            graphElement.addEventListener('addNode', handleAddNode as EventListener);
            graphElement.addEventListener('clearGraph', handleClearGraph);

            return () => {
                graphElement.removeEventListener('addNode', handleAddNode as EventListener);
                graphElement.removeEventListener('clearGraph', handleClearGraph);
            };
        }
    }, []);



    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        const id = uuidv4();
        const label = event.dataTransfer.getData('text');
        const imageUrl = event.dataTransfer.getData('imageUrl');
        const position = cyRef.current ? cyRef.current.getBoundingClientRect() : { x: 0, y: 0 };
        const x = event.clientX - position.x;
        const y = event.clientY - position.y;

        const customEvent = new CustomEvent('addNode', {
            detail: {
                id,
                label,
                imageUrl,
                position: { x, y },
            },
        });

        cyRef.current?.dispatchEvent(customEvent);
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
    };




    function handleAddStixNode(nodeType: StixType): StixNode | undefined {

        const opts: StixNodeData = {
            type: nodeType,
            id: nodeType + '--' + uuidv4(),
            created: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
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

        // let rtnNode: StixNode = { data: {} };
        // rtnNode.data = opts;


        // const labelorder = ['name', 'value', 'key', 'path', 'product', 'dst_port', 'command_line', 'type', 'id'];
        // let nodelabel: string | undefined;
        // if (nodeType === 'marking-definition') {
        //     nodelabel = rtnNode.data.name;
        // } else {
        //     for (const element of labelorder) {
        //         if (Object.prototype.hasOwnProperty.call(rtnNode.data, element)) {
        //             if (element === 'dst_port') {
        //                 const { [element]: nodelabel1, src_port, protocols } = rtnNode.data;
        //                 nodelabel = src_port.toString().concat(' -> ', nodelabel1.toString(), '/', protocols.toString());
        //             } else {
        //                 const { [element]: nodelabel1 } = rtnNode.data;
        //                 nodelabel = nodelabel1;
        //             }
        //             break;
        //         }
        //     }
        // }

        // this.data = {
        //     id: rtnNode.data.id,
        //     label: nodelabel,
        //     type: nodeType,
        //     level: 1,
        //     created: rtnNode.data.created,
        //     description: rtnNode.data.description,
        //     saved: false,
        //     raw_data: rtnNode.data,
        //     data_source: d_source
        // };
        // if (nodelabel && nodelabel.length > 60) {
        //     nodelabel = nodelabel.substring(0, 60).concat('...');
        // }
        // this.data.name = nodelabel;
        // this.data.modified = rtnNode.data.modified;

        // this.position = {
        //     x: 100,
        //     y: 100
        // };
        // const style: CSSStyleDeclaration = { backgroundImage: node_img[nodeType] } as unknown as CSSStyleDeclaration;
        // this.style = style;
        // if (this.data.data_source === 'DB' || this.data.data_source === 'IGNORE') {
        //     this.saved = true;
        // } else {
        //     this.saved = false;
        // }
        // this.data.saved = this.saved;
        // this.classes = 'stix_node';

        return undefined;//rtnNode
    };

    return <div ref={cyRef}
        style={{ width: '100%', height: '100%' }}
        onDrop={handleDrop}
        onDragOver={handleDragOver} />;
};

export default Graph;
