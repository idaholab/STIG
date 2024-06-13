import { useContext } from 'react';
import { ThemeContextBlock } from './ThemeContextBlock'; // Ensure the path is correct

export const useTheme = () => useContext(ThemeContextBlock);
