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
    <div className="dropdown">
      <button className="dropdown-toggle" onClick={handleToggle}>
        {title}
        <span className="material-icons">arrow_drop_down</span>
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {items.map((item) => (
            <li key={item.value} onClick={() => handleSelect(item.value)}>
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;