import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';

interface ButtonProps {
  buttonIcon: string;
  iconText?: string;
  buttonSize?: string | undefined;
  type: 'btn-primary' | 'btn-neutralc' | 'btn-ghost' | string;
  link?: string;
  title?: string;
  disabled?: boolean;
  tabIndex?: number;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  additionalClasses?: string;
  iconSize?: number;
}

const ButtonIcon: React.FC<ButtonProps> = ({
  buttonIcon,
  iconText,
  buttonSize,
  type,
  link,
  title,
  disabled,
  tabIndex,
  onClick,
  additionalClasses,
  iconSize = 1,
}) => {
  // Define base classes
  const baseClasses = `btn btn-circle ${type} ${buttonSize} uppercase hover:opacity-100 border-transparent`;

  // Define conditional light mode classes
  const lightModeClasses = type === 'btn-neutralc' ? 'border border-solid !border-primary text-primary hover:text-primary' : '';
  const btnGhostLightModeClasses = type === 'btn-ghost' ? 'text-neutralc-500 hover:text-black ' : '';

  // Define conditional dark mode classes
  const darkModeClasses =
    type === 'btn-neutralc'
      ? 'dark:border dark:border-solid dark:!border-neutralc-400 dark:text-neutralc-300 dark:hover:text-white'
      : '';
  const btnGhostDarkModeClasses = type === 'btn-ghost' ? 'dark:text-neutralc-300 dark:hover:text-white' : '';

  const disabledClass = disabled
    ? type === 'btn-ghost'
      ? 'cursor-not-allowed !text-neutralc-400 !bg-transparent dark:!text-neutralc-400 dark:!bg-transparent'
      : 'cursor-not-allowed !text-neutralc-400 !bg-neutralc-300 dark:!text-neutralc-400 dark:!bg-neutralc-500'
    : '';

  // Combine base classes and conditional classes
  const btnClass = `${baseClasses} ${lightModeClasses} ${darkModeClasses} ${btnGhostLightModeClasses} ${btnGhostDarkModeClasses} ${additionalClasses} ${disabledClass}`;

  return (
    <>
      {link ? (
        <Link className={btnClass} to={link} title={title}>
          <Icon path={buttonIcon} size={iconSize} />
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
          <span className={``} title={iconText}>
            <Icon path={buttonIcon} size={iconSize} />
          </span>
        </button>
      )}
    </>
  );
};

export default ButtonIcon;
