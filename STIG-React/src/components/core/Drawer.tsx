import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import StencilLibrary from '../Graphs/StencilLibrary';
import AccordionSection from './AccordionSection';
import { EventContext } from '@/contexts/EventContext';

const Drawer = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    sdo: false,
    sco: false,
  });

  const toggleAccordion = (section: string) => {
    setOpenSections(prevState => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

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

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    const isRootActive = path === '/' && currentPath === '/';
    const isExactMatch = currentPath === path;
    return isRootActive ? 'bg-gray-300 dark:bg-gray-700' : '';
  };

  function handleFilterChange(filterText: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <>
      <aside className="flex flex-col bg-gray-300 dark:bg-gray-950 text-base-content w-80 overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="flex flex-col justify-between h-full overflow-hidden">
          <div className="flex-grow scrollbar">
            <ul className="menu text-gray-800 dark:text-gray-200 w-80 ">
              <li>
                {/*<FilterBar onFilterChange={handleFilterChange} />  Pass the handler */}
                {/* Other menu items */}
                <Link to={'/'} className={`px-2 !gap-0 ${isActive('/')}`}>
                  <span className="material-icons mr-2">dashboard</span>
                  <span className={`whitespace-nowrap overflow-hidden`}>
                    Getting Started
                  </span>
                </Link>
              </li>
              <li>
                <AccordionSection title="Stix Domain Objects (SDO)" isOpen={openSections['sdo']} toggleAccordion={() => toggleAccordion('sdo')}>
                  <StencilLibrary type="sdo" onAddNode={handleAddStancilNode} />
                </AccordionSection>
              </li>
              <li>
                <AccordionSection title="Stix Cyber-Observable Objects (SCO)" isOpen={openSections['sco']} toggleAccordion={() => toggleAccordion('sco')}>
                  <StencilLibrary type="sco" onAddNode={handleAddStancilNode} />
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
