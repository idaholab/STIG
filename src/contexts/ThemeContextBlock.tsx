import { createContext } from 'react';

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

export const ThemeContextBlock = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => { console.warn('toggleTheme was called without a ThemeContext.Provider'); },
});
