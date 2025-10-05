import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

// =========================================================================
// CONTEXTO DE TEMA
// Define o contexto para gerenciar o modo claro/escuro no aplicativo.
// =========================================================================
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// =========================================================================
// PROVEDOR DE TEMA
// Componente que fornece o contexto de tema para os componentes filhos.
// Usa a preferência do sistema (useColorScheme) como valor inicial.
// =========================================================================
export function ThemeProvider({ children }: { children: ReactNode }) {
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

// =========================================================================
// HOOK PERSONALIZADO
// Hook para acessar o contexto de tema em outros componentes.
// Lança um erro se usado fora de um ThemeProvider.
// =========================================================================
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Exportação padrão do ThemeProvider para uso como componente
export default ThemeProvider;
