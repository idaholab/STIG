import * as React from 'react';
import { useEffect } from 'react';

// components/ThemeToggle.tsx
import { useTheme } from '../../contexts/useTheme';
import Icon from '@mdi/react';
import { mdiThemeLightDark } from '@mdi/js';

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
    <label className="swap swap-rotate text-neutralc-300 hover:text-white" >
      <input onClick={toggleTheme} type="checkbox" />
      <Icon path={mdiThemeLightDark} size={1} title='Switch between light and dark themes' />
    </label>
  );
};

export default ThemeToggle;
