import React, { useState, useContext, useRef, useEffect } from 'react';
import { EventContext } from '@/contexts/EventContext';
import FormElementTextInput from '../forms/formElements/FormElementTextInput';
import AccordionSection from './AccordionSection';
import StencilLibrary from './StencilLibrary';
import Icon from '@mdi/react';
import { mdiFilter, mdiMenu, mdiMenuOpen } from '@mdi/js';
import { useStigContext } from '@/contexts/StigContext';

const Drawer = () => {
  const { isDrawerOpen, setIsDrawerOpen } = useStigContext();
  const [stencilFilterText, setStencilFilterText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [openAccordionSections] = useState<{ [key: string]: boolean }>({ sdo: true, sco: true, smo: true });
  const { dispatchEvent } = useContext(EventContext);
  const handleAddStencilNode = (label: string, type: string, imageUrl: string) => {
    const customEvent = new CustomEvent('addNode', { detail: { label, type, imageUrl } });
    dispatchEvent('stencilMouseUpEvent', { data: customEvent });
  };

  useEffect(() => {
    if (isDrawerOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDrawerOpen]);

  // Define an array of sections
  const accordionSections = isDrawerOpen
    ? [{ type: 'sdo', title: 'STIX Domain Objects (SDO)' }, { type: 'sco', title: 'STIX Cyber-Observable Objects (SCO)' }, { type: 'smo', title: 'STIX Meta Objects (SMO)' },]
    : [{ type: 'sdo', title: 'SDO' }, { type: 'sco', title: 'SCO' }, { type: 'smo', title: 'SMO' },
    ];

  const [accordionContainerHeight, setAccordionContainerHeight] = useState<string>('0px');

  useEffect(() => {
    const calculateHeight = () => {
      const calculatedHeight = window.innerHeight - 64;
      setAccordionContainerHeight(`${calculatedHeight}px`);
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);

    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

  const handleFilterIconClick = () => {
    if (!isDrawerOpen) {
      setIsDrawerOpen(true);
    }
  };

  return (
    <aside style={{ width: '0px', overflow: 'visible', zIndex: 1 }}>
      <div
        className={`flex bg-neutralc-300 dark:bg-neutralc-950 text-base-content transition-all max-w-[281px]`}
        style={{ height: accordionContainerHeight, width: isDrawerOpen ? '281px' : '81px' }}>
        <div className="flex flex-col justify-between  w-full h-full overflow-hidden relative">
          <div className={`mt-4 flex items-center ${isDrawerOpen ? 'justify-end' : 'justify-center'}`}>
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-neutralc-200 dark:hover:bg-neutralc-700 transition"
              aria-label={isDrawerOpen ? 'Collapse drawer' : 'Expand drawer'}>
              <Icon path={isDrawerOpen ? mdiMenuOpen : mdiMenu} size={1} />
            </button>
          </div>
          <div className="flex items-center justify-center mt-3 mb-6">
            {isDrawerOpen ? (
              <FormElementTextInput
                placeholder="FILTER STIX NODES"
                value={stencilFilterText}
                type="text"
                onChange={(event) => setStencilFilterText(event.target.value)}
                includeX
                onX={() => setStencilFilterText('')}
                additionalXClasses={`hover:dark:text-white`}
                additionalInputClasses={`h-9`}
                includeInfo={false}
                className="w-full mx-4"
                prefix={mdiFilter}
                ref={inputRef} // Attach ref here for filter bar focus
                badgeText={stencilFilterText?.length > 0 ? 'Stencils are Filtered!' : undefined} />
            ) : (
              <button
                onClick={handleFilterIconClick}
                className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-neutralc-200 dark:hover:bg-neutralc-700 transition"
                aria-label="Expand drawer">
                <Icon path={mdiFilter} size={1} />
              </button>
            )}
          </div>

          <div className="flex flex-col flex-grow h-full scrollbar mb-6">
            <ul className={`menu p-0 flex flex-col justify-start`}>
              {accordionSections.map((section) => (
                <li className="flex" key={section.type}>
                  <AccordionSection title={section.title} isOpen={openAccordionSections[section.type]}>
                    <StencilLibrary
                      type={section.type}
                      onAddNode={handleAddStencilNode}
                      searchText={stencilFilterText}
                      isPanelOpen={isDrawerOpen}
                    />
                  </AccordionSection>
                </li>
              ))}
            </ul>
          </div>

          {isDrawerOpen && (
            <div className="flex justify-center w-full py-2 z-50 bottom-0 dark:bg-neutralc-950 bg-neutralc-300">
              <span className="copyright-box">©{new Date().getFullYear()} Idaho National Laboratory</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
export default Drawer;
