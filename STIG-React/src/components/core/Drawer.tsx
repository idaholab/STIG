import React, { useRef, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks/reduxTypescriptHooks';
import { appStateActions } from '../../../app/store/index';
import FilterBar from './filterBar';
// import { AppReport } from '../../../app/types/types';

import { Link } from 'react-router-dom';
import SDODropdown from './SdoDropdown';

interface OpenSections {
  [key: string]: boolean;
}

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  toggleAccordion: () => void;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, isOpen, toggleAccordion, children }) => {
  const dispatch = useAppDispatch();
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, contentRef.current?.scrollHeight]);

  const handleAddClick = (e: any) => {
    e.stopPropagation();
    // dispatch(appStateActions.toggleNewReportView(true));
  };

  return (
    <div className="collapse bg-base-200">
      <input type="checkbox" checked={isOpen} readOnly className="peer" hidden />
      <div className="collapse-title font-medium flex justify-between items-center cursor-pointer pr-2 pb-0" onClick={toggleAccordion}>
        <span className="flex items-center">
          <span className={`material-icons transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`}>expand_more</span>
          <span className="text-sm font-semibold">
            {title}
          </span>
        </span>
        <button onClick={handleAddClick} className="btn btn-ghost btn-circle btn-sm">
          <span className="material-icons" style={{ fontSize: '1.4rem' }}>add</span>
        </button>
      </div>
      <div
        ref={contentRef}
        className="collapse-content pl-4 pr-2 text-sm overflow-hidden transition-all duration-300 ease-in-out"
        style={{ height: height ? `${height}px` : '0' }}
      >
        {children}
      </div>
    </div>
  );
};

const Drawer = () => {
  const dispatch = useAppDispatch();


  const isActive = (path: string) => {
    const currentPath = location.pathname;
    const isRootActive = path === '/' && currentPath === '/';

    const isExactMatch = currentPath === path;

    // return isRootActive || isOverviewActive || isExactMatch || isFinancialActive || isAttackActive ? 'bg-gray-300 dark:bg-gray-700' : '';

    return isRootActive ? 'bg-gray-300 dark:bg-gray-700' : '';
  };

  function handleFilterChange(filterText: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <>
      <aside className="p-1 bg-slate-300 dark:bg-gray-950 text-base-content w-80" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="flex flex-col justify-between h-full">
          <div>
            <ul className="menu text-gray-800 dark:text-gray-200">
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
                <AccordionSection title="SDOs" isOpen={false} toggleAccordion={() => { }}>
                  <SDODropdown />
                </AccordionSection>
              </li>
              <li>
                <AccordionSection title="SCOs" isOpen={false} toggleAccordion={() => { }}>
                  <SDODropdown />
                </AccordionSection>
              </li>
            </ul>
          </div>
          <div>
            <span className="copyright-box p-2">&copy;{new Date().getFullYear()} Idaho National Laboratory</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Drawer;
