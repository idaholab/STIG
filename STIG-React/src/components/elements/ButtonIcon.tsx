import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  label?: string;
  buttonIcon: string;
  iconText?: string;
  buttonSize?: string | undefined;
  type: 'btn-primary' | 'btn-neutralc' | 'btn-ghost' | string;
  link?: string;
  title?: string;
  disabled?: boolean;
  tabIndex?: number;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  additionalClasses?: string;
}

const ButtonIcon: React.FC<ButtonProps> = ({
  label, buttonIcon, iconText, buttonSize, type, link,
  title, disabled, tabIndex, onClick, onKeyDown, additionalClasses
}) => {
  // Define base classes
  const baseClasses = `btn btn-circle ${type} ${buttonSize} uppercase hover:opacity-100 border-transparent`;

  // Define conditional light mode classes
  const lightModeClasses = type === 'btn-neutralc' ? 'border border-solid !border-primary text-primary hover:text-primary' : '';
  const btnGhostLightModeClasses = type === 'btn-ghost' ? 'text-neutralc-500 hover:text-black ' : '';

  // Define conditional dark mode classes
  const darkModeClasses = type === 'btn-neutralc' ? 'dark:border dark:border-solid dark:!border-neutralc-400 dark:text-neutralc-300 dark:hover:text-white' : '';
  const btnGhostDarkModeClasses = type === 'btn-ghost' ? 'dark:text-neutralc-300 dark:hover:text-white' : '';

  // Combine base classes and conditional classes
  const btnClass = `${baseClasses} ${lightModeClasses} ${darkModeClasses} ${btnGhostLightModeClasses} ${btnGhostDarkModeClasses} ${additionalClasses}`;

  return (
    <>
      {link ? (
        <Link className={btnClass} to={link} title={title}>
          <span className="material-icons">
            {buttonIcon}
          </span>
        </Link>
      ) : (
        <button
          className={btnClass}
          onClick={onClick}
          // onKeyDown={onKeyDown}
          title={title}
          disabled={disabled}
          tabIndex={tabIndex}
        >
          <span className={`material-icons ${iconText}`}>
            {buttonIcon}
          </span>
        </button>
      )}
    </>
  );
};

export default ButtonIcon;
