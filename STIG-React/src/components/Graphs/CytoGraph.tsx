import React, { useContext, useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { EventContext } from '@/contexts/EventContext';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '../../contexts/useTheme';


const Graph: React.FC = () => {
    const cyRef = useRef<HTMLDivElement>(null);
    const [cy, setCy] = useState<cytoscape.Core | null>(null);
    const { addEventListener, removeEventListener } = useContext(EventContext);
    const { theme, toggleTheme } = useTheme();

    let nodeTextLightColor: string = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-dark-hex-100');
    let nodeTextDarkColor: string = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-dark-hex-900');

    useEffect(() => {
        if (cy) {
            cy.style()
                .selector('node')
                .style({
                    'color': theme === 'dark' ? nodeTextLightColor : nodeTextDarkColor,
                    //'text-outline-color': theme === 'light' ? '#fff' : '#000'
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

        return () => {
            removeEventListener('stencilMouseUpEvent', handleCustomEvent);
        };
    }, [addEventListener, removeEventListener]);


    useEffect(() => {
        if (cyRef.current) {
            const cyInstance = cytoscape({
                container: cyRef.current,
                elements: [],
                style: [
                    {
                        selector: 'node',
                        style: {
                            'background-image': 'data(image)',
                            'background-fit': 'cover',
                            'label': 'data(label)',
                            'color': theme === 'dark' ? nodeTextLightColor : nodeTextDarkColor,
                            'font-size': 14,
                            'width': 50,
                            'height': 50,
                            'text-margin-y': -8,
                            'shape': 'roundrectangle',
                        },
                    },
                    {
                        selector: 'edge',
                        style: {
                            'width': 3,
                            'line-color': '#ccc',
                            'target-arrow-color': '#ccc',
                            'target-arrow-shape': 'triangle',
                        },
                    },
                ],
                layout: {
                    name: 'grid',
                    rows: 1,
                },
            });
            setCy(cyInstance);

            const handleAddNode = (event: CustomEvent) => {
                const { id, label, imageUrl, position } = event.detail;
                cyInstance.add({
                    group: 'nodes',
                    data: { id, label, image: imageUrl },
                    position: position,
                });
                //cyInstance.layout({ name: 'grid' }).run(); // TODO: Change to selected layout...
            };

            const graphElement = cyRef.current;
            graphElement.addEventListener('addNode', handleAddNode as EventListener);

            return () => {
                graphElement.removeEventListener('addNode', handleAddNode as EventListener);
            };
        }
    }, []);

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        //const id = event.dataTransfer.getData('text');
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

    return <div ref={cyRef}
        style={{ width: '100%', height: '100%' }}
        onDrop={handleDrop}
        onDragOver={handleDragOver} />;
};

export default Graph;
