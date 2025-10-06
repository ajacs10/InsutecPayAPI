// /styles/_Carteira.styles.ts (COMPLETO E FINAL)

import { StyleSheet, Platform } from 'react-native';

// =========================================================================
// PALETA DE CORES
// =========================================================================
export const COLORS = {
    primary: '#39FF14', // Verde neon (Cor de Ação/Destaque)
    primaryDark: '#00E600',
    darkBackground: '#0F0F0F',
    lightBackground: '#F0F2F5',
    cardDark: '#1F1F1F', // Cartão em modo escuro
    cardLight: '#FFFFFF', // Cartão em modo claro
    textDark: '#1C1C1C', // Texto escuro
    textLight: '#E0E0E0', // Texto claro
    subText: '#888888', // Texto secundário/placeholder
    danger: '#FF4500', 
    warning: '#FFCC00', 
    white: '#FFFFFF',
    gray: '#666666',
    lightGray: '#BBBBBB',
    dark: '#000000',
    // Cores específicas para o tema ATLÂNTICO/Cartão
    atlanticoBlue: '#0078AE', // Azul do Atlântico (Fundo do Cartão)
    atlanticoTextLight: 'rgba(255, 255, 255, 0.7)', // Texto claro no cartão
};

// =========================================================================
// ESTILOS ESTÁTICOS PUROS (Não dependem de isDarkMode, ou são cores fixas)
// =========================================================================
const staticBaseStyles = StyleSheet.create({
    // --- GERAL/TÍTULOS ---
    titleBase: { fontSize: 28, fontWeight: '800', marginBottom: 20, textAlign: 'center', paddingTop: 10 },
    sectionTitleBase: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
    
    // --- Card Atlântico (Layout) ---
    atlanticoCardBase: {
        padding: 25,
        borderRadius: 15,
        marginBottom: 25,
        aspectRatio: 1.586,
        justifyContent: 'space-between',
        ...Platform.select({ ios: { shadowOpacity: 0.3, shadowRadius: 8, shadowColor: COLORS.dark }, android: { elevation: 8 } }),
    },
    headerCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardLabel: { fontSize: 10, fontWeight: '700', color: COLORS.white },
    cardType: { fontSize: 18, fontWeight: '900', color: COLORS.white },
    cardNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 3,
        textAlign: 'center',
        color: COLORS.white,
        marginTop: 20, // Espaçamento após o tipo de cartão
    },
    footerCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    footerLabel: { fontSize: 9, color: COLORS.atlanticoTextLight, fontWeight: '500' },
    footerValue: { fontSize: 14, fontWeight: '700', color: COLORS.white, marginTop: 2 },

    // --- Saldo (Ações) ---
    saldoLabel: { fontSize: 14, fontWeight: '600', color: COLORS.subText, marginBottom: 5 },
    saldoActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
    recargaButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 10, 
        borderRadius: 8, 
        backgroundColor: COLORS.primary, 
        flex: 1, 
        marginRight: 10,
        justifyContent: 'center',
    },
    recargaButtonText: { color: COLORS.dark, fontWeight: '700', marginLeft: 8 },
    retirarButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 10, 
        borderRadius: 8, 
        backgroundColor: COLORS.warning, 
        flex: 1, 
        marginLeft: 10,
        justifyContent: 'center',
    },
    retirarButtonText: { color: COLORS.dark, fontWeight: '700', marginLeft: 8 },

    // --- Transação (Detalhes e Pagamento) ---
    detailCardBase: { padding: 18, borderRadius: 12, marginBottom: 20, },
    detailItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray + '50' },
    
    payButton: { 
        backgroundColor: COLORS.primaryDark, 
        paddingVertical: 14, 
        borderRadius: 8, 
        alignItems: 'center', 
        marginTop: 20,
        elevation: 5,
    },
    payButtonText: { color: COLORS.dark, fontSize: 16, fontWeight: '800' },
    payButtonDisabled: { 
        backgroundColor: COLORS.lightGray,
        opacity: 0.7,
        elevation: 0,
    },

    // --- Adicionar Cartão (Formulário) ---
    sectionBase: { padding: 15, borderRadius: 12, marginBottom: 20 },
    inputBase: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 15,
        ...Platform.select({ web: { outlineWidth: 0 } }),
    },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    buttonBase: { 
        flex: 1,
        paddingVertical: 12, 
        borderRadius: 8, 
        alignItems: 'center', 
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: COLORS.primaryDark, // Cor primária como base para o botão
    },
    buttonText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
    buttonCancel: { backgroundColor: COLORS.gray, marginLeft: 10 },
});

// =========================================================================
// ESTILOS DINÂMICOS (Definidos como FUNÇÕES que aceitam isDarkMode)
// =========================================================================
export const styles = {
    ...staticBaseStyles,

    // Layout
    container: (isDarkMode: boolean) => ({
        flex: 1,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? 10 : 0,
    }),
    title: (isDarkMode: boolean) => ({
        ...staticBaseStyles.titleBase,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),
    sectionTitle: (isDarkMode: boolean) => ({
        ...staticBaseStyles.sectionTitleBase,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),
    emptyText: (isDarkMode: boolean) => ({
        textAlign: 'center',
        marginVertical: 30,
        fontSize: 16,
        fontStyle: 'italic',
        color: isDarkMode ? COLORS.subText : COLORS.gray,
    }),

    // Card Atlântico
    atlanticoCard: (isDarkMode: boolean) => ({
        ...staticBaseStyles.atlanticoCardBase,
        backgroundColor: COLORS.atlanticoBlue,
        // Sombra leve para destaque no modo escuro
        ...isDarkMode && { shadowColor: COLORS.primary, shadowOpacity: 0.5, shadowRadius: 10, elevation: 12 },
    }),

    // Saldo
    saldoCard: (isDarkMode: boolean) => ({
        ...staticBaseStyles.saldoCardBase,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    }),
    saldoValue: (isDarkMode: boolean) => ({
        fontSize: 32,
        fontWeight: '900',
        color: COLORS.primary, // Saldo em verde neon para destaque
        marginTop: 5,
    }),
    
    // Transação (Detalhes)
    detailCard: (isDarkMode: boolean) => ({
        ...staticBaseStyles.detailCardBase,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    }),
    detailLabel: (isDarkMode: boolean) => ({
        fontSize: 14,
        color: isDarkMode ? COLORS.subText : COLORS.gray,
    }),
    detailValue: (isDarkMode: boolean) => ({
        fontSize: 14,
        fontWeight: '600',
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        maxWidth: '60%',
        textAlign: 'right' as 'right',
    }),

    // Adicionar Cartão (Formulário)
    section: (isDarkMode: boolean) => ({
        ...staticBaseStyles.sectionBase,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    }),
    input: (isDarkMode: boolean) => ({
        ...staticBaseStyles.inputBase,
        borderColor: isDarkMode ? COLORS.subText : COLORS.gray,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.white,
    }),
    button: (isDarkMode: boolean) => ({
        ...staticBaseStyles.buttonBase,
        // Cor do botão base já definida como primária em staticBaseStyles
    }),
    
    // Loading (Necessário para a simulação de pagamento)
    loadingContainer: (isDarkMode: boolean) => ({
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    }),
    loadingText: (isDarkMode: boolean) => ({ 
        marginTop: 10, 
        fontSize: 16, 
        color: isDarkMode ? COLORS.textLight : COLORS.textDark 
    }),
    // O estilo mainBalanceCard (da versão anterior) não é usado, mas se fosse necessário:
    // mainBalanceCard: (isDarkMode: boolean) => ({ /* ... */ }),
};
