// /styles/_Comprovativo.styles.ts

import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Cores (Ajustadas para consistência)
export const COLORS = {
    primary: '#39FF14',       // Verde Neon
    darkBackground: '#0F0F0F',
    lightBackground: '#F0F2F5',
    cardDark: '#1F1F1F',
    cardLight: '#FFFFFF',
    textDark: '#1C1C1C',
    textLight: '#E0E0E0',
    subText: '#888888',
    danger: '#FF4500',        // Laranja/Vermelho
    success: '#00C853',       // Verde de Sucesso
    white: '#FFFFFF',
    dark: '#000000',
    separator: '#444444',
};

// Estilos Dinâmicos e Estáticos
export const styles = StyleSheet.create({
    // ESTE ESTILO DEVE SER CHAMADO COMO fullContainer(isDarkMode) no seu ecrã
    fullContainer: (isDarkMode: boolean) => ({
        flex: 1,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    }),
    scrollContentContainer: {
        padding: 20,
        alignItems: 'center',
        paddingBottom: 100, 
    },

    // --- Header / Cartão de Confirmação ---
    headerCard: (isDarkMode: boolean, isSuccess: boolean) => ({
        width: '100%',
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        borderRadius: 15,
        padding: 30,
        alignItems: 'center',
        marginBottom: 20,
        // Borda de destaque (fina)
        borderBottomWidth: 5,
        borderBottomColor: isSuccess ? COLORS.success : COLORS.danger,
    }),
    statusText: (isSuccess: boolean) => ({
        fontSize: 18,
        fontWeight: '700',
        marginTop: 15,
        color: isSuccess ? COLORS.success : COLORS.danger,
    }),
    valueText: {
        fontSize: 32,
        fontWeight: '900',
        marginTop: 10,
        color: COLORS.primary,
    },

    // --- Secção de Detalhes ---
    detailSection: (isDarkMode: boolean) => ({
        width: '100%',
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
    }),
    sectionTitle: (isDarkMode: boolean) => ({
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 15,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    }),
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(136, 136, 136, 0.1)',
    },
    detailLabel: (isDarkMode: boolean) => ({
        fontSize: 14,
        color: isDarkMode ? COLORS.subText : COLORS.textDark,
        flex: 1,
    }),
    detailValue: (isDarkMode: boolean, isHighlight: boolean) => ({
        fontSize: isHighlight ? 16 : 14,
        fontWeight: isHighlight ? '900' : '600',
        color: isHighlight ? COLORS.primary : (isDarkMode ? COLORS.textLight : COLORS.textDark),
        textAlign: 'right' as 'right',
        flex: 1.5,
    }),

    // --- Botões de Ação (Fundo Fixo) ---
    actionContainer: (isDarkMode: boolean) => ({
        position: 'absolute',
        bottom: 0,
        width: width,
        padding: 20,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
        borderTopWidth: 1,
        borderTopColor: isDarkMode ? COLORS.separator : COLORS.subText,
        flexDirection: 'column',
    }),
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    homeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 8,
        backgroundColor: COLORS.dark, // Fundo escuro para botão secundário
        borderWidth: 1,
        borderColor: COLORS.dark,
    },
    buttonText: {
        color: COLORS.dark,
        fontWeight: '700',
        marginLeft: 10,
        fontSize: 16,
    },
});
