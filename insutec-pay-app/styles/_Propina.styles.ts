// /styles/_Propina.styles.ts (CORRIGIDO)

import { StyleSheet } from 'react-native';
// Importa os estilos base de serviço (FUNÇÕES) e cores
import { styles as baseStyles, COLORS } from './_ServicoStyles.style.ts'; 

// =========================================================================
// ESTILOS DE BASE (Para serem usados nas funções dinâmicas abaixo)
// =========================================================================
const monthButtonBase = {
    flex: 0.5,
    padding: 12,
    borderRadius: 8,
    margin: 5,
    alignItems: 'center',
};

const monthButtonTextBase = {
    fontSize: 16,
    fontWeight: '600',
};

const monthListBase = {
    justifyContent: 'space-between' as 'space-between',
    flex: 1,
    marginHorizontal: -5,
};

const selectAllTextBase = {
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline' as 'underline',
    marginLeft: 10,
};

// =========================================================================
// ESTILOS DINÂMICOS DA PROPINA (Exportados)
// =========================================================================
export const propinaStyles = {
    // 💡 Herda todas as funções (label, sectionContainer, etc.) do ficheiro base
    ...baseStyles, 

    // --- ESTILOS ESPECÍFICOS DA PROPINA (Funções) ---

    // CORREÇÃO: Criando selectAllText como uma função para ser chamada no componente
    selectAllText: (isDarkMode: boolean) => ({
        ...selectAllTextBase,
        color: isDarkMode ? COLORS.primary : COLORS.primaryDark,
    }),

    monthList: monthListBase, // Este pode ser um objeto estático, pois não usa isDarkMode

    // --- OVERRIDES ---
    // Fazendo o container de secção ficar de borda a borda para a FlatList
    sectionContainer: (isDarkMode: boolean) => ({
        // Chama a versão base (função) e sobrepõe as propriedades
        ...baseStyles.sectionContainer(isDarkMode),
        paddingHorizontal: 5, 
        paddingVertical: 10,
    }),
    
    // --- ESTILOS DE MÊS ---
    monthButton: (isDarkMode: boolean) => ({
        ...monthButtonBase,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.lightGray + '60',
        borderWidth: 1,
        borderColor: isDarkMode ? COLORS.subText : COLORS.lightGray,
    }),
    
    monthButtonSelected: (isDarkMode: boolean) => ({
        ...monthButtonBase,
        borderWidth: 2,
        borderColor: COLORS.primary,
        backgroundColor: isDarkMode ? COLORS.primaryDark + '50' : COLORS.primary + '30',
    }),
    
    monthButtonText: (isDarkMode: boolean) => ({
        ...monthButtonTextBase,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),
    
    monthButtonTextSelected: (isDarkMode: boolean) => ({
        ...monthButtonTextBase,
        color: isDarkMode ? COLORS.textLight : COLORS.primaryDark,
    }),
};
