// styles/_HomeStyles.ts

import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const PADDING_HORIZONTAL = 16;
const GRID_MARGIN = 10; 
// Cálculo responsivo para 3 COLUNAS
const CARD_WIDTH_3_COL = (width - (PADDING_HORIZONTAL * 2) - (GRID_MARGIN * 2)) / 3; 

// =========================================================================
// PALETA DE CORES
// =========================================================================
export const COLORS = {
    primary: '#39FF14', // Verde Neon
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
// ESTILOS ESTÁTICOS
// =========================================================================
const staticStyles = StyleSheet.create({
    // --- Header e Layout ---
    logoAndGreetingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1, 
    },
    logoContainer: {
        marginRight: 10,
    },
    headerRightButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        paddingHorizontal: 8, 
    },
    
    // LOGO (40x40)
    logoImage: {
        width: 40, 
        height: 40,
    },
    
    // --- Dashboard ---
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    // ❌ Removida: dividaBox
    dividaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    
    // --- Layouts de Grid ---
    highlightServicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', 
        paddingHorizontal: 0,
    },
    quickAccessScrollContainer: {
        flexDirection: 'row',
        gap: GRID_MARGIN, 
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    
    // --- Sidebar ---
    sidebarOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10, 
    },
    sidebarFooter: {
        marginTop: 'auto', 
        paddingTop: 10,
    },
    sidebarItemContainer: { 
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
});

// =========================================================================
// ESTILOS DINÂMICOS
// =========================================================================
export const styles = {
    ...staticStyles,

    // Layout
    safeArea: (isDarkMode: boolean) => ({
        flex: 1,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    }),
    contentContainer: (isDarkMode: boolean) => ({
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingBottom: 30,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    }),

    // Header
    header: (isDarkMode: boolean) => ({
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingVertical: 10,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.cardLight,
        borderBottomWidth: 1,
        borderBottomColor: isDarkMode ? COLORS.cardDark : COLORS.lightGray,
    }),
    greetingText: (isDarkMode: boolean) => ({
        fontSize: 18,
        fontWeight: 'bold',
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),

    // Secções
    sectionContainer: (isDarkMode: boolean) => ({
        marginTop: 25,
        paddingVertical: 5,
    }),
    sectionTitle: (isDarkMode: boolean) => ({
        fontSize: 20,
        fontWeight: '700',
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        marginBottom: 15,
        paddingHorizontal: 5,
    }),

    // Saldo / Dashboard (Cartão principal em destaque)
    saldoContainer: (isDarkMode: boolean) => ({
        padding: 20,
        borderRadius: 18, 
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        marginTop: 15,
        borderWidth: 1,
        borderColor: isDarkMode ? COLORS.primary + '55' : COLORS.lightGray,
        ...Platform.select({
            ios: { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 5 },
            android: { elevation: 5 },
        }),
    }),
    saldoTitle: (isDarkMode: boolean) => ({
        fontSize: 16,
        color: isDarkMode ? COLORS.subText : COLORS.gray,
        fontWeight: '500',
    }),
    saldoValue: (isDarkMode: boolean) => ({
        fontSize: 34,
        fontWeight: '900',
        color: COLORS.primary,
        marginVertical: 15, // Aumentado o margin vertical, pois a caixa de dívida saiu
        textShadowColor: COLORS.primary + '30',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10, 
    }),
    // ❌ Removidos: dividaBox, dividaText, dividaTotalValue
    payButton: (isDarkMode: boolean) => ({
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 15,
    }),
    payButtonText: (isDarkMode: boolean) => ({
        fontSize: 17,
        fontWeight: '800',
        color: COLORS.darkBackground, 
    }),
    
    // Cards de Serviço (Layout de 3 Colunas)
    card: (isDarkMode: boolean) => ({
        width: CARD_WIDTH_3_COL,
        marginBottom: GRID_MARGIN,
        padding: 10,
        borderRadius: 15,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        height: 110, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderWidth: 1,
        borderColor: isDarkMode ? COLORS.subText + '30' : COLORS.lightGray,
        ...Platform.select({ ios: { shadowOpacity: 0.05 }, android: { elevation: 2 } }),
    }),
    cardIconContainer: (isDarkMode: boolean) => ({
        width: 35,
        height: 35,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    }),
    cardTitle: (isDarkMode: boolean) => ({
        fontSize: 13, 
        fontWeight: '700',
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        textAlign: 'center',
    }),
    cardSubtitle: (isDarkMode: boolean) => ({
        display: 'none', 
    }),
    
    // Atalhos Rápidos (Horizontal Scroll)
    quickAccessCard: (isDarkMode: boolean) => ({
        width: 120, 
        padding: 15,
        borderRadius: 12,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 3, 
        borderLeftColor: COLORS.primary + '55',
        ...Platform.select({ ios: { shadowOpacity: 0.05 }, android: { elevation: 1 } }),
    }),
    quickAccessText: (isDarkMode: boolean) => ({
        fontSize: 12,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        marginTop: 5,
        fontWeight: '600',
        textAlign: 'center',
    }),

    // Sidebar
    sidebar: (isDarkMode: boolean, width: number) => ({
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: width,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        zIndex: 20, 
    }),
    sidebarHeader: (isDarkMode: boolean) => ({
        padding: 20,
        paddingTop: Platform.OS === 'android' ? 30 : 50, 
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
        borderBottomWidth: 1,
        borderBottomColor: isDarkMode ? COLORS.subText : COLORS.lightGray,
    }),
    sidebarHeaderText: (isDarkMode: boolean) => ({
        fontSize: 20,
        fontWeight: '700',
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        marginTop: 10,
    }),
    sidebarHeaderSubtitle: (isDarkMode: boolean) => ({
        fontSize: 14,
        color: isDarkMode ? COLORS.subText : COLORS.gray,
    }),
    sidebarText: (isDarkMode: boolean) => ({
        fontSize: 16,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        marginLeft: 15,
        fontWeight: '500',
    }),
    sidebarItem: (isDarkMode: boolean) => ({
        ...staticStyles.sidebarItemContainer,
        borderBottomColor: isDarkMode ? COLORS.cardDark : COLORS.lightGray,
    }),
};
