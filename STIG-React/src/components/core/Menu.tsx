import React from 'react';
import Dropdown from './Dropdown.tsx';

const dropdownItems = [
  {
    title: 'Dropdown Title', items: [
      { label: 'Option 1', value: '1' },
      { label: "Option 2", value: '2' },
    ]
  },
  { title: 'Edit', items: [] },
  { title: 'COREII Timeline', items: [] },
  { title: 'Context Layouts', items: [] },
  { title: 'Import', items: [] },
  { title: 'Export', items: [] },
  { title: 'Database Profile', items: [] }
];

const Menu: React.FC = () => {
  function handleDropdownSelect(value: string): void {
    console.log(`Selected value: ${value}`);
  }

  return (
    <div className="join dark:bg-gray-900 ml-4 mt-4 border dark:border-transparent z-9000 relative">
      <div className="flex dark:bg-transparent relative z-10">
        <main className="flex-1 z-50">
          {dropdownItems.map(({ title, items }) => (
            <Dropdown
              key={title}
              title={title}
              items={items}
              onSelect={handleDropdownSelect}
            />
          ))}
        </main>
      </div>
    </div>
  );
};

export default Menu;
