// /styles/_Propina.styles.ts

import { StyleSheet } from 'react-native';
// Importa os estilos base de serviço
import { styles as baseStyles, COLORS } from './_ServicoStyles.style.ts'; 

// =========================================================================
// ESTILOS ESTÁTICOS ESPECÍFICOS DA PROPINA
// =========================================================================
const staticPropinaStyles = StyleSheet.create({
    monthButtonBase: {
        flex: 0.5,
        padding: 12,
        borderRadius: 8,
        margin: 5,
        alignItems: 'center',
    },
    monthButtonTextBase: {
        fontSize: 16,
        fontWeight: '600',
    },
    monthList: {
        justifyContent: 'space-between',
        flex: 1,
        // Garante que o FlatList se alinhe corretamente
        marginHorizontal: -5, 
    },
    selectAllText: {
        color: COLORS.primary,
        fontSize: 15,
        fontWeight: '600',
    },
});

// =========================================================================
// ESTILOS DINÂMICOS DA PROPINA (Exportados)
// =========================================================================
export const propinaStyles = {
    // 💡 Herda todas as funções e propriedades do ficheiro base
    ...baseStyles, 
    ...staticPropinaStyles,

    // --- OVERRIDES ---
    // Fazendo o container de secção ficar de borda a borda para a FlatList
    sectionContainer: (isDarkMode: boolean) => ({
        ...baseStyles.sectionContainer(isDarkMode),
        paddingHorizontal: 5, // Apenas um pequeno padding
        paddingVertical: 10,
    }),
    
    // --- ESTILOS DE MÊS ---
    monthButton: (isDarkMode: boolean) => ({
        ...staticPropinaStyles.monthButtonBase,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.lightGray + '60',
        borderWidth: 1,
        borderColor: isDarkMode ? COLORS.subText : COLORS.lightGray,
    }),
    
    monthButtonSelected: (isDarkMode: boolean) => ({
        ...staticPropinaStyles.monthButtonBase,
        borderWidth: 2,
        borderColor: COLORS.primary,
        backgroundColor: isDarkMode ? COLORS.primaryDark + '50' : COLORS.primary + '30',
    }),
    
    monthButtonText: (isDarkMode: boolean) => ({
        ...staticPropinaStyles.monthButtonTextBase,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),
    
    monthButtonTextSelected: (isDarkMode: boolean) => ({
        ...staticPropinaStyles.monthButtonTextBase,
        color: isDarkMode ? COLORS.textLight : COLORS.primaryDark,
    }),
};
