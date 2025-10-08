// /styles/_DeclaracaoSemNota.styles.ts

import { StyleSheet } from 'react-native';
// Importa os estilos base de serviço (FUNÇÕES) e cores
import { styles as baseStyles, COLORS } from './_ServicoStyles.style.ts'; 

// =========================================================================
// ESTILOS ESTÁTICOS DE BASE (Para serem usados nas funções dinâmicas)
// =========================================================================
const staticDeclarationStyles = {
    // Estilo para o cartão de preço e tipo de documento
    priceCardBase: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center' as 'center', // Para centralizar o valor
    },
    // Estilo para destacar o valor do serviço
    valueTextBase: {
        fontSize: 24,
        fontWeight: '700' as '700',
        color: COLORS.primary,
    },
    // Estilo para a linha de texto do preço/descrição
    priceLabelBase: {
        fontSize: 16,
        fontWeight: '500' as '500',
        marginBottom: 5,
    },
    // Texto de instrução/nota
    noteTextBase: {
        fontSize: 14,
        marginTop: 15,
        paddingHorizontal: 10,
        lineHeight: 20,
        textAlign: 'center' as 'center',
    },
};

// =========================================================================
// ESTILOS DINÂMICOS DA DECLARAÇÃO (Exportados)
// =========================================================================
export const declaracaoStyles = {
    // Herda todas as funções (input, label, payButton, etc.) do ficheiro base
    ...baseStyles, 

    // --- ESTILOS ESPECÍFICOS ---

    // Cartão de Preço/Informação
    priceCard: (isDarkMode: boolean) => ({
        ...staticDeclarationStyles.priceCardBase,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        borderWidth: 1,
        // Usa a cor primária para um pequeno destaque
        borderColor: isDarkMode ? COLORS.primary + '50' : COLORS.lightGray, 
    }),

    // Estilo para o valor em destaque
    valueText: staticDeclarationStyles.valueTextBase,

    // Estilo para o label de preço (AOA 10.000,00)
    priceLabel: (isDarkMode: boolean) => ({
        ...staticDeclarationStyles.priceLabelBase,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),

    // Estilo para o texto de instrução/nota (função)
    noteText: (isDarkMode: boolean) => ({
        ...staticDeclarationStyles.noteTextBase,
        color: isDarkMode ? COLORS.subText : COLORS.gray,
    }),
    
    // Título dentro do cartão (Ex: "Custo Fixo")
    cardTitle: (isDarkMode: boolean) => ({
        fontSize: 18,
        fontWeight: '600' as '600',
        marginBottom: 10,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),
    
    // Contêiner de seleção (para Picker ou Radio buttons)
    selectionContainer: (isDarkMode: boolean) => ({
        marginBottom: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    }),
};
