import * as React from 'react';
import { useEffect } from 'react';

// components/ThemeToggle.tsx
import { useTheme } from '../../contexts/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // const htmlElement = document.querySelector('html');
    // if (htmlElement) {
    //   htmlElement.setAttribute('class', theme);
    //   htmlElement.setAttribute('data-theme', theme);
    // }

    // Load from storage
    // useEffect(() => {
    //   const storedTheme = localStorage.getItem('theme') || 'dark';
    //   document.documentElement.setAttribute('data-theme', storedTheme);
    // }, []);

    const htmlElement = document.documentElement;
    if (htmlElement) {
      htmlElement.setAttribute('class', theme);
      htmlElement.setAttribute('data-theme', theme);
      //localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    <label className="swap swap-rotate">
      <input onClick={toggleTheme} type="checkbox" />
      <span className="swap-on material-icons">dark_mode</span>
      <span className="swap-off material-icons">light_mode</span>
    </label>
  );
};

export default ThemeToggle;
