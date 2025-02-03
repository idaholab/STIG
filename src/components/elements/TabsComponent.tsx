import React, { useEffect, useState } from 'react';
import Icon from '@mdi/react';

type Tab = {
  label: string;
  icon: string;
  content?: React.ReactNode;
};

type Props = {
  tabs: Tab[];
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  activeTab?: number;
  extraContainerClassName?: string;
};

const TabsComponent: React.FC<Props> = ({ tabs, setActiveTab, activeTab, extraContainerClassName }) => {
  const [localActiveTab, setLocalActiveTab] = useState(activeTab || 0);

  useEffect(() => {
    if (activeTab !== undefined) {
      setLocalActiveTab(activeTab);
    }
  }, [activeTab, setActiveTab]);

  const setTheActiveTab = (activeTab: number = 0) => {
    setLocalActiveTab(activeTab);
    setActiveTab(activeTab);
  };

  return (
    <div className="tabsComponent flex flex-col w-full h-full ">
      <div role="tablist" className={`tabs tabs-bordered ${extraContainerClassName}`}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab text-neutralc-300 dark:text-neutralc-400 ${localActiveTab === index && 'text-primary-400 dark:text-primary-400'} 
                                ${tab.content === undefined && 'tab-disabled opacity-50'}`}
            role="tab"
            disabled={tab.content === undefined}
            onClick={() => setTheActiveTab(index)}
          >
            <span
              className={`flex items-center text-neutralc-700 dark:text-neutralc-400 hover:dark:text-white hover:text-black
                                ${localActiveTab === index && 'text-neutralc-800 dark:!text-neutralc-200 hover:dark:!text-white hover:!text-black'}`}
            >
              <Icon path={tab.icon} size={1} />
              <span className="ml-2 text-base">{tab.label}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="tab-panel h-full w-full overflow-hidden">{tabs[localActiveTab || 0]?.content}</div>
    </div>
  );
};

export default TabsComponent;
