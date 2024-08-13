import React from 'react';

interface DropdownProps {
  title: string;
  children?: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown dropdown-bottom">
      <div tabIndex={0} role="button" className="btn btn-ghost" onClick={handleToggle}>
        {title}
        <span className="material-icons">arrow_drop_down</span>
      </div>
      {isOpen && (
        <ul tabIndex={0} className="dark:bg-gray-950 border border-black dark:border-none dropdown-content menu bg-gray-100 rounded-[4px] z-[1] p-2 shadow" style={{ outline: 'none' }}>
          {children}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;