import React, { useState, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks/reduxTypescriptHooks';
import { EventContext } from '@/contexts/EventContext';
import FormElementTextInput from '../forms/formElements/FormElementTextInput';
import AccordionSection from './AccordionSection';
import StencilLibrary from '../Graphs/StencilLibrary';

const Drawer = () => {
  const [stencilFilterText, setStencilFilterText] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null); // Create a ref for focus

  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const storeReportsSharedList = useAppSelector((state: any) => state.appState.reportsSharedList);
  const storeCommonLinksList = useAppSelector((state: any) => state.appState.commonLinksList);
  const selectedReportIndex = useAppSelector((state: any) => state.appState.selectedReportIndex);

  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({ sdo: true, sco: true });

  const toggleAccordion = (section: string) => {
    setOpenSections(prevState => ({ ...prevState, [section]: !prevState[section] }));
  };

  const toggleDrawer = (shouldOpen: boolean) => {
    setIsOpen(shouldOpen);
  };

  const { dispatchEvent } = useContext(EventContext);
  const handleAddStencilNode = (name: string, imageUrl: string) => {
    const customEvent = new CustomEvent('addNode', {
      detail: {
        label: name,
        imageUrl,
        position: { x: 200, y: 200 },
      },
    });
    dispatchEvent('stencilMouseUpEvent', { data: customEvent });
  };

  const handleIconClick = () => {
    if (!isOpen) {
      toggleDrawer(true);
    }
    // Focus on the input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <aside className={`flex flex-col bg-gray-300 dark:bg-gray-950 text-base-content ${isOpen ? 'w-80' : 'w-20'} transition-all`} style={{ height: 'calc(100vh - 64px)' }}>
      <div className="flex flex-col justify-between h-full overflow-hidden">
        <div className={`p-2 flex items-center ${isOpen ? 'justify-end' : 'justify-center'}`}>
          <button
            onClick={() => toggleDrawer(!isOpen)}
            className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label={isOpen ? "Collapse drawer" : "Expand drawer"}
          >
            <span className="material-icons text-xl">
              {isOpen ? 'menu_open' : 'menu'}
            </span>
          </button>
        </div>

        {isOpen ? (
          <ul className="m-4">
            <li className="mb-2 relative">
              <FormElementTextInput
                placeholder='FILTER'
                placeholderInInput
                value={stencilFilterText}
                type="text"
                onChange={(event) => setStencilFilterText(event.target.value)}
                includeX
                onX={() => setStencilFilterText("")}
                additionalXClasses='absolute left-[260px]'
                className="w-full"
                prefix='filter_alt'
                ref={inputRef}  // Attach ref here for filter bar focus
              />
            </li>
          </ul>
        ) : (
          <div className="flex items-center justify-center p-2">
            <button onClick={handleIconClick} className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition" aria-label="Expand drawer">
              <span className="material-icons text-xl">filter_alt</span>
            </button>
          </div>
        )}

        <div className="flex-grow overflow-y-auto scrollbar">
          <ul className="menu text-gray-800 dark:text-gray-200">
            <li>
              <AccordionSection title={isOpen ? "STIX Domain Objects (SDO)" : "SDO"} isOpen={openSections['sdo']}>
                <div className={`transition-all ${isOpen ? 'hidden' : 'flex justify-center'}`}>
                  <StencilLibrary type="sdo" onAddNode={handleAddStencilNode} searchText={stencilFilterText} isOpen={isOpen} />
                </div>
              </AccordionSection>
            </li>
            <li>
              <AccordionSection title={isOpen ? "STIX Cyber-Observable Objects (SCO)" : "SCO"} isOpen={openSections['sco']}>
                <div className={`transition-all ${isOpen ? 'block' : 'hidden'}`}>
                  <StencilLibrary type="sco" onAddNode={handleAddStencilNode} searchText={stencilFilterText} isOpen={isOpen} />
                </div>
                <div className={`transition-all ${isOpen ? 'hidden' : 'flex justify-center'}`}>
                  <div className="icon-container">
                    <StencilLibrary type="sco" onAddNode={handleAddStencilNode} searchText={stencilFilterText} isOpen={isOpen} />
                  </div>
                </div>
              </AccordionSection>
            </li>
          </ul>
        </div>

        {isOpen && (
          <div className="m-4">
            <span className="copyright-box">©{new Date().getFullYear()} Idaho National Laboratory</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Drawer;
