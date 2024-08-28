import React from 'react';
import { stencilItems } from '../elements/StencilItems';
import { StixType } from '@/types/Core';
import AlertComponent from '../elements/AlertComponent';

type StencilLibraryProps = {
    type: string;
    onAddNode: (label: string, type: StixType, imageUrl: string) => void;
    searchText?: string;
    isAccordionOpen: boolean;
    isPanelOpen: boolean;
};

const StencilLibrary: React.FC<StencilLibraryProps> = ({ type, onAddNode, searchText, isAccordionOpen, isPanelOpen }) => {
    let filteredItems = stencilItems.filter(item => item.type === type);
    if (searchText) {
        filteredItems = filteredItems.filter(item => item.alt.toLowerCase().includes(searchText?.toLowerCase()));
    }

    const handleDragStart = (event: React.DragEvent, label: string, type: StixType, imageUrl: string) => {
        event.dataTransfer.setData('text', label);
        event.dataTransfer.setData('imageUrl', imageUrl);
        event.dataTransfer.setData('type', type);
    };

    const handleClickAddNode = (label: string, type: StixType, imageUrl: string) => {
        onAddNode(label, type, imageUrl);
    };

    return (
        <ul className={`ms-0 p-0 stencil-list flex flex-grow transition-all h-full`} >
            <div className="stencil flex flex-col flex-grow">
                {filteredItems.length ?
                    filteredItems.map(item => (
                        <li key={item.id}>
                            <div
                                className={`stencil-item cursor-pointer flex items-center`}
                                draggable
                                onMouseUp={() => handleClickAddNode(item.alt, item.id, item.imageUrl)}
                                onDragStart={(event) => handleDragStart(event, item.alt, item.id, item.imageUrl)}
                            >
                                <img src={item.imageUrl} alt={item.alt} className={` w-8 h-8 max-w-8 min-w-8 ${isPanelOpen ? 'ml-4' : 'm-0'} `} />
                                {isPanelOpen &&
                                    <span className="ml-4">{item.alt}</span>
                                }
                            </div>
                        </li>
                    ))
                    :
                    (isPanelOpen &&
                        <AlertComponent alertText={`Warning: No ${type.toUpperCase()}s match the filter text`} alertType="warning" className='' />
                    )
                }
            </div>
        </ul>
    );
};

export default StencilLibrary;
