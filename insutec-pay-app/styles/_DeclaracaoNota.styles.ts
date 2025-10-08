// /styles/_DeclaracaoNota.styles.ts

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
        alignItems: 'center' as 'center',
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
        borderColor: isDarkMode ? COLORS.primary + '50' : COLORS.lightGray, 
    }),

    // ESTILO CORRIGIDO: priceLabel é uma função (resolve o erro)
    priceLabel: (isDarkMode: boolean) => ({ 
        ...staticDeclarationStyles.priceLabelBase,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),

    // Estilo para o valor em destaque (Objeto Estático)
    valueText: staticDeclarationStyles.valueTextBase,

    // Estilo para o texto de instrução/nota
    noteText: (isDarkMode: boolean) => ({
        ...staticDeclarationStyles.noteTextBase,
        color: isDarkMode ? COLORS.subText : COLORS.gray,
    }),
    
    // Título dentro do cartão
    cardTitle: (isDarkMode: boolean) => ({
        fontSize: 18,
        fontWeight: '600' as '600',
        marginBottom: 10,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),
    
    // --- ESTILOS DE UPLOAD (Necessários para o BIUploadComponent) ---
    uploadButton: (isDarkMode: boolean) => ({
        flexDirection: 'row' as 'row',
        alignItems: 'center' as 'center',
        justifyContent: 'center' as 'center',
        padding: 12,
        borderRadius: 8,
        marginTop: 5,
        backgroundColor: COLORS.secondary, // Usa uma cor de destaque diferente para upload
        // Adicionando borda para melhor visualização no dark/light mode
        borderWidth: 1,
        borderColor: COLORS.secondary,
    }),

    uploadButtonText: (isDarkMode: boolean) => ({
        color: COLORS.white,
        fontWeight: '700' as '700',
        fontSize: 16,
        marginLeft: 10,
    }),
};
