// /styles/_Transacao.styles.ts

import { StyleSheet } from 'react-native';

// Cores base (Mantenha o seu esquema, mas adicione as variáveis de tema escuro/claro esperadas)
const primaryColor = '#007bff';
const successColor = '#28a745';
const errorColor = '#dc3545';
const warningColor = '#ffc107';
const darkGray = '#343a40'; // Usado para COLORS.dark e textDark (Modo Claro)
const lightBackground = '#f8f9fa';

// 💡 Definições de Cores para compatibilidade com Dark Mode (esperadas por TransacaoScreen.tsx)
const DARK_MODE_BACKGROUND = '#1C1C1E';
const LIGHT_MODE_BACKGROUND = lightBackground;
const DARK_MODE_CARD = '#2C2C2E';
const LIGHT_MODE_CARD = '#FFFFFF';
const TEXT_LIGHT = '#FFFFFF';
const TEXT_DARK = darkGray;
const SUB_TEXT = '#8E8E93';


export const COLORS = {
    // Cores Primárias/Feedback
    primary: primaryColor,
    success: successColor,
    error: errorColor,
    warning: warningColor,
    danger: errorColor, // Usado para a tela de transação

    // Cores de Tema (para uso em estilos dinâmicos)
    textDark: TEXT_DARK,
    textLight: TEXT_LIGHT,
    subText: SUB_TEXT,
    darkBackground: DARK_MODE_BACKGROUND,
    lightBackground: LIGHT_MODE_BACKGROUND,
    cardDark: DARK_MODE_CARD,
    cardLight: LIGHT_MODE_CARD,

    // Outras cores estáticas que você definiu
    dark: darkGray,
    white: '#fff',
    cardShadow: '#000',
};


// Estilos Estáticos (Mapeamento dos seus estilos)
const staticStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    // --- Estilos do Status (Ícone/Mensagem) ---
    statusContainer: {
        alignItems: 'center',
        marginBottom: 30,
        padding: 20,
        width: '100%',
    },
    // --- Estilos do Recibo ---
    reciboCard: {
        width: '100%',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    reciboTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        borderBottomWidth: 1,
        paddingBottom: 10,
    },
    reciboRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    // --- Estilos de Botões de Ação ---
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 15,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        marginBottom: 10,
    },
    downloadButtonText: {
        color: TEXT_LIGHT,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    homeButton: {
        width: '100%',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
    },
});


// =========================================================================
// EXPORTAÇÃO DOS ESTILOS DINÂMICOS (para TransacaoScreen.tsx)
// =========================================================================
export const styles = {
    // Estilos de Layout Base
    safeArea: (isDarkMode: boolean) => ({
        ...staticStyles.safeArea,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    }),
    container: (isDarkMode: boolean) => ({
        ...staticStyles.container,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
        alignItems: 'center', // Adicionado para centralizar o conteúdo do recibo
    }),
    
    // Status
    statusContainer: staticStyles.statusContainer,
    statusTitle: (isDarkMode: boolean, isSuccess: boolean) => ({
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 15,
        color: isSuccess ? COLORS.success : COLORS.danger,
    }),
    statusMessage: (isDarkMode: boolean) => ({
        color: isDarkMode ? COLORS.subText : COLORS.subText,
        marginTop: 5,
        textAlign: 'center',
    }),
    
    // Cartão de Recibo
    reciboCard: (isDarkMode: boolean) => ({
        ...staticStyles.reciboCard,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        shadowColor: COLORS.cardShadow,
    }),
    reciboTitle: (isDarkMode: boolean) => ({
        ...staticStyles.reciboTitle,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        borderColor: isDarkMode ? COLORS.subText + '50' : '#f1f1f1', // Ajuste para o separador
    }),
    reciboLabel: (isDarkMode: boolean) => ({
        color: isDarkMode ? COLORS.subText : COLORS.dark,
        fontSize: 14,
    }),
    reciboValue: (isDarkMode: boolean) => ({
        color: isDarkMode ? COLORS.textLight : COLORS.dark,
        fontSize: 14,
        fontWeight: '500',
    }),
    
    // Total
    totalRow: (isDarkMode: boolean) => ({
        ...staticStyles.reciboRow,
        marginTop: 15,
        paddingTop: 10,
        borderTopWidth: 1,
        borderColor: isDarkMode ? COLORS.subText + '50' : '#f1f1f1',
    }),
    totalLabel: (isDarkMode: boolean) => ({
        color: isDarkMode ? COLORS.textLight : COLORS.dark,
        fontSize: 16,
        fontWeight: 'bold',
    }),
    totalValue: (isDarkMode: boolean) => ({
        color: COLORS.primary, // O valor total deve ser sempre a cor primária
        fontSize: 16,
        fontWeight: 'bold',
    }),

    // Botão Voltar ao Início
    downloadButton: staticStyles.downloadButton,
    downloadButtonText: staticStyles.downloadButtonText,

    homeButton: (isDarkMode: boolean) => ({
        ...staticStyles.homeButton,
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        borderColor: isDarkMode ? COLORS.subText : '#ccc',
    }),
    homeButtonText: (isDarkMode: boolean) => ({
        color: isDarkMode ? COLORS.textLight : COLORS.dark,
        fontSize: 16,
        fontWeight: '600',
    }),
};
