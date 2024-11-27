import React, { useState } from 'react';
import FormElementTextInput from '../forms/formElements/FormElementTextInput';

interface DropdownProps {
  title: string;
  includeDropdownArrow?: boolean;
  filter?: string;
  setFilter?: (f: string) => void;
  additionalClasses?: string;
  additionalButtonClasses?: string;
  additionalOptionClasses?: string;
  children?: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  includeDropdownArrow,
  filter,
  setFilter,
  additionalClasses,
  additionalButtonClasses,
  additionalOptionClasses,
  children
}) => {
  return <div className={`dropdown dropdown-bottom ${additionalClasses}`}>
    <div
      tabIndex={0}
      role="button"
      className={ filter === undefined ? `btn btn-ghost ${additionalButtonClasses}` : "flex"}
    >
      { filter === undefined ? <span>{title}</span> : <input
        type="text"
        placeholder={title}
        value={filter}
        onChange={e => setFilter && setFilter(e.target.value)}
        className={`w-full rounded-md border border-neutralc-500 bg-neutralc-100 dark:bg-neutralc-900 placeholder-neutralc-500 dark:placeholder-neutralc-300`}
      /> }
      {includeDropdownArrow && <span className="material-icons">arrow_drop_down</span>}
    </div>
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
  </div>;
};

export default Dropdown;