import React from 'react';
import { stencilItems } from '../elements/StencilItems';

type StencilLibraryProps = {
    type: string;
    onAddNode: (name: string, imageUrl: string) => void;
};

const StencilLibrary: React.FC<StencilLibraryProps> = ({ type, onAddNode }) => {
    const filteredItems = stencilItems.filter(item => item.type === type);

    const handleDragStart = (event: React.DragEvent, name: string, imageUrl: string) => {
        event.dataTransfer.setData('text', name);
        event.dataTransfer.setData('imageUrl', imageUrl);
    };

    const handleClickAddNode = (name: string, imageUrl: string) => {
        onAddNode(name, imageUrl);
    };

    return (
        <div className="stencil px-4 flex flex-col flex-grow">
            {filteredItems.map(item => (
                <div
                    key={item.id}
                    className="stencil-item mb-4 cursor-pointer flex items-center"
                    draggable
                    onMouseUp={() => handleClickAddNode(item.alt, item.imageUrl)}
                    onDragStart={(event) => handleDragStart(event, item.alt, item.imageUrl)}
                >
                    <img src={item.imageUrl} alt={item.alt} className="w-8 h-8" />
                    <span className="ml-4">{item.alt}</span>
                </div>
            ))}
        </div>
    );
};

export default StencilLibrary;
