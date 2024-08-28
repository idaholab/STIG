import React, { useState, useContext, useRef, useEffect } from 'react';
import { EventContext } from '@/contexts/EventContext';
import FormElementTextInput from '../forms/formElements/FormElementTextInput';
import AccordionSection from './AccordionSection';
import StencilLibrary from './StencilLibrary';

import { StixType } from '@/types/Core';

const Drawer = () => {
  const [stencilFilterText, setStencilFilterText] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [openAccordionSections, setOpenAccordionSections] = useState<{ [key: string]: boolean }>({ sdo: true, sco: true });

  const toggleDrawer = (shouldOpen: boolean) => {
    setIsPanelOpen(shouldOpen);
  };

  const { dispatchEvent } = useContext(EventContext);
  const handleAddStencilNode = (label: string, type: StixType, imageUrl: string) => {
    const customEvent = new CustomEvent('addNode', {
      detail: {
        label,
        type,
        imageUrl,
        position: { x: 200, y: 200 },
      },
    });
    dispatchEvent('stencilMouseUpEvent', { data: customEvent });
  };

  const handleFilterIconClick = () => {
    if (!isPanelOpen) {
      toggleDrawer(true);
    }
  };

  useEffect(() => {
    if (isPanelOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isPanelOpen]);


  // Define an array of sections
  const accordionSections = [
    {
      key: 'sdo',
      title: isPanelOpen ? "STIX Domain Objects (SDO)" : "SDO",
      type: 'sdo',
    },
    {
      key: 'sco',
      title: isPanelOpen ? "STIX Cyber-Observable Objects (SCO)" : "SCO",
      type: 'sco',
    },
  ];

  const [accordionContainerHeight, setAccordionContainerHeight] = useState<string>('0px');

  useEffect(() => {
    const calculateHeight = () => {
      const calculatedHeight = window.innerHeight - 64;
      setAccordionContainerHeight(`${calculatedHeight}px`);
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);

    return () => {
      window.removeEventListener('resize', calculateHeight);
    };
  }, []);

  return (
    <aside className={`flex bg-gray-300 dark:bg-gray-950 text-base-content transition-all max-w-[281px]`} style={{ height: accordionContainerHeight }}>
      <div className="flex flex-col justify-between  w-full h-full overflow-hidden relative">
        <div className={`mt-4 flex items-center ${isPanelOpen ? 'justify-end' : 'justify-center'}`}>
          <button
            onClick={() => toggleDrawer(!isPanelOpen)}
            className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label={isPanelOpen ? "Collapse drawer" : "Expand drawer"}
          >
            <span className="material-icons text-xl">
              {isPanelOpen ? 'menu_open' : 'menu'}
            </span>
          </button>
        </div>
        <div className="flex items-center justify-center mt-3 mb-6">
          {isPanelOpen ? (
            <FormElementTextInput
              placeholder='FILTER STENCILS'
              value={stencilFilterText}
              type="text"
              onChange={(event) => setStencilFilterText(event.target.value)}
              includeX
              onX={() => setStencilFilterText('')}
              additionalXClasses={`hover:dark:text-white`}
              additionalInputClasses={`h-9`}
              includeInfo={false}
              infoText={'Filter the stencils'}
              className="w-full mx-4"
              prefix='filter_alt'
              ref={inputRef}  // Attach ref here for filter bar focus
              badgeText={stencilFilterText?.length > 0 ? 'Stencils are Filtered!' : undefined}
            />
          ) : (
            <button onClick={handleFilterIconClick} className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition" aria-label="Expand drawer">
              <span className="material-icons text-xl">filter_alt</span>
            </button>
          )}
        </div>


        <div className="flex flex-col flex-grow h-full scrollbar" >
          <ul className={`menu p-0 flex flex-col justify-start `}>
            {accordionSections.map(section => (
              <li className="flex" key={section.key}>
                <AccordionSection
                  title={section.title}
                  isOpen={openAccordionSections[section.key]}
                >
                  <StencilLibrary
                    type={section.type}
                    onAddNode={handleAddStencilNode}
                    searchText={stencilFilterText}
                    isAccordionOpen={openAccordionSections[section.key]}
                    isPanelOpen={isPanelOpen}
                  />
                </AccordionSection>
              </li>
            ))}
          </ul>
        </div>

        {isPanelOpen && (
          <div className="flex justify-center w-full py-2 absolute z-50 bottom-0 dark:bg-gray-950 bg-gray-300">
            <span className="copyright-box">©{new Date().getFullYear()} Idaho National Laboratory</span>
          </div>
        )}
      </div>
    </aside>
  );
};
export default Drawer;
