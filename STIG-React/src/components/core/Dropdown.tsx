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
  const [isOpen, setIsOpen] = React.useState(true);

  const handleToggle = () => {
    //setIsOpen(!isOpen);
  };

  return (
    <div className={`dropdown dropdown-bottom ${additionalClasses}`}>
      <div
        tabIndex={0}
        role="button"
        className={`btn btn-ghost ${additionalButtonClasses}`}
        onClick={handleToggle}
      >
        <span>{title}</span>
        {includeDropdownArrow && <span className="material-icons">arrow_drop_down</span>}
      </div>
      {isOpen && (
        <ul
          tabIndex={0}
          className={`dark:bg-neutralc-950 border border-neutralc-300 dark:border-none dropdown-content menu bg-neutralc-100 rounded-[4px] z-[1] p-2 shadow`}
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
    </div>
  );
};

export default Dropdown;