// styles/_VerAjuda.styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmall = width < 380;

// =========================================================================
// CORES OFICIAIS DO APP (IGUAIS ÀS OUTRAS TELAS)
// =========================================================================
export const COLORS = {
  primary: '#1a4a6d',      // Azul principal (botões, ícones)
  primaryLight: '#2a5a8d',  // Azul claro (gradiente)
  primaryDark: '#0d2a45',   // Azul escuro (header, botões escuros)
  white: '#fff',
  textDark: '#333',
  textLight: '#eee',
  darkBackground: '#1c1c1c',
  lightBackground: '#f5f5f5',
  cardDark: '#2a2a2a',
  cardLight: '#fff',
  borderDark: '#444',
  borderLight: '#ddd',
  gray: '#888',
  lightGray: '#f0f0f0',
};

// =========================================================================
// GRADIENTES OFICIAIS (IGUAIS ÀS OUTRAS TELAS)
// =========================================================================
const GRADIENTS = {
  primary: ['#1a4a6d', '#2a5a8d'],
  payButton: ['#1a4a6d', '#0d2a45'],
  payButtonDisabled: ['#a0a8b3', '#95a5a6'],
  headerLight: ['#e6f7ff', '#f0f8ff'],
  headerDark: ['#1e3a5f', '#2a4a7a'],
  cardLight: ['#f8f9ff', '#e6eeff'],
  cardDark: ['#2a3a50', '#1e2a40'],
  infoPrimary: ['#1a4a6d', '#2a5a8d'],
  infoDark: ['#0d2a45', '#1a4a6d'],
};

// =========================================================================
// FUNÇÃO PARA ACESSAR GRADIENTES
// =========================================================================
export const GRADIENT = {
  header: (dark: boolean) => (dark ? GRADIENTS.headerDark : GRADIENTS.headerLight),
  payButton: (dark: boolean) => (dark ? GRADIENTS.payButton : GRADIENTS.primary),
  payButtonDisabled: () => GRADIENTS.payButtonDisabled,
  card: (dark: boolean) => (dark ? GRADIENTS.cardDark : GRADIENTS.cardLight),
  infoPrimary: () => GRADIENTS.infoPrimary,
  infoDark: () => GRADIENTS.infoDark,
};

// =========================================================================
// ESTILOS PRINCIPAIS — 100% RESPONSIVOS E IDÊNTICOS
// =========================================================================
export const createAjudaStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    },

    headerContainer: {
      marginBottom: 24,
      overflow: 'hidden',
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
    },

    headerGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 120,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
    },

    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 20,
    },

    headerIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#ffffff30',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      borderWidth: 1.5,
      borderColor: '#ffffff20',
    },

    headerText: {
      flex: 1,
    },

    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
      letterSpacing: 0.3,
    },

    headerSubtitle: {
      fontSize: 14,
      color: '#fff',
      opacity: 0.9,
      marginTop: 2,
    },

    scrollContent: {
      paddingHorizontal: isSmall ? 12 : 16,
      paddingBottom: 20,
    },

    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#333' : '#f8f8f8',
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      marginBottom: 20,
      borderWidth: 1.5,
      borderColor: 'transparent',
    },

    searchFocused: {
      borderColor: COLORS.primary,
      backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },

    searchInput: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      color: isDarkMode ? '#eee' : '#333',
    },

    quickSection: {
      marginBottom: 24,
    },

    sectionTitle: (dark: boolean) => ({
      fontSize: 18,
      fontWeight: '700',
      color: dark ? '#fff' : COLORS.textDark,
      marginBottom: 16,
      letterSpacing: 0.3,
    }),

    quickGrid: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },

    quickButton: {
      alignItems: 'center',
      width: 80,
    },

    quickButtonGradient: {
      position: 'absolute',
      top: -10,
      left: -10,
      right: -10,
      bottom: -10,
      borderRadius: 40,
      opacity: 0.3,
    },

    quickLabel: (dark: boolean) => ({
      marginTop: 8,
      fontSize: 13,
      fontWeight: '600',
      color: dark ? '#ddd' : '#555',
    }),

    tabContainer: {
      flexDirection: 'row',
      backgroundColor: isDarkMode ? '#2a2a2a' : '#f0f0f0',
      borderRadius: 16,
      padding: 4,
      marginBottom: 20,
    },

    tab: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
    },

    tabActive: {
      backgroundColor: COLORS.primary,
    },

    tabText: {
      fontSize: 15,
      fontWeight: '600',
      color: isDarkMode ? '#aaa' : '#666',
    },

    tabTextActive: (dark: boolean) => ({
      color: '#fff',
      fontWeight: '700',
    }),

    cardContainer: {
      marginBottom: 16,
      borderRadius: 20,
      overflow: 'hidden',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
    },

    cardGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },

    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 18,
    },

    cardIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      borderWidth: 1.5,
      borderColor: COLORS.primary + '40',
    },

    cardIconText: {
      fontSize: 20,
    },

    cardText: {
      flex: 1,
    },

    cardTitle: (dark: boolean) => ({
      fontSize: 16,
      fontWeight: '600',
      color: dark ? '#fff' : COLORS.textDark,
    }),

    cardSubtitle: (dark: boolean) => ({
      fontSize: 13,
      color: dark ? '#bbb' : '#777',
      marginTop: 2,
    }),

    emptyText: (dark: boolean) => ({
      textAlign: 'center',
      fontSize: 15,
      color: dark ? '#999' : '#666',
      fontStyle: 'italic',
      marginTop: 40,
    }),
  });

// =========================================================================
// ESTILOS COMPARTILHADOS (SafeAreaView, etc.)
// =========================================================================
export const sharedStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    },
  });
