import React, { createContext, useContext, useState, ReactNode, FC, useMemo } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Start in dark mode

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      console.log('[ThemeContext] Toggled theme, isDarkMode:', newValue); // Debug
      return newValue;
    });
  };

  const value = useMemo(() => ({ isDarkMode, toggleTheme }), [isDarkMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
