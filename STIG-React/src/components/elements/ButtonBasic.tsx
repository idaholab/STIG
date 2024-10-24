import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  label: string | React.JSX.Element;
  type?: 'btn-primary' | 'btn-neutralc' | 'btn-ghost';
  link?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  additionalClasses?: string;
  disabled?: boolean;
  isLabelUppercase?: boolean;
}

const ButtonBasic: React.FC<ButtonProps> = ({ label, type, link, onClick, additionalClasses, disabled, isLabelUppercase = true }) => {
  const baseClasses = `btn ${type} hover:opacity-100 ${isLabelUppercase ? 'uppercase' : ''}`;
  const lightModeClasses = type === 'btn-neutralc' ? 'border border-solid border-primary text-primary hover:text-primary' : '';
  const darkModeClasses = type === 'btn-neutralc' ? 'dark:border dark:border-solid dark:!border-neutralc-400 dark:hover:!border-white dark:text-neutralc-300 dark:hover:text-white dark:hover:bg-neutralc-950' : '';

  const disabledClass = disabled ? (type === 'btn-ghost') ? 'cursor-not-allowed !text-neutralc-400 !bg-transparent dark:!text-neutralc-400 dark:!bg-transparent'
    : 'cursor-not-allowed !text-neutralc-400 !bg-neutralc-300 dark:!text-neutralc-400 dark:!bg-neutralc-500' : '';
  const btnClass = `${baseClasses} ${lightModeClasses} ${darkModeClasses} ${additionalClasses} ${disabledClass}`;

  return (
    <>
      {link ? (
        <Link className={btnClass} to={link}>
          {label}
        </Link>
      ) : (
        <button className={btnClass} onClick={onClick} disabled={disabled}>
          {label}
        </button>
      )}
    </>
  );
};

export default ButtonBasic;
