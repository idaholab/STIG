import React, { useState } from 'react';
import { ThemeContextBlock } from './ThemeContextBlock'; // Ensure the path is correct
import { getCssRGBVarColor } from '@/util/GetCssVarColor';

type Props = {
  children: React.ReactNode;
};

const ThemeContextComponent: React.FC<Props> = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [nodeHandleColor, setNodeHandleColor] = useState<string | undefined>(getCssRGBVarColor('--color-neutral-rgb-600'));

  const toggleTheme = () => {
    setTheme(currentTheme => currentTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContextBlock.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContextBlock.Provider>
  );
};

export default ThemeContextComponent;
