// styles/_FolhadeProva.styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmall = width < 380;

export const COLORS = {
  primary: '#1a4a6d',
  primaryLight: '#2a5a8d',
  white: '#fff',
  textDark: '#333',
  textLight: '#eee',
  darkBackground: '#1c1c1c',
  lightBackground: '#f5f5f5',
  success: '#2ecc71',
  danger: '#e74c3c',
  disabled: '#95a5a6',
  darkCard: '#2a2a2a',
  lightCard: '#fff',
  gray: '#777',
  lightGray: '#e0e0e0',
};

const GRADIENTS = {
  primary: ['#1a4a6d', '#2a5a8d'],
  payButton: ['#1a4a6d', '#0d2a45'],
  payButtonDisabled: ['#a0a8b3', '#95a5a6'],
  headerLight: ['#e6f7ff', '#f0f8ff'],
  headerDark: ['#1e3a5f', '#2a4a7a'],
};

export const GRADIENT = {
  header: (dark: boolean) => (dark ? GRADIENTS.headerDark : GRADIENTS.headerLight),
  payButton: (dark: boolean) => (dark ? GRADIENTS.payButton : GRADIENTS.primary),
  payButtonDisabled: GRADIENTS.payButtonDisabled,
};

export const createFolhaDeProvaStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingHorizontal: isSmall ? 12 : 16,
      paddingBottom: 20,
      backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    },

    headerContainer: {
      position: 'relative',
      marginBottom: 24,
      paddingHorizontal: 8,
    },

    headerGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 90,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      opacity: 0.92,
    },

    header: {
      fontSize: isSmall ? 22 : 26,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      marginTop: 16,
      letterSpacing: 0.5,
      zIndex: 1,
    },

    subHeader: {
      fontSize: isSmall ? 14 : 15,
      color: '#fff',
      textAlign: 'center',
      marginTop: 8,
      opacity: 0.9,
      zIndex: 1,
    },

    itemCard: {
      backgroundColor: isDarkMode ? COLORS.darkCard : COLORS.lightCard,
      borderRadius: 20,
      marginHorizontal: 16,
      padding: 20,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      overflow: 'hidden',
    },

    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    itemDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },

    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: isDarkMode ? '#2a3a50' : '#e6f0ff',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      borderWidth: 1.5,
      borderColor: COLORS.primary + '40',
    },

    textContainer: {
      flex: 1,
    },

    itemName: {
      fontSize: 17,
      fontWeight: '700',
      color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    },

    itemPrice: {
      fontSize: 15,
      fontWeight: '600',
      color: COLORS.primary,
      marginTop: 2,
    },

    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },

    quantityButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: isDarkMode ? '#333' : '#f8f8f8',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: COLORS.primary + '60',
      elevation: 2,
    },

    quantityButtonDisabled: {
      borderColor: '#aaa',
      opacity: 0.5,
    },

    quantityDisplay: {
      minWidth: 48,
      paddingHorizontal: 8,
    },

    quantityText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? COLORS.white : COLORS.textDark,
    },

    subtotalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      paddingTop: 16,
      borderTopWidth: 1.5,
      borderTopColor: isDarkMode ? '#444' : '#eee',
    },

    subtotalLabel: {
      fontSize: 16,
      color: isDarkMode ? '#ccc' : '#555',
      fontWeight: '600',
    },

    subtotalValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: COLORS.primary,
    },

    warningText: {
      fontSize: 13,
      color: '#ff6b35',
      textAlign: 'center',
      marginTop: 12,
      fontStyle: 'italic',
      fontWeight: '500',
    },

    infoCard: {
      backgroundColor: isDarkMode ? COLORS.darkCard : COLORS.lightCard,
      borderRadius: 18,
      marginHorizontal: 16,
      marginTop: 20,
      padding: 18,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },

    infoTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: isDarkMode ? COLORS.textLight : COLORS.textDark,
      marginBottom: 12,
    },

    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },

    infoLabel: {
      fontSize: 14,
      color: isDarkMode ? '#aaa' : '#666',
    },

    infoValue: {
      fontSize: 14,
      fontWeight: '600',
      color: isDarkMode ? COLORS.white : COLORS.textDark,
    },

    footer: {
      padding: 20,
      backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#333' : '#ddd',
    },

    payButton: {
      borderRadius: 18,
      overflow: 'hidden',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
    },

    payButtonDisabled: {
      elevation: 0,
      shadowOpacity: 0,
    },

    payButtonInner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 18,
      gap: 10,
    },

    payButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },

    paymentMethods: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 16,
      gap: 20,
    },

    paymentIcon: {
      fontSize: 22,
      color: isDarkMode ? '#777' : '#999',
    },
  });

export const sharedFinanceStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    },
  });
