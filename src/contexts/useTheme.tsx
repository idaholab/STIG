import { useContext } from 'react';
import { ThemeContextBlock } from './ThemeContextBlock'; // Ensure the path is correct

// Load from storage
// useEffect(() => {
//   const storedTheme = localStorage.getItem('theme') || 'dark';
//   document.documentElement.setAttribute('data-theme', storedTheme);
// }, []);

export const useTheme = () => useContext(ThemeContextBlock);
