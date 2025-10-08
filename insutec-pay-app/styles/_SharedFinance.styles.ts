import { StyleSheet, Platform } from 'react-native';

// =========================================================================
// PALETA DE CORES (COMPARTILHADA)
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
    // Cores específicas para o tema ATLÂNTICO/Cartão (compartilhadas)
    atlanticoBlue: '#0078AE',
    atlanticoTextLight: 'rgba(255, 255, 255, 0.7)', 
};

// =========================================================================
// ESTILOS ESTÁTICOS BASE (COMPARTILHADOS)
// =========================================================================
const staticBaseStyles = StyleSheet.create({
    // --- GERAL/TÍTULOS ---
    titleBase: { fontSize: 28, fontWeight: '800', marginBottom: 20, textAlign: 'center', paddingTop: 10 },
    sectionTitleBase: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
    
    // --- GERAL/TRANSAÇÃO ---
    detailCardBase: { padding: 20, borderRadius: 12, marginBottom: 20, },
    detailItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray + '50' },
    
    // --- GERAL/BOTÕES DE AÇÃO ---
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
    cancelButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: COLORS.gray,
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});

// =========================================================================
// ESTILOS DINÂMICOS BASE (COMPARTILHADOS)
// =========================================================================
export const sharedStyles = {
    ...staticBaseStyles,

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
    subtitle: (isDarkMode: boolean) => ({
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 20,
        color: isDarkMode ? COLORS.subText : COLORS.gray,
        paddingHorizontal: 16,
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
    error: (isDarkMode: boolean) => ({
        color: COLORS.danger,
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 10,
        fontWeight: '600',
        padding: 10,
        backgroundColor: isDarkMode ? 'rgba(255, 69, 0, 0.1)' : 'rgba(255, 69, 0, 0.05)',
        borderRadius: 5,
    }),
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
};
