import { mdiMenuDown } from '@mdi/js';
import Icon from '@mdi/react';
import React from 'react';

type DropdownProps = {
  title: string;
  includeDropdownArrow?: boolean;
  filter?: string;
  setFilter?: (f: string) => void;
  additionalLabelClasses?: string;
  iconSize?: number;
  additionalClasses?: string;
  additionalButtonClasses?: string;
  additionalOptionContainerClasses?: string;
  additionalOptionClasses?: string;
  children?: React.ReactNode;
};

const Dropdown: React.FC<DropdownProps> = ({
  title,
  includeDropdownArrow,
  filter,
  setFilter,
  additionalLabelClasses,
  iconSize = 1,
  additionalClasses,
  additionalButtonClasses,
  additionalOptionContainerClasses,
  additionalOptionClasses,
  children,
}) => (
  <div className={`dropdown dropdown-bottom ${additionalClasses ?? ''} `}>
    <div tabIndex={0} role="button" className={filter === undefined ? `btn btn-ghost ${additionalButtonClasses ?? ''}` : 'flex'}>
      {filter === undefined ? (
        <span className={`${additionalLabelClasses}`}>{title}</span>
      ) : (
        <input
          type="text"
          placeholder={title}
          value={filter}
          onChange={(e) => setFilter && setFilter(e.target.value)}
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = title)}
          style={{ marginLeft: '7px', outline: 'none' }}
          className={`w-full rounded-md bg-neutralc-100 dark:bg-neutralc-950 placeholder-neutralc-500 dark:placeholder-neutralc-300 hide-placeholder`}
        />
      )}
      {includeDropdownArrow && <Icon path={mdiMenuDown} size={iconSize} />}
    </div>
    <ul
      tabIndex={0}
      className={`bg-neutralc-100 dark:bg-neutralc-950 border border-neutralc-300 dark:border-neutralc-700 rounded-[4px] dropdown-content menu z-10 p-2 absolute ${additionalOptionContainerClasses}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<React.ReactElement>, {
            ...child.props,
            className: `${additionalOptionClasses ?? ''} ${child.props.className ?? ''}`,
          });
        }
        return child;
      })}
    </ul>
  </div>
);

export default Dropdown;
