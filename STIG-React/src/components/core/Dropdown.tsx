import React from 'react';

interface DropdownProps {
  title: string;
  includeDropdownArrow?: boolean;
  additionalClasses?: string;
  additionalButtonClasses?: string;
  additionalOptionClasses?: string;
  children?: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ title, includeDropdownArrow,
  additionalClasses,
  additionalButtonClasses,
  additionalOptionClasses,
  children
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`dropdown dropdown-bottom ${additionalClasses}`}>
      <div
        tabIndex={0}
        role="button"
        className={`btn btn-ghost ${additionalButtonClasses}`}
        onClick={handleToggle}
      >
        {title}
        {includeDropdownArrow && <span className="material-icons">arrow_drop_down</span>}
      </div>
      {isOpen && (
        <ul
          tabIndex={0}
          className={`dark:bg-gray-950 border border-black dark:border-none dropdown-content menu bg-gray-100 rounded-[4px] z-[1] p-2 shadow`}
          style={{ outline: 'none' }}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<any>, {
                className: `${additionalOptionClasses} ${child.props.className || ''}`
              });
            }
            return child;
          })}
        </ul>
      )}

      {/* {isOpen && (
        <ul tabIndex={0} className={`${additionalOptionClasses} dark:bg-gray-950 border border-black dark:border-none dropdown-content menu bg-gray-100 rounded-[4px] z-[1] p-2 shadow`} style={{ outline: 'none' }}>
          {children}
        </ul>
      )} */}
    </div>
  );
};

export default Dropdown;