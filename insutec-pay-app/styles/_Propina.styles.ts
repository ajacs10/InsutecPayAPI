// styles/_Propina.styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

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

/* ---------- GRADIENTES ---------- */
const GRADIENTS = {
  primary: ['#1a4a6d', '#2a5a8d'],
  payButton: ['#1a4a6d', '#0d2a45'],
  payButtonDisabled: ['#a0a8b3', '#95a5a6'],
  infoLight: ['#e6f7ff', '#cceeff'],
  infoDark: ['#1e3a5f', '#2a4a7a'],
  showMore: ['#e6f0ff', '#d4e6ff'],
};

export const GRADIENT = {
  header: (dark: boolean) =>
    dark ? GRADIENTS.infoDark : ['#e6f7ff', '#f0f8ff'],
  payButton: (dark: boolean) => (dark ? GRADIENTS.payButton : GRADIENTS.primary),
  payButtonDisabled: GRADIENTS.payButtonDisabled,
  summaryCard: (dark: boolean) => (dark ? GRADIENTS.infoDark : GRADIENTS.infoLight),
  showMore: (dark: boolean) => (dark ? ['#2a3a50', '#1a2a40'] : GRADIENTS.showMore),
};

/* ---------- ESTILOS PRINCIPAIS ---------- */
export const createPropinaStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingBottom: 32,
      backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    },

    header: {
      fontSize: 26,
      fontWeight: 'bold',
      color: isDarkMode ? COLORS.white : COLORS.primary,
      textAlign: 'center',
      marginVertical: 24,
      letterSpacing: 0.5,
      zIndex: 1,
    },
    headerGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 80,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      opacity: 0.9,
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

    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: isDarkMode ? COLORS.white : COLORS.textDark,
      marginBottom: 12,
      letterSpacing: 0.3,
    },

    /* ---------- MESES GRID ---------- */
    monthsGrid: {
      justifyContent: 'space-between',
      paddingHorizontal: 4,
    },

    monthItem: {
      width: (width - 64) / 3,
      margin: 4,
      padding: 14,
      borderRadius: 9,
      alignItems: 'center',
      borderWidth: 1,
      minHeight: 80,
      justifyContent: 'center',
    },
    monthItemSelected: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },
    monthItemSelectedWithFine: {
      backgroundColor: COLORS.warning,
      borderColor: COLORS.warning,
    },
    monthItemSelectedFuture: {
      backgroundColor: COLORS.success,
      borderColor: COLORS.success,
    },
    monthItemUnselected: {
      backgroundColor: isDarkMode ? COLORS.darkGray : '#f8f9fa',
      borderColor: isDarkMode ? COLORS.darkBorder : COLORS.lightBorder,
    },
    monthItemPaid: {
      backgroundColor: COLORS.disabled,
      borderColor: COLORS.disabled,
      opacity: 0.8,
    },

    monthText: {
      fontWeight: '800',
      textAlign: 'center',
      fontSize: 12,
    },
    monthTextSelected: { color: COLORS.white },
    monthTextUnselected: { color: isDarkMode ? COLORS.white : COLORS.textDark },
    monthTextPaid: { color: COLORS.white },

    monthPrice: {
      fontSize: 13,
      marginTop: 5,
      textAlign: 'center',
    },
    monthPriceSelected: { color: COLORS.white },
    monthPriceUnselected: { color: isDarkMode ? '#ccc' : '#666' },

    fineText: {
      fontSize: 10,
      color: COLORS.danger,
      fontWeight: 'bold',
      marginTop: 4,
      textAlign: 'center',
    },
    futureText: {
      fontSize: 12,
      color: COLORS.success,
      fontWeight: 'bold',
      marginTop: 2,
      textAlign: 'center',
    },
    paidText: {
      fontSize: 12,
      color: COLORS.white,
      fontWeight: 'bold',
      marginTop: 6,
      backgroundColor: COLORS.disabled,
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: 10,
      textAlign: 'center',
    },

    /* ---------- BOTÃO VER MAIS ---------- */
    showToggleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 13,
      marginTop: 16,
      borderRadius: 14,
      overflow: 'hidden',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      position: 'relative',
    },
    showToggleText: {
      color: COLORS.white,
      fontSize: 14,
      fontWeight: '600',
      marginRight: 6,
    },

    /* ---------- RESUMO ---------- */
    summaryCard: {
      padding: 18,
      borderRadius: 20,
      marginTop: 16,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
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

    /* ---------- BOTÃO PAGAR ---------- */
    payButton: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 20,
      marginTop: 20,
      marginHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'center', // CORRIGIDO
      alignItems: 'center',
      elevation: 6,
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
    payButtonText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },

    /* ---------- TEXTOS GERAIS ---------- */
    infoText: {
      fontSize: 13,
      color: isDarkMode ? '#bbb' : '#555',
      fontStyle: 'italic',
      marginTop: 8,
      lineHeight: 18,
    },
    normalText: {
      color: isDarkMode ? '#eee' : COLORS.textDark,
      fontSize: 14.5,
      lineHeight: 22,
    },

    successMessage: {
      backgroundColor: isDarkMode ? COLORS.successDark : COLORS.successLight,
      padding: 12,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: isDarkMode ? COLORS.successBorderDark : COLORS.successBorderLight,
      marginTop: 12,
    },
    successText: {
      color: isDarkMode ? '#90ee90' : '#155724',
      fontSize: 14.5,
      textAlign: 'center',
      fontWeight: '600',
    },

    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
      padding: 20,
    },
    loadingText: {
      marginTop: 16,
      color: isDarkMode ? COLORS.white : COLORS.textDark,
      fontSize: 16.5,
      fontWeight: '500',
    },

    legendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: 16,
      gap: 20,
      paddingHorizontal: 8,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    legendColor: {
      width: 13,
      height: 13,
      borderRadius: 7,
      marginRight: 8,
    },
    legendText: {
      fontSize: 13,
      color: isDarkMode ? '#ccc' : '#555',
      fontWeight: '500',
    },
  });

/* ---------- ESTILOS COMPARTILHADOS ---------- */
export const sharedFinanceStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    },
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    },
    card: {
      backgroundColor: isDarkMode ? COLORS.darkCard : COLORS.white,
      borderRadius: 16,
      padding: 18,
      marginBottom: 16,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
  });

/* ---------- HELPERS ---------- */
export const getMonthItemStyle = (
  styles: any,
  isSel: boolean,
  hasFine: boolean,
  isFuture: boolean,
  isPaid: boolean
) => {
  if (isPaid) return [styles.monthItem, styles.monthItemPaid];
  if (!isSel) return [styles.monthItem, styles.monthItemUnselected];
  if (hasFine) return [styles.monthItem, styles.monthItemSelectedWithFine];
  if (isFuture) return [styles.monthItem, styles.monthItemSelectedFuture];
  return [styles.monthItem, styles.monthItemSelected];
};

export const getMonthTextStyle = (styles: any, isSel: boolean, isPaid: boolean) => {
  if (isPaid) return [styles.monthText, styles.monthTextPaid];
  if (isSel) return [styles.monthText, styles.monthTextSelected];
  return [styles.monthText, styles.monthTextUnselected];
};

export const getMonthPriceStyle = (styles: any, isSel: boolean, isPaid: boolean) => {
  if (isPaid) return [styles.monthPrice, styles.monthPriceSelected];
  if (isSel) return [styles.monthPrice, styles.monthPriceSelected];
  return [styles.monthPrice, styles.monthPriceUnselected];
};
