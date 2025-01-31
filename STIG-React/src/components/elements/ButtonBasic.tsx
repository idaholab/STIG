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
  tooltip?: string;
}

const ButtonBasic: React.FC<ButtonProps> = ({
  label,
  type,
  link,
  onClick,
  additionalClasses,
  disabled,
  isLabelUppercase = true,
  tooltip,
}) => {
  const baseClasses = `btn ${type} hover:opacity-100 ${isLabelUppercase ? 'uppercase' : ''}`;
  const lightModeClasses =
    type === 'btn-neutralc'
      ? 'border border-solid border-primary text-primary hover:bg-white hover:text-black bg-neutralc-100'
      : '';
  const darkModeClasses =
    type === 'btn-neutralc'
      ? 'dark:border dark:border-solid dark:!border-neutralc-400 dark:text-neutralc-300 dark:hover:!border-white dark:hover:text-white dark:bg-transparent'
      : '';

  const disabledClass = disabled
    ? type === 'btn-ghost'
      ? 'cursor-not-allowed !text-neutralc-400 !bg-transparent dark:!text-neutralc-400 dark:!bg-transparent'
      : 'cursor-not-allowed !text-neutralc-400 !bg-neutralc-300 dark:!text-neutralc-400 dark:!bg-neutralc-500'
    : '';
  const btnClass = `${baseClasses} ${lightModeClasses} ${darkModeClasses} ${additionalClasses} ${disabledClass}`;

  return (
    <>
      {link ? (
        <Link className={btnClass} to={link} title={tooltip}>
          {label}
        </Link>
      ) : (
        <button className={btnClass} onClick={onClick} disabled={disabled} title={tooltip}>
          {label}
        </button>
      )}
    </>
  );
};

export default ButtonBasic;
