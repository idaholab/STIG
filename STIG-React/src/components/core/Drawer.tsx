import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks/reduxTypescriptHooks';
import { EventContext } from '@/contexts/EventContext';
import AccordionSection from './AccordionSection';
import StencilLibrary from '../Graphs/StencilLibrary';

const Drawer = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const storeReportsSharedList = useAppSelector((state: any) => state.appState.reportsSharedList);
  const storeCommonLinksList = useAppSelector((state: any) => state.appState.commonLinksList);
  const selectedReportIndex = useAppSelector((state: any) => state.appState.selectedReportIndex);

  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    sdo: false,
    sco: false,
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleAccordion = (section: string) => {
    setOpenSections(prevState => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const { dispatchEvent } = useContext(EventContext);
  const handleAddStencilNode = (name: string, imageUrl: string) => {
    const customEvent = new CustomEvent('addNode', {
      detail: {
        label: name,
        imageUrl,
        position: { x: 200, y: 200 }, // TODO: modify this to set a specific position.
      },
    });
    dispatchEvent('stencilMouseUpEvent', { data: customEvent });
  };

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    return currentPath === path ? 'bg-gray-300 dark:bg-gray-700' : '';
  };

  return (
    <aside className={`flex flex-col bg-gray-300 dark:bg-gray-950 text-base-content ${isCollapsed ? 'w-20' : 'w-80'} transition-all`} style={{ height: 'calc(100vh - 64px)' }}>
      <div className="flex flex-col justify-between h-full">
        <div className="flex-grow overflow-auto grid scrollbar">
          <ul className="menu text-gray-800 dark:text-gray-200">
            <li>
              <button
                onClick={toggleCollapse}
                className="flex items-center justify-center w-[40px] h-[40px] rounded-lg my-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <span className="material-icons">
                  {isCollapsed ? 'menu' : 'menu_open'}
                </span>
              </button>
            </li>
            <li>
              <Link
                to={'/'}
                className={`px-2 h-[48px] flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive('/')}`}>
                <span className="material-icons mr-2">
                  dashboard
                </span>
                {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">Getting Started</span>}
              </Link>
            </li>
            <li>
              <AccordionSection
                title="Stix Domain Objects (SDO)"
                isOpen={openSections['sdo']}
                toggleAccordion={() => toggleAccordion('sdo')}
              >
                <StencilLibrary type="sdo" onAddNode={handleAddStencilNode} />
              </AccordionSection>
            </li>
            <li>
              <AccordionSection
                title="Stix Cyber-Observable Objects (SCO)"
                isOpen={openSections['sco']}
                toggleAccordion={() => toggleAccordion('sco')}
              >
                <StencilLibrary type="sco" onAddNode={handleAddStencilNode} />
              </AccordionSection>
            </li>
          </ul>
        </div>
        {!isCollapsed && (
          <div className="m-4">
            <span className="copyright-box">&copy;{new Date().getFullYear()} Idaho National Laboratory</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Drawer;
