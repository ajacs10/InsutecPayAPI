// /styles/_FolhadeProva.styles.ts

import { StyleSheet } from 'react-native';
// Importa os estilos base de serviço (FUNÇÕES) e cores
import { styles as baseStyles, COLORS } from './_ServicoStyles.style.ts'; 

// =========================================================================
// ESTILOS DE BASE (Para serem usados nas funções dinâmicas abaixo)
// =========================================================================
const staticFolhaProvaStyles = StyleSheet.create({
    // Estilo para o cabeçalho de informação (Ex: "Selecionar Disciplina")
    infoHeaderBase: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        borderLeftWidth: 3,
        paddingLeft: 10,
    },
    // Estilo para cada item de disciplina na lista
    subjectItemBase: {
        padding: 15,
        borderRadius: 8,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subjectTextBase: {
        fontSize: 16,
        flexShrink: 1,
    },
});

// =========================================================================
// ESTILOS DINÂMICOS DA FOLHA DE PROVA (Exportados)
// =========================================================================
export const folhaProvaStyles = {
    // Herda todas as funções (label, input, payButton, etc.) do ficheiro base
    ...baseStyles, 

    // --- ESTILOS ESPECÍFICOS ---
    
    infoHeader: (isDarkMode: boolean) => ({
        ...staticFolhaProvaStyles.infoHeaderBase,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        borderLeftColor: COLORS.warning, // Cor de destaque para a informação
    }),

    // Item de Disciplina (Não Selecionado)
    subjectItem: (isDarkMode: boolean) => ({
        ...staticFolhaProvaStyles.subjectItemBase,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        borderWidth: 1,
        borderColor: isDarkMode ? COLORS.subText : COLORS.lightGray,
    }),
    
    // Item de Disciplina (Selecionado)
    subjectItemSelected: (isDarkMode: boolean) => ({
        ...staticFolhaProvaStyles.subjectItemBase,
        backgroundColor: isDarkMode ? COLORS.warning + '30' : COLORS.warning + '20',
        borderWidth: 2,
        borderColor: COLORS.warning,
    }),

    // Texto da Disciplina
    subjectText: (isDarkMode: boolean, isSelected: boolean = false) => ({
        ...staticFolhaProvaStyles.subjectTextBase,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        fontWeight: isSelected ? '700' : '600',
    }),

    // Ícone de seleção (Checkmark ou Radio)
    selectionIcon: (isSelected: boolean) => ({
        color: isSelected ? COLORS.warning : COLORS.subText,
        marginLeft: 10,
    }),
};
