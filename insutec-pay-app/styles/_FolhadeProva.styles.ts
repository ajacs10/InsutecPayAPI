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
      // Aumentei um pouco o padding inferior para garantir espaço para o novo bloco de quantidade e o footer
      paddingBottom: 150, 
      backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    },

    headerContainer: {
      position: 'relative',
      marginBottom: 28,
      paddingHorizontal: 8,
    },

    headerGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 100,
      borderBottomLeftRadius: 36,
      borderBottomRightRadius: 36,
      opacity: 0.94,
    },

    header: {
      fontSize: isSmall ? 23 : 27,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      marginTop: 20,
      letterSpacing: 0.6,
      zIndex: 1,
    },

    subHeader: {
      fontSize: isSmall ? 14 : 15,
      color: '#fff',
      textAlign: 'center',
      marginTop: 8,
      opacity: 0.92,
      zIndex: 1,
    },

    itemCard: {
      backgroundColor: isDarkMode ? COLORS.darkCard : COLORS.lightCard,
      borderRadius: 24,
      marginHorizontal: 16,
      padding: 22,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 12,
      overflow: 'hidden',
    },

    // O itemRow original não precisa mais do quantityContainer, mas mantemos o resto
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start', // Não precisamos de space-between aqui, já que o quantityContainer foi removido
    },

    itemDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },

    iconContainer: {
      width: 58,
      height: 58,
      borderRadius: 18,
      backgroundColor: isDarkMode ? '#2a3a55' : '#e8f2ff',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      borderWidth: 1.8,
      borderColor: COLORS.primary + '50',
    },

    textContainer: {
      flex: 1,
      justifyContent: 'center',
    },

    itemName: {
      fontSize: 18,
      fontWeight: '700',
      color: isDarkMode ? COLORS.textLight : COLORS.textDark,
      marginBottom: 8,
    },

    itemPrice: {
      fontSize: 16,
      fontWeight: '700',
      color: COLORS.primaryLight,
      marginTop: 6,
    },

    // ESTILO ORIGINAL (Não usado na nova estrutura do card, mas pode ser útil)
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },

    // Estilo do botão de quantidade (ajustado para ser um pouco maior)
    quantityButton: {
      width: isSmall ? 45 : 55, // Aumentado
      height: isSmall ? 45 : 55, // Aumentado
      borderRadius: 30, // Mais redondo
      backgroundColor: isDarkMode ? '#333' : '#f9f9f9',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.8,
      borderColor: COLORS.primary + '70',
      elevation: 3,
    },

    quantityButtonDisabled: {
      borderColor: '#999',
      opacity: 0.5,
    },

    // Estilo de visualização de quantidade original (Não usado na nova estrutura)
    quantityDisplay: {
      minWidth: 50,
      paddingHorizontal: 10,
    },

    // Estilo de texto de quantidade original (Não usado na nova estrutura)
    quantityText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: isDarkMode ? COLORS.white : COLORS.textDark,
    },

    subtotalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 24,
      paddingTop: 18,
      borderTopWidth: 1.8,
      borderTopColor: isDarkMode ? '#444' : '#e0e0e0',
    },

    subtotalLabel: {
      fontSize: 17,
      color: isDarkMode ? '#ccc' : '#555',
      fontWeight: '600',
    },

    subtotalValue: {
      fontSize: 22,
      fontWeight: 'bold',
      color: COLORS.primaryLight,
    },

    warningText: {
      fontSize: 13.5,
      color: '#ff6b35',
      textAlign: 'center',
      marginTop: 14,
      fontStyle: 'italic',
      fontWeight: '500',
    },

    infoCard: {
      backgroundColor: isDarkMode ? COLORS.darkCard : COLORS.lightCard,
      borderRadius: 20,
      marginHorizontal: 16,
      marginTop: 24,
      padding: 20,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
    },

    infoTitle: {
      fontSize: 16.5,
      fontWeight: '700',
      color: isDarkMode ? COLORS.textLight : COLORS.textDark,
      marginBottom: 14,
    },

    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },

    infoLabel: {
      fontSize: 14.5,
      color: isDarkMode ? '#aaa' : '#666',
    },

    infoValue: {
      fontSize: 14.5,
      fontWeight: '600',
      color: isDarkMode ? COLORS.white : COLORS.textDark,
    },

    // --- NOVOS ESTILOS PARA O SELETOR DE QUANTIDADE INFERIOR ---

    bottomQuantityWrapper: {
        marginTop: 30, // Mais espaço após o infoCard
        marginBottom: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    
    quantityContainerAdjusted: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around', // Usar space-around para melhor distribuição
        marginTop: 15,
        padding: 10,
        backgroundColor: isDarkMode ? COLORS.darkCard : COLORS.lightCard, // Usar cor de card para destaque
        borderRadius: 50,
        width: '85%', // Maior para ser mais fácil de tocar
        maxWidth: 350,
        elevation: 6,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    
    quantityDisplayAdjusted: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 90, 
        marginHorizontal: 10,
    },
    
    quantityTextAdjusted: {
        fontSize: isSmall ? 36 : 44, // Ainda maior e mais proeminente
        fontWeight: '900',
        color: COLORS.primary,
    },
    
    itemPriceAdjusted: {
        fontSize: 14,
        color: isDarkMode ? COLORS.subText : COLORS.gray,
        marginTop: -5,
        fontWeight: '600',
    },

    // --- FIM NOVOS ESTILOS ---

    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 20,
      backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#333' : '#ddd',
      zIndex: 10, // Garante que fique acima do conteúdo
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
  });

export const sharedFinanceStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    },
  });
