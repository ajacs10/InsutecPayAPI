import { StyleSheet, Platform } from 'react-native';
// Importa as cores e estilos base do ficheiro compartilhado
import { COLORS } from './_SharedFinance.styles'; 

// =========================================================================
// ESTILOS DE ITEM DE RECIBO (ESTÁTICOS)
// =========================================================================
const staticRecibosStyles = StyleSheet.create({
    separator: {
        height: 1,
        backgroundColor: COLORS.subText + '30',
        marginVertical: 10,
    },
    detailsContainer: {
        paddingVertical: 5,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 10,
    },
    totalLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: COLORS.subText,
    },
    totalValue: {
        fontSize: 22,
        fontWeight: '900',
        color: COLORS.primary, // Destaque em neon
    },
    actionButtonBase: (isPaid: boolean) => ({
        backgroundColor: isPaid ? COLORS.lightGray : COLORS.primary,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
    }),
    actionButtonText: {
        color: COLORS.dark,
        fontWeight: '700',
        fontSize: 14,
    },
    statusText: {
        marginLeft: 4,
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.dark,
    },
});

// =========================================================================
// ESTILOS DINÂMICOS (APENAS RECIBOS)
// =========================================================================
export const recibosStyles = {
    ...staticRecibosStyles,

    // Estilo para o Badge de Status
    statusBadgeBase: (color: string) => ({
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: color,
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 4,
    }),
    
    card: (isDarkMode: boolean) => ({
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderLeftWidth: 5,
        ...Platform.select({ 
            ios: { shadowOpacity: 0.05, shadowRadius: 5, shadowColor: COLORS.dark }, 
            android: { elevation: 2 } 
        }),
    }),
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    title: (isDarkMode: boolean) => ({
        fontSize: 16,
        fontWeight: '700',
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),
    subtitle: (isDarkMode: boolean) => ({
        fontSize: 12,
        fontWeight: '500',
        color: isDarkMode ? COLORS.subText : COLORS.gray,
    }),
    detailLabel: (isDarkMode: boolean) => ({
        fontSize: 14,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),
    detailValue: (isDarkMode: boolean) => ({
        fontSize: 14,
        fontWeight: '600',
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),
    dateLimit: (isWarning: boolean) => ({
        fontSize: 12,
        color: isWarning ? COLORS.warning : COLORS.gray,
        marginTop: 4,
        fontWeight: '600',
    }),
};
