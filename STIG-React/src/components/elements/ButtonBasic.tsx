import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  /**
   * Button contents
   */
  label: string;
  /**
   * What is the background color? Use classes.
   */
  color?: 'btn-primary' | 'btn-secondary' | 'btn-neutral' | 'btn-ghost';
  /**
   * Optional link
   */
  link?: string;
  /**
   * Optional click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /**
   * Optional additional classes
   */
  additionalClasses?: string;
}

const ButtonBasic: React.FC<ButtonProps> = ({ label, color, link, onClick, additionalClasses }) => {
  // Define base classes
  const baseClasses = `btn ${color} uppercase hover:opacity-100`;

  // Define conditional light mode classes
  const lightModeClasses = color === 'btn-secondary' ? 'border border-solid !border-primary text-primary hover:text-primary' : '';

  // Define conditional dark mode classes
  const darkModeClasses = color === 'btn-secondary' ? 'dark:border dark:border-solid dark:!border-gray-400 dark:text-gray-300 dark:hover:text-white' : '';

  // Combine base classes and conditional classes
  const btnClass = `${baseClasses} ${lightModeClasses} ${darkModeClasses} ${additionalClasses}`;

  return (
    <>
      {link ? (
        <Link className={btnClass} to={link}>
          {label}
        </Link>
      ) : (
        <button className={btnClass} onClick={onClick}>
          {label}
        </button>
      )}
    </>
  );
};

export default ButtonBasic;
