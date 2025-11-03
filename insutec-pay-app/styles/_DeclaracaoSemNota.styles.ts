// styles/_DeclaracaoSemNota.styles.ts
import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#1a4a6d',
  primaryLight: '#2a5a8d',
  primaryDark: '#0d2a45',
  white: '#fff',
  textDark: '#333',
  darkBackground: '#1c1c1c',
  lightBackground: '#f5f5f5',
  success: '#2ecc71',
  warning: '#f39c12',
  danger: '#e74c3c',
  disabled: '#95a5a6',
  darkCard: '#2a2a2a',
  darkBorder: '#555',
  lightBorder: '#ccc',
  lightGray: '#e0e0e0',
  darkGray: '#3a3a3a',
  successDark: '#1a3a2a',
  successBorderDark: '#2a4a3a',
  successLight: '#d4edda',
  successBorderLight: '#c3e6cb',
  infoDark: '#1e3a5f',
  infoBorderDark: '#2a4a7a',
  infoLight: '#e6f7ff',
  infoBorderLight: '#a0d9ff',
};

const GRADIENTS = {
  primary: ['#1a4a6d', '#2a5a8d'],
  payButton: ['#1a4a6d', '#0d2a45'],
  payButtonDisabled: ['#a0a8b3', '#95a5a6'],
  infoLight: ['#e6f7ff', '#cceeff'],
  infoDark: ['#1e3a5f', '#2a4a7a'],
};

export const GRADIENT = {
  header: (dark: boolean) =>
    dark ? GRADIENTS.infoDark : ['#e6f7ff', '#f0f8ff'],
  payButton: (dark: boolean) => (dark ? GRADIENTS.payButton : GRADIENTS.primary),
  payButtonDisabled: GRADIENTS.payButtonDisabled,
  summaryCard: (dark: boolean) => (dark ? GRADIENTS.infoDark : GRADIENTS.infoLight),
  primary: (dark: boolean) => (dark ? GRADIENTS.payButton : GRADIENTS.primary),
  success: (dark: boolean) => (dark ? ['#1a3a2a', '#2a4a3a'] : ['#d4edda', '#c3e6cb']),
  disabled: GRADIENTS.payButtonDisabled,
};

export const createDeclaracaoStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingBottom: 32,
      backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    },

    headerContainer: {
      position: 'relative',
      marginBottom: 20,
    },

    headerGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 80,
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
      opacity: 0.9,
    },

    header: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      marginVertical: 24,
      letterSpacing: 0.5,
      zIndex: 1,
    },

    section: {
      marginBottom: 20,
      padding: 18,
      backgroundColor: isDarkMode ? COLORS.darkCard : COLORS.white,
      borderRadius: 20,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      overflow: 'hidden',
    },

    // CORRIGIDO: Agora é função
    sectionTitle: (dark: boolean) => ({
      fontSize: 18,
      fontWeight: '700',
      color: dark ? COLORS.white : COLORS.textDark,
      marginBottom: 12,
      letterSpacing: 0.3,
    }),

    normalText: {
      color: isDarkMode ? '#eee' : COLORS.textDark,
      fontSize: 14.5,
      lineHeight: 22,
    },

    input: {
      borderWidth: 1.5,
      borderColor: isDarkMode ? '#555' : '#ddd',
      borderRadius: 14,
      padding: 16,
      fontSize: 16,
      color: isDarkMode ? '#eee' : '#333',
      backgroundColor: isDarkMode ? '#333' : '#fff',
    },

    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
    },

    quantityButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: COLORS.primary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 3,
    },

    quantityButtonText: {
      color: '#fff',
      fontSize: 22,
      fontWeight: 'bold',
    },

    quantityText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? COLORS.white : COLORS.textDark,
      minWidth: 40,
      textAlign: 'center',
    },

    uploadSection: {
      marginBottom: 10,
    },

    uploadButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
      borderRadius: 20,
      gap: 12,
      overflow: 'hidden',
      elevation: 6,
    },

    uploadButtonDefault: {},
    uploadButtonSuccess: {},

    uploadButtonText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: '600',
    },

    uploadSuccessText: (dark: boolean) => ({
      marginTop: 6,
      fontSize: 13,
      color: COLORS.success,
      textAlign: 'center',
      fontWeight: '500',
    }),

    error: (dark: boolean) => ({
      color: COLORS.danger,
      fontSize: 14,
      textAlign: 'center',
      marginVertical: 12,
      fontWeight: '500',
    }),

    summaryCard: {
      padding: 15,
      borderRadius: 20,
      marginTop: 5,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 1.2,
      shadowRadius: 10,
      overflow: 'hidden',
    },

    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      alignItems: 'center',
    },

    summaryText: {
      color: isDarkMode ? '#eee' : COLORS.textDark,
      fontSize: 15.5,
      fontWeight: '500',
    },

    totalLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? COLORS.white : COLORS.primary,
    },

    totalAmount: {
      fontSize: 22,
      fontWeight: 'bold',
      color: isDarkMode ? COLORS.white : COLORS.primary,
    },

    payButton: {
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 20,
      marginTop: 20,
      marginHorizontal: 55,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 7,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      overflow: 'hidden',
    },

    payButtonDisabled: {
      elevation: 0,
      shadowOpacity: 0,
    },

    payButtonInner: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      justifyContent: 'center',
    },

    payButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 5,
    },

    infoText: {
      fontSize: 13,
      color: isDarkMode ? '#bbb' : '#555',
      fontStyle: 'italic',
      marginTop: 20,
      textAlign: 'center',
      lineHeight: 17,
    },
  });

export const sharedFinanceStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    },
  });
