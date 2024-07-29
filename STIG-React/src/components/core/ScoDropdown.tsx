import React from 'react';
import DropdownWrapper from './Dropdown';

function SCODropdown() {
  const scoItems = [
    { label: 'SCO 1', value: 'sco-1' },
    { label: 'SCO 2', value: 'sco-2' },
    { label: 'SCO 3', value: 'sco-3' },
  ];

  const handleSelect = (value: string) => {
    console.log(`SCO selected: ${value}`);
  };

  return (
    <DropdownWrapper title="SCOs" items={scoItems} onSelect={handleSelect} />
  );
};

export default SCODropdown;