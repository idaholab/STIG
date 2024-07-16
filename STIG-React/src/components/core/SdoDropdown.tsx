import React from 'react';
import DropdownWrapper from './dropdown';

const SDODropdown: React.FC = () => {
  const sdoItems = [
    { label: 'SDO 1', value: 'sdo-1' },
    { label: 'SDO 2', value: 'sdo-2' },
    { label: 'SDO 3', value: 'sdo-3' },
  ];

  const handleSelect = (value: string) => {
    console.log(`SDO selected: ${value}`);
  };

  return (
    <DropdownWrapper title="SDOs" items={sdoItems} onSelect={handleSelect} />
  );
};

export default SDODropdown;