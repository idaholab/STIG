import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks/reduxTypescriptHooks';
import { EventContext } from '@/contexts/EventContext';
import FormElementTextInput from '../forms/formElements/FormElementTextInput';
import AccordionSection from './AccordionSection';
import StencilLibrary from '../Graphs/StencilLibrary';

const Drawer = () => {
  const [stencilFilterText, setStencilFilterText] = useState("");

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
                onChange={(event) => { setStencilFilterText(event.target.value) }}
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
                  <StencilLibrary type="sdo" onAddNode={handleAddStencilNode} searchText={stencilFilterText} />
                </AccordionSection>
              </li>
              <li>
                <AccordionSection title="STIX Cyber-Observable Objects (SCO)" isOpen={true}>
                  <StencilLibrary type="sco" onAddNode={handleAddStencilNode} searchText={stencilFilterText} />
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
