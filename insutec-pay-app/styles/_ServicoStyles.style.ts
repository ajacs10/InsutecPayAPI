// styles/_ServicoStyles.ts

import { StyleSheet, Platform } from 'react-native';

// =========================================================================
// PALETA DE CORES (Cores principais para referência)
// =========================================================================
export const COLORS = {
    primary: '#39FF14', // Verde neon
    primaryDark: '#00E600',
    darkBackground: '#0F0F0F',
    lightBackground: '#F0F2F5',
    cardDark: '#1F1F1F',
    cardLight: '#FFFFFF',
    textDark: '#1C1C1C',
    textLight: '#E0E0E0',
    subText: '#888888',
    success: '#39FF14',
    danger: '#FF4500',
    warning: '#FFCC00',
    white: '#FFFFFF',
    gray: '#666666',
    lightGray: '#BBBBBB',
};

// =========================================================================
// ESTILOS ESTÁTICOS (Propriedades que não dependem de isDarkMode)
// =========================================================================
const staticStyles = StyleSheet.create({
    // --- BOTÕES DE AÇÃO ---
    payButton: {
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 16,
        backgroundColor: COLORS.primary, // Cor principal para o botão final
        elevation: 6,
    },
    payButtonDisabled: {
        opacity: 0.5,
        backgroundColor: COLORS.gray,
    },
    payButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.darkBackground, 
        marginLeft: 10,
    },
    
    // 💡 NOVO: Estilo base para botões secundários (como "Adicionar Item")
    secondaryButton: {
        backgroundColor: COLORS.primaryDark + 'A0', // Um pouco transparente ou tom diferente
        marginTop: 15,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    
    // --- ESTILOS DE LISTA/FLATLIST ---
    monthList: { 
        justifyContent: 'space-between',
        flex: 1, 
    },
    
    // 💡 NOVO: Card de Resumo de Item (para Folha de Prova)
    itemSummaryCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginVertical: 4,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.warning, // Cor de destaque
        backgroundColor: COLORS.cardLight, // Será sobrescrito pela cor escura se isDarkMode for usada
        ...Platform.select({ ios: { shadowOpacity: 0.1, shadowRadius: 3 }, android: { elevation: 1 } }),
    },
    itemSummaryText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.textDark, // Será sobrescrito pela cor escura
    },
    itemSummaryValue: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.textDark, // Será sobrescrito pela cor escura
        marginRight: 5,
    },
});

// =========================================================================
// ESTILOS DINÂMICOS (DEFINIDOS COMO FUNÇÕES)
// =========================================================================
export const styles = {
    ...staticStyles, // Inclui estilos estáticos

    // Container Geral
    container: (isDarkMode: boolean) => ({
        flex: 1,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
        paddingTop: Platform.OS === 'android' ? 20 : 0, 
        paddingHorizontal: 16,
    }),
    
    // Container de Secção (Usado em Folha de Prova)
    sectionContainer: (isDarkMode: boolean) => ({
        padding: 15,
        borderRadius: 12,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: isDarkMode ? COLORS.subText + '30' : COLORS.lightGray,
    }),

    // Título de Secção (Menor que headerTitle)
    sectionTitle: (isDarkMode: boolean) => ({
        fontSize: 22,
        fontWeight: '700',
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        marginBottom: 15,
        textAlign: 'left',
    }),
    
    // Título principal da tela (Corrigido da PropinaScreen)
    headerTitle: (isDarkMode: boolean) => ({
        fontSize: 28,
        fontWeight: '800',
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        textAlign: 'center',
        marginBottom: 10,
    }),
    
    // Texto de preço por unidade/mês
    priceText: (isDarkMode: boolean) => ({
        fontSize: 16,
        color: isDarkMode ? COLORS.subText : COLORS.gray,
        textAlign: 'left',
        marginBottom: 20,
        marginLeft: 5,
    }),

    // Rótulo/Label
    label: (isDarkMode: boolean) => ({
        fontSize: 16,
        fontWeight: '600',
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        marginBottom: 8,
    }),
    
    // Container de entrada (TextInput/Picker)
    inputContainer: (isDarkMode: boolean) => ({
        marginBottom: 16,
    }),
    
    // Campo de entrada (TextInput)
    input: (isDarkMode: boolean) => ({
        borderWidth: 1,
        borderColor: isDarkMode ? COLORS.subText : COLORS.gray,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    }),
    
    // Estilo do Picker (View Container)
    picker: (isDarkMode: boolean) => ({
        borderWidth: 1,
        borderColor: isDarkMode ? COLORS.subText : COLORS.gray,
        borderRadius: 8,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        overflow: 'hidden',
    }),
    
    // 💡 NOVO: Container de Quantidade (para Declaracoes)
    quantityContainer: (isDarkMode: boolean) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: isDarkMode ? COLORS.subText : COLORS.gray,
        borderRadius: 8,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        height: 50,
    }),
    
    // 💡 NOVO: Botão de + / -
    quantityButton: (isDarkMode: boolean) => ({
        width: 50,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightGray,
        borderRadius: 8,
    }),
    
    // 💡 NOVO: Texto do Botão de Quantidade
    quantityButtonText: (isDarkMode: boolean) => ({
        fontSize: 24,
        fontWeight: 'bold',
        color: isDarkMode ? COLORS.primary : COLORS.textDark,
    }),
    
    // 💡 NOVO: Texto de Quantidade
    quantityText: (isDarkMode: boolean) => ({
        fontSize: 20,
        fontWeight: '600',
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),

    // Texto de total (Label principal de total)
    totalText: (isDarkMode: boolean) => ({
        fontSize: 20,
        fontWeight: '700',
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    }),

    // 💡 NOVO: Botão de Upload do BI
    uploadButton: {
        backgroundColor: COLORS.gray,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
    },
    
    // 💡 NOVO: Botão de Upload do BI - Sucesso
    uploadButtonSuccess: {
        backgroundColor: COLORS.success,
    },
    
    // 💡 NOVO: Texto do Botão de Upload
    uploadButtonText: {
        marginLeft: 10,
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },

    // 💡 CORRIGINDO: Adaptar estilos de lista de itens para tema (Folha de Prova)
    itemSummaryCard: (isDarkMode: boolean) => ({
        ...staticStyles.itemSummaryCard, // Estilos estáticos
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    }),
    itemSummaryText: (isDarkMode: boolean) => ({
        ...staticStyles.itemSummaryText,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),
    itemSummaryValue: (isDarkMode: boolean) => ({
        ...staticStyles.itemSummaryValue,
        color: isDarkMode ? COLORS.primary : COLORS.textDark,
    }),
    
    // Texto de erro
    error: (isDarkMode: boolean) => ({
        fontSize: 14,
        color: COLORS.danger,
        marginVertical: 10,
        textAlign: 'center',
    }),
};
