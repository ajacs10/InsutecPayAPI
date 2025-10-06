import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
// ⚠️ É necessário instalar esta dependência!
import AsyncStorage from '@react-native-async-storage/async-storage'; 

// Chave para guardar a preferência do tema no armazenamento local
const THEME_STORAGE_KEY = '@user_theme_preference';

// 1. Definição da Interface
interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. Componente Provedor do Tema
export function ThemeProvider({ children }: { children: ReactNode }) {
    const systemColorScheme = useColorScheme(); 
    const [themePreference, setThemePreference] = useState<'light' | 'dark' | 'system' | null>(null);
    
    // Calcula o modo escuro: true se a preferência for 'dark' OU se for 'system' e o sistema for 'dark'
    const isDarkMode = (themePreference === 'dark') || 
                       (themePreference !== 'light' && systemColorScheme === 'dark');

    // Carregar a preferência guardada
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const storedPreference = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                // Define a preferência guardada ou usa 'system' como padrão inicial
                setThemePreference((storedPreference as 'light' | 'dark' | 'system') || 'system');
            } catch (error) {
                console.error("Erro ao carregar o tema armazenado:", error);
                setThemePreference('system'); // Fallback
            }
        };
        loadTheme();
    }, []);

    // 3. Função para Alternar o Tema (Guarda a nova preferência)
    const toggleTheme = async () => {
        const newPreference = isDarkMode ? 'light' : 'dark';
        
        setThemePreference(newPreference);
        
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newPreference);
        } catch (error) {
            console.error("Erro ao guardar o tema:", error);
        }
    };
    
    // 4. Hook de inicialização
    if (themePreference === null) {
        // Retorna nulo ou um ActivityIndicator enquanto a preferência é carregada
        return null; 
    }

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// 5. Hook Personalizado para Consumo
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
    }
    return context;
};

export default ThemeProvider;
