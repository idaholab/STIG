import React from 'react';

interface DropdownProps {
  title: string;
  items: { label: string; value: string }[];
  onSelect: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ title, items, onSelect }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className="dropdown dropdown-bottom ">
      <div tabIndex={0} role="button" className="btn btn-ghost" onClick={handleToggle}>
        {title}
        <span className="material-icons">arrow_drop_down</span>
      </div>
      {isOpen && (
        <ul tabIndex={0} className="dark:bg-gray-700 dropdown-content menu bg-base-100 rounded-box z-[1] p-2 shadow" style={{ outline: 'none' }}>
          {items.map((item) => (
            <li key={item.value} onClick={() => handleSelect(item.value)} style={{ outline: 'none' }}>
              <a>{item.label}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;