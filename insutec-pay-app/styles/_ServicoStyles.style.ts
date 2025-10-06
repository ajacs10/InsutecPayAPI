// /styles/_ServicoStyles.style.ts (COMPLETO E CORRIGIDO)

import { StyleSheet, Platform } from 'react-native';

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
    dark: '#000000',
};

// =========================================================================
// ESTILOS ESTÁTICOS PUROS (Usados apenas para base de funções dinâmicas)
// =========================================================================
const baseStyles = {
    // Layout
    safeArea: { flex: 1 },
    container: { padding: 20 },
    sectionContainer: { marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 }, // DEFINIÇÃO BASE
    // Inputs
    inputContainer: { marginBottom: 15 }, 
    label: { fontSize: 14, fontWeight: '500', marginBottom: 5 },
    input: { padding: 12, borderRadius: 8, fontSize: 16, borderWidth: 1 },
    picker: { borderRadius: 8, borderWidth: 1, overflow: 'hidden' },
    // Sumário
    summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 10, marginTop: 20, borderWidth: 1 },
    totalText: { fontSize: 18, fontWeight: '600' },
    // Botões
    payButton: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 30 },
    payButtonDisabled: { backgroundColor: COLORS.lightGray, opacity: 0.7 },
    payButtonText: { color: COLORS.dark, fontSize: 18, fontWeight: 'bold' },
    // Feedback
    emptyText: { fontSize: 16, textAlign: 'center', padding: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 150 },
    loadingText: { marginTop: 10, fontSize: 16 },
    priceText: { fontSize: 16, marginBottom: 10, marginLeft: 5 },
    // Detalhes da transação
    transactionDetailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
};

// =========================================================================
// ESTILOS DINÂMICOS (Exportados - TODAS SÃO FUNÇÕES!)
// =========================================================================
export const styles = {
    // Layout
    safeArea: (isDarkMode: boolean) => ({
        ...baseStyles.safeArea,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    }),
    container: (isDarkMode: boolean) => ({
        ...baseStyles.container,
    }),
    sectionContainer: (isDarkMode: boolean) => ({
        ...baseStyles.sectionContainer,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: isDarkMode ? COLORS.subText + '30' : COLORS.lightGray,
    }),
    // 💡 SECTIONTITLE AGORA É UMA FUNÇÃO (RESOLVE O ERRO)
    sectionTitle: (isDarkMode: boolean) => ({ 
        ...baseStyles.sectionTitle,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),
    
    // Inputs
    inputContainer: (isDarkMode: boolean) => ({ ...baseStyles.inputContainer }),
    label: (isDarkMode: boolean) => ({
        ...baseStyles.label,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),
    input: (isDarkMode: boolean) => ({
        ...baseStyles.input,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        borderColor: isDarkMode ? COLORS.subText : COLORS.lightGray,
    }),
    picker: (isDarkMode: boolean) => ({
        ...baseStyles.picker,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        borderColor: isDarkMode ? COLORS.subText : COLORS.lightGray,
    }),

    // Sumário
    summaryContainer: (isDarkMode: boolean) => ({
        ...baseStyles.summaryContainer,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        borderColor: isDarkMode ? COLORS.primary + '50' : COLORS.lightGray,
    }),
    totalText: (isDarkMode: boolean) => ({
        ...baseStyles.totalText,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),
    totalValue: (isDarkMode: boolean) => ({
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.primary, 
    }),

    // Detalhes da Transação
    transactionCard: (isDarkMode: boolean) => ({
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: isDarkMode ? COLORS.subText + '30' : COLORS.lightGray,
    }),
    transactionDetailRow: (isDarkMode: boolean) => ({
        ...baseStyles.transactionDetailRow,
        borderBottomWidth: 1,
        borderBottomColor: isDarkMode ? COLORS.subText + '20' : COLORS.lightGray + '60',
    }),
    transactionLabel: (isDarkMode: boolean) => ({
        fontSize: 14,
        fontWeight: '500',
        color: isDarkMode ? COLORS.subText : COLORS.gray,
    }),
    transactionValue: (isDarkMode: boolean) => ({
        fontSize: 14,
        fontWeight: '600',
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        maxWidth: '60%', // Evita que o texto quebre mal
        textAlign: 'right',
    }),

    // Botões (Mantidos como objetos estáticos para uso simples)
    payButton: baseStyles.payButton,
    payButtonDisabled: baseStyles.payButtonDisabled,
    payButtonText: baseStyles.payButtonText,

    // Feedback
    emptyText: (isDarkMode: boolean) => ({
        ...baseStyles.emptyText,
        color: isDarkMode ? COLORS.subText : COLORS.gray,
    }),
    error: (isDarkMode: boolean) => ({
        color: COLORS.danger,
        textAlign: 'center',
        marginTop: 15,
        fontSize: 14,
    }),
    loadingContainer: (isDarkMode: boolean) => ({
        ...baseStyles.loadingContainer,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    }),
    loadingText: (isDarkMode: boolean) => ({
        ...baseStyles.loadingText,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),
    priceText: (isDarkMode: boolean) => ({
        ...baseStyles.priceText,
        color: isDarkMode ? COLORS.subText : COLORS.gray,
    }),
};
