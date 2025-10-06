// /styles/_Comprovativo.styles.ts

import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Paleta de Cores (Reutilizadas para consistência)
export const COLORS = {
    primary: '#39FF14', // Verde neon (Ação/Destaque)
    darkBackground: '#0F0F0F',
    lightBackground: '#F0F2F5',
    cardDark: '#1F1F1F',
    cardLight: '#FFFFFF',
    textDark: '#1C1C1C',
    textLight: '#E0E0E0',
    subText: '#888888',
    danger: '#FF4500',
    warning: '#FFCC00', 
    success: '#00C853', // Verde para sucesso
    white: '#FFFFFF',
    dark: '#000000',
    blue: '#0078AE',
};

// =========================================================================
// ESTILOS ESTÁTICOS
// =========================================================================
const staticBaseStyles = StyleSheet.create({
    // --- GERAL ---
    scrollContentContainer: {
        padding: 16,
        paddingBottom: 100, // Espaço para os botões fixos
    },
    
    // --- Topo (Cartão de Confirmação) ---
    headerCardBase: {
        padding: 25,
        borderRadius: 16,
        marginBottom: 20,
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    statusTextBase: {
        fontSize: 22,
        fontWeight: '800',
        marginTop: 15,
        textAlign: 'center',
    },
    valueText: {
        fontSize: 40,
        fontWeight: '900',
        marginTop: 10,
        color: COLORS.white,
    },

    // --- Detalhes ---
    sectionTitleBase: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(136, 136, 136, 0.2)',
    },
    detailLabelBase: {
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
    detailValueBase: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'right',
        flex: 1.5,
    },

    // --- Ações (Rodapé Fixo) ---
    actionContainerBase: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderTopWidth: 1,
        justifyContent: 'space-between',
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.warning,
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
        justifyContent: 'center',
    },
    homeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        padding: 12,
        borderRadius: 8,
        flex: 1.5,
        justifyContent: 'center',
    },
    buttonText: {
        color: COLORS.dark,
        fontWeight: '700',
        marginLeft: 5,
        fontSize: 14,
    },
});

// =========================================================================
// ESTILOS DINÂMICOS
// =========================================================================
export const styles = {
    // --- GERAL/Layout ---
    fullContainer: (isDarkMode: boolean) => ({
        flex: 1,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    }),
    scrollContentContainer: staticBaseStyles.scrollContentContainer,
    
    // --- Topo (Cartão de Confirmação) ---
    headerCard: (isDarkMode: boolean, isSuccess: boolean) => ({
        ...staticBaseStyles.headerCardBase,
        // Cor do fundo do cartão baseada no resultado
        backgroundColor: isSuccess ? COLORS.blue : COLORS.danger,
        // Cor da sombra
        shadowColor: isSuccess ? COLORS.success : COLORS.danger,
    }),
    statusText: (isSuccess: boolean) => ({
        ...staticBaseStyles.statusTextBase,
        color: isSuccess ? COLORS.white : COLORS.white, // Mantido branco para contraste com fundos coloridos
    }),
    valueText: staticBaseStyles.valueText,

    // --- Detalhes ---
    detailSection: (isDarkMode: boolean) => ({
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    }),
    sectionTitle: (isDarkMode: boolean) => ({
        ...staticBaseStyles.sectionTitleBase,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),
    detailRow: staticBaseStyles.detailRow,

    detailLabel: (isDarkMode: boolean) => ({
        ...staticBaseStyles.detailLabelBase,
        color: isDarkMode ? COLORS.subText : COLORS.gray,
    }),
    // O valor do saldo final é destacado (isHighlight)
    detailValue: (isDarkMode: boolean, isHighlight: boolean) => ({
        ...staticBaseStyles.detailValueBase,
        color: isHighlight 
            ? COLORS.primary // Saldo final em verde neon
            : (isDarkMode ? COLORS.textLight : COLORS.textDark), // Valor normal
    }),

    // --- Ações (Rodapé Fixo) ---
    actionContainer: (isDarkMode: boolean) => ({
        ...staticBaseStyles.actionContainerBase,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.white,
        borderTopColor: isDarkMode ? COLORS.cardDark : COLORS.lightGray,
    }),
    shareButton: staticBaseStyles.shareButton,
    homeButton: staticBaseStyles.homeButton,
    buttonText: staticBaseStyles.buttonText,
};
