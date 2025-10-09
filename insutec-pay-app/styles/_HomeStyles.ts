import { StyleSheet, Platform, Dimensions, StatusBar } from 'react-native';

const { width } = Dimensions.get('window');
const PADDING_HORIZONTAL = 18;

// =========================================================================
// PALETA DE CORES
// =========================================================================
export const COLORS = {
    primary: '#16537e', 
    textLight: '#E0E0E0', 
    darkBackground: '#121212', 
    lightBackground: '#FFFFFF',
    dark: '#1F1F1F',
    white: '#FFFFFF',
    primaryLight: '#72bff8',
    cardDark: '#1F1F1F',
    cardLight: '#FFFFFF',
    textDark: '#1C1C1C',
    subText: '#888888',
    success: '#39FF14',
    danger: '#FF4500',
    warning: '#FFCC00',
    gray: '#666666',
    ana: '#073763',
    lightGray: '#DDDDDD',
    accent: '#FFD700', 
    menuBackground: '#2A2A2A',
    menuItemBorder: '#444444',
};

// =========================================================================
// TIPOS
// =========================================================================
export type StyleProps = {
    isDarkMode: boolean;
    width?: number;
};

// =========================================================================
// ESTILOS ESTÁTICOS
// =========================================================================
const staticStyles = StyleSheet.create({
    headerAndroidPadding: {
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
    },
    logoAndGreetingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
    },
    logoContainer: {
        marginRight: 10,
        alignItems: 'center',
        paddingTop: 10,
    },
    headerRightButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        paddingHorizontal: 0,
        marginLeft: 15,
    },
    logoImage: {
        width: 60,
        height: 80,
    },
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    sidebarOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 12,
        // CORREÇÃO CRÍTICA: Permite cliques na sidebar
        pointerEvents: 'box-none',
    },
    sidebarFooter: {
        marginTop: 10,
        paddingTop: 11,
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray,
    },
    navBarItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    lastMenuItem: {
        borderBottomWidth: 0,
    },
    menuContainer: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 120 : 85,
        right: PADDING_HORIZONTAL,
        width: 200,
        borderRadius: 10,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.30,
        shadowRadius: 3.90,
        zIndex: 110,
    },
    menuItem: {
        padding: 14,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: 16.5,
        marginLeft: 12,
    },
});

// =========================================================================
// ESTILOS DINÂMICOS
// =========================================================================
export const styles = {
    ...staticStyles,
    
    safeArea: ({ isDarkMode }: StyleProps) => ({
        flex: 1,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    }),
    
    contentContainer: ({ isDarkMode }: StyleProps) => ({
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingBottom: 110, 
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    }),
    
    header: ({ isDarkMode }: StyleProps) => ({
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingVertical: 9,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
        borderBottomWidth: 0.5,
        borderBottomColor: isDarkMode ? COLORS.menuItemBorder : COLORS.lightGray,
        ...staticStyles.headerAndroidPadding,
    }),
    
    appGreeting: ({ isDarkMode }: StyleProps) => ({
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        fontSize: 27,
        fontWeight: 'bold',
        marginBottom: 9,
        paddingTop: 16,
    }),
    
    dateText: ({ isDarkMode }: StyleProps) => ({
        fontSize: 10,
        color: isDarkMode ? COLORS.subText : COLORS.gray,
    }),
    
    sectionContainer: ({ isDarkMode }: StyleProps) => ({
        marginTop: 15,
        paddingVertical: 3,
    }),
    
    sectionTitle: ({ isDarkMode }: StyleProps) => ({
        fontSize: 19,
        fontWeight: '800',
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        marginBottom: 11,
    }),
    
    saldoContainer: ({ isDarkMode }: StyleProps) => ({
        padding: 10,
        borderRadius: 20,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        marginTop: 18,
        borderWidth: 1.3,
        borderColor: isDarkMode ? COLORS.primary + '90' : COLORS.lightGray,
        ...Platform.select({
            ios: {
                shadowColor: isDarkMode ? COLORS.primary : COLORS.gray,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
            },
            android: { 
                elevation: 9 
            },
        }),
    }),
    
    paymentSubtitle: ({ isDarkMode }: StyleProps) => ({
        fontSize: 15,
        textAlign: 'center',
        color: isDarkMode ? COLORS.primaryLight : COLORS.primary,
        fontWeight: '700',
        marginBottom: 5,
    }),
    
    saldoTitle: ({ isDarkMode }: StyleProps) => ({
        fontSize: 15,
        color: isDarkMode ? COLORS.subText : COLORS.gray,
        fontWeight: '700',
    }),
    
    saldoValue: ({ isDarkMode }: StyleProps) => ({
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.primaryLight,
        marginVertical: 9,
        textShadowColor: COLORS.ana + '80',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    }),
    
    payButton: ({ isDarkMode }: StyleProps) => ({
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 14,
        ...Platform.select({
            ios: {
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 1.2,
                shadowRadius: 3,
            },
            android: { 
                elevation: 10 
            },
        }),
    }),
    
    payButtonText: ({ isDarkMode }: StyleProps) => ({
        fontSize: 19,
        fontWeight: '800',
        color: COLORS.white,
    }),
    
    serviceListContainer: ({ isDarkMode }: StyleProps) => ({
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: isDarkMode ? COLORS.subText + '30' : COLORS.lightGray,
    }),
    
    serviceListItem: ({ isDarkMode }: StyleProps) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 13,
        borderBottomWidth: 1.2,
        borderBottomColor: isDarkMode ? COLORS.menuItemBorder : COLORS.lightGray,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    }),
    
    serviceListIconContainer: ({ isDarkMode }: StyleProps) => ({
        marginRight: 16,
        width: 27,
        alignItems: 'center',
    }),
    
    serviceListTitle: ({ isDarkMode }: StyleProps) => ({
        flex: 1,
        fontSize: 17.9,
        fontWeight: '700',
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),
    
    bottomNavBar: ({ isDarkMode }: StyleProps) => ({
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 14,
        paddingBottom: Platform.OS === 'ios' ? 45 : 20,
        paddingHorizontal: 5,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderTopWidth: 1,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        borderTopColor: isDarkMode ? COLORS.menuItemBorder : COLORS.lightGray,
        shadowColor: isDarkMode ? '#000' : COLORS.gray,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: isDarkMode ? 0.25 : 0.1,
        shadowRadius: 15,
        elevation: 10,
    }),
    
    sidebar: ({ isDarkMode, width }: StyleProps) => ({
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: width || 270,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        zIndex: 13, // Acima do overlay
        shadowColor: isDarkMode ? '#000' : '#ccc',
        shadowOffset: { width: 2, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    }),
    
    sidebarAvatar: ({ isDarkMode }: StyleProps) => ({
        width: 48,
        height: 50,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
    }),
    
    sidebarHeader: ({ isDarkMode }: StyleProps) => ({
        padding: 15,
        paddingTop: Platform.OS === 'android' ? 42 : 50,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
        borderBottomWidth: 1,
        borderBottomColor: isDarkMode ? COLORS.subText + '20' : COLORS.lightGray,
    }),
    
    sidebarHeaderText: ({ isDarkMode }: StyleProps) => ({
        fontSize: 20,
        fontWeight: '800',
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        marginTop: 10,
    }),
    
    sidebarAvatarText: ({ isDarkMode }: StyleProps) => ({
        color: COLORS.white,
        fontSize: 20,
        fontWeight: 'bold',
    }),
    
    sidebarHeaderSubtitle: ({ isDarkMode }: StyleProps) => ({
        fontSize: 16,
        color: isDarkMode ? COLORS.subText : COLORS.gray,
    }),
    
    sidebarText: ({ isDarkMode }: StyleProps) => ({
        fontSize: 16,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        marginLeft: 10,
        fontWeight: '600',
    }),
    
    sidebarItem: ({ isDarkMode }: StyleProps) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: isDarkMode ? COLORS.menuItemBorder : COLORS.lightGray,
    }),
    
    navBarText: ({ isDarkMode }: StyleProps) => ({
        fontSize: 14,
        marginTop: 4,
        fontWeight: '800',
        color: isDarkMode ? COLORS.textLight : COLORS.gray,
    }),

    // Estilos dinâmicos para Menu Options
    menuContainer: (isDarkMode: boolean) => ({
        ...staticStyles.menuContainer,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    }),
    menuItem: (isDarkMode: boolean) => ({
        ...staticStyles.menuItem,
        borderBottomColor: isDarkMode ? COLORS.menuItemBorder : COLORS.lightGray,
    }),
    menuItemText: (isDarkMode: boolean) => ({
        ...staticStyles.menuItemText,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),
};
