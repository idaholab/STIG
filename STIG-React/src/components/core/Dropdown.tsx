import { mdiMenuDown } from '@mdi/js';
import Icon from '@mdi/react';
import React from 'react';

interface DropdownProps {
  title: string;
  includeDropdownArrow?: boolean;
  filter?: string;
  setFilter?: (f: string) => void;
  additionalClasses?: string;
  additionalButtonClasses?: string;
  additionalOptionClasses?: string;
  children?: React.ReactNode;
  fixed?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  includeDropdownArrow,
  filter,
  setFilter,
  additionalClasses,
  additionalButtonClasses,
  additionalOptionClasses,
  children,
  fixed,
}) => <div className={`dropdown dropdown-bottom ${additionalClasses ?? ''} `}>
    <div
      tabIndex={0}
      role="button"
      className={filter === undefined ? `btn btn-ghost ${additionalButtonClasses ?? ''}` : "flex"}
    >
      {filter === undefined ? <span>{title}</span> : <input
        type="text"
        placeholder={title}
        value={filter}
        onChange={e => setFilter && setFilter(e.target.value)}
        onFocus={e => e.target.placeholder = ""}
        onBlur={(e => e.target.placeholder = title)}
        style={{ marginLeft: "7px", outline: "none" }}
        className={`w-full rounded-md bg-neutralc-100 dark:bg-neutralc-900 placeholder-neutralc-500 dark:placeholder-neutralc-300 hide-placeholder`}
      />}
      {includeDropdownArrow &&
        <Icon path={mdiMenuDown} size={1} />
      }
    </div>
    <ul
      tabIndex={0}
      className={`dark:bg-neutralc-950 border border-neutralc-300 dark:border-none dropdown-content menu bg-neutralc-100 rounded-[4px] z-40 p-2 shadow absolute `}
      style={{ outline: 'none', position: fixed ? 'fixed' : undefined }}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            className: `${additionalOptionClasses ?? ''} ${child.props.className ?? ''}`
          });
        }
        return child;
      })}
    </ul>
  </div>;

export default Dropdown;