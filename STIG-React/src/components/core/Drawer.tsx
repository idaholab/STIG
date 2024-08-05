import React, { useContext, useState } from 'react';
import StencilLibrary from '../Graphs/StencilLibrary';
import AccordionSection from './AccordionSection';
import { EventContext } from '@/contexts/EventContext';
import FormElementTextInput from '../forms/formElements/FormElementTextInput';

const Drawer = () => {
  const [stencilFilterText, setStencilFilterText] = useState("");

  const { dispatchEvent } = useContext(EventContext);
  const handleAddStancilNode = (name: string, imageUrl: string) => {
    const customEvent = new CustomEvent('addNode', {
      detail: {
        label: name,
        imageUrl,
        position: { x: 200, y: 200 }, // TODO: modify this to set a specific position. 
      },
    });
    // Add the node to the graph through context event disbatch
    dispatchEvent('stencilMouseUpEvent', { data: customEvent });
  };

  return (
    <>
      <aside className="flex flex-col bg-gray-300 dark:bg-gray-950 text-base-content w-80 overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="flex flex-col justify-between h-full overflow-hidden">
          <ul className="m-4">
            <li>
              <FormElementTextInput
                placeholder='FILTER STIX OBJECTS'
                placeholderInInput
                value={stencilFilterText}
                type="text"
                onChange={(event) => {setStencilFilterText(event.target.value)}}
                includeX
                onX={() => setStencilFilterText("")}
                additionalXClasses='absolute left-[280px]'
              />
            </li>
          </ul>
          <div className="flex-grow scrollbar">
            <ul className="menu text-gray-800 dark:text-gray-200 w-80">
              <li>
                <AccordionSection title="STIX Domain Objects (SDO)" isOpen={true}>
                  <StencilLibrary type="sdo" onAddNode={handleAddStancilNode} searchText={stencilFilterText}/>
                </AccordionSection>
              </li>
              <li>
                <AccordionSection title="STIX Cyber-Observable Objects (SCO)" isOpen={true}>
                  <StencilLibrary type="sco" onAddNode={handleAddStancilNode} searchText={stencilFilterText}/>
                </AccordionSection>
              </li>
            </ul>
          </div>
          <span className="copyright-box m-4">&copy;{new Date().getFullYear()} Idaho National Laboratory</span>
        </div>
      </aside>
    </>
  );
};

export default Drawer;
