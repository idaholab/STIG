import React from 'react';
import { stencilItems } from '../elements/StencilItems';

type StencilLibraryProps = {
    type: string;
    onAddNode: (name: string, imageUrl: string) => void;
    searchText?: string;
    isOpen: boolean;
};

const StencilLibrary: React.FC<StencilLibraryProps> = ({ type, onAddNode, searchText, isOpen }) => {
    let filteredItems = stencilItems.filter(item => item.type === type);
    if (searchText) {
        filteredItems = filteredItems.filter(item => item.alt.toLowerCase().includes(searchText?.toLowerCase()));
    }

    const handleDragStart = (event: React.DragEvent, name: string, imageUrl: string) => {
        event.dataTransfer.setData('text', name);
        event.dataTransfer.setData('imageUrl', imageUrl);
    };

    const handleClickAddNode = (name: string, imageUrl: string) => {
        onAddNode(name, imageUrl);
    };

    return (
        <ul className='pl-0'>
            <div className="stencil px-4 pl-0 flex flex-col flex-grow">
                {filteredItems.length ?
                    filteredItems.map(item => (
                        <li key={item.id}>
                            <div
                                className={`stencil-item ${!isOpen ? 'px-0' : ''} cursor-pointer flex items-center`}
                                draggable
                                onMouseUp={() => handleClickAddNode(item.alt, item.imageUrl)}
                                onDragStart={(event) => handleDragStart(event, item.alt, item.imageUrl)}
                            >
                                <img src={item.imageUrl} alt={item.alt} className="w-8 h-8" />
                                {isOpen ?
                                    <span className="ml-4">{item.alt}</span>
                                    :
                                    null
                                }
                            </div>
                        </li>
                    ))
                    : <p>No {type.toUpperCase()}s match the filter text.</p>
                }
            </div>
        </ul>
    );
};

export default StencilLibrary;
