import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native'; // Usar a preferência do sistema é mais comum!

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Usa a preferência do sistema ou 'true' se quiseres forçar DarkMode
  const colorScheme = useColorScheme(); 
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark'); 

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 💥 CORREÇÃO (Para o Expo Router): 
// Exportar um componente nulo para satisfazer o requisito de default export do router
const ThemeContextPlaceholder = () => null; 
export default ThemeContextPlaceholder;
