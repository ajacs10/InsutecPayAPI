import { StyleSheet, Platform, Dimensions } from 'react-native';
import { COLORS } from './_SharedFinance.styles';

const { width } = Dimensions.get('window');
const PADDING_HORIZONTAL = 18;

// =========================================================================
// ESTILOS ESTÁTICOS PUROS (APENAS CARTEIRA)
// =========================================================================
const staticCarteiraStyles = StyleSheet.create({
  // --- Scroll Content ---
  scrollContent: {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingBottom: 40,
    paddingTop: 10,
  },

  // --- Header ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  settingsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },

  // --- Card ATLÂNTICO UNIVERSITARIO+ (Layout Corrigido) ---
  atlanticoCardBase: {
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
    aspectRatio: 1.586,
    justifyContent: 'space-between',
    backfaceVisibility: 'hidden',
    ...Platform.select({ 
      ios: { shadowOpacity: 0.3, shadowRadius: 8, shadowColor: COLORS.dark }, 
      android: { elevation: 8 } 
    }),
  },

  atlanticoCardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 25,
    borderRadius: 15,
    aspectRatio: 1.586,
    justifyContent: 'space-between',
    backfaceVisibility: 'hidden',
  },

  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  bankLogoContainer: {
    alignItems: 'flex-start',
  },

  bankName: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: 2,
  },

  bankSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },

  cardTypeBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },

  cardTypeText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.white,
  },

  // Container para número do cartão COM CHIP
  
  cardNumberWithChipContainer: 
  {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },

  chipContainerHorizontal: {
    marginRight: 20,
  },

  cardNumber: {
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
    color: COLORS.white,
  },

  footerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  cardInfo: {
    flex: 1,
  },

  cardLogoContainer: {
    alignItems: 'flex-end',
  },

  footerLabel: { 
    fontSize: 10, 
    color: 'rgba(255,255,255,0.7)', 
    fontWeight: '500' 
  },

  footerValue: { 
    fontSize: 11, 
    fontWeight: '700', 
    color: COLORS.white, 
    marginTop: 2 
  },

  // Card Back Styles
  magneticStrip: {
    height: 35,
    backgroundColor: COLORS.dark,
    marginVertical: 25,
    borderRadius: 4,
  },

  cvvContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 8,
    borderRadius: 4,
    marginBottom: 20,
  },

  cvvLabel: {
    fontSize: 12,
    color: COLORS.dark,
    fontWeight: '600',
  },

  cvvValue: {
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: '700',
    letterSpacing: 2,
  },

  cardBackText: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // --- Saldo ---
  saldoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  saldoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
    marginLeft: 8,
  },

  saldoLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: COLORS.subText, 
    marginBottom: 5 
  }, 

  saldoActions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 18 
  },

  buttonIconContainer: {
    marginRight: 8,
  },

  recargaButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 14, 
    borderRadius: 12, 
    backgroundColor: COLORS.primary, 
    flex: 1, 
    marginRight: 10,
    justifyContent: 'center',
  },

  recargaButtonText: { 
    color: COLORS.white, 
    fontWeight: '700', 
    fontSize: 14 
  },

  retirarButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 14, 
    borderRadius: 12, 
    backgroundColor: COLORS.warning, 
    flex: 1, 
    marginLeft: 10,
    justifyContent: 'center',
  },

  retirarButtonText: { 
    color: COLORS.dark, 
    fontWeight: '700', 
    fontSize: 14 
  },

  // --- Botão Histórico ---
  historyButtonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },

  historyButtonTextBase: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    marginLeft: 10,
  },

  // --- Adicionar Cartão ---
  sectionBase: { 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 20 
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  addCardTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
  },

  addCardTriggerTextBase: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },

  inputBase: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    ...Platform.select({ web: { outlineWidth: 0 } }),
  },

  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10 
  },

  buttonBase: { 
    flex: 1,
    paddingVertical: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },

  buttonText: { 
    color: COLORS.white, 
    fontWeight: '700', 
    fontSize: 16,
    marginLeft: 8,
  }, 

  // --- Seção de Pagamento ---
  paymentSectionBase: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },

  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  paymentDetails: {
    marginBottom: 20,
  },

  paymentLabel: {
    fontSize: 14,
    color: COLORS.subText,
    fontWeight: '600',
    marginBottom: 4,
  },

  paymentValue: {
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: '500',
    marginBottom: 12,
  },

  paymentAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
  },

  paymentDivider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 12,
  },

  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },

  payButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },

  // --- Grid de Funcionalidades ---
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  featureItemBase: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    width: (width - PADDING_HORIZONTAL * 2 - 20) / 3,
  },

  featureTextBase: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});

// =========================================================================
// ESTILOS DINÂMICOS (APENAS CARTEIRA)
// =========================================================================
export const carteiraStyles = {
  ...staticCarteiraStyles,

  // --- Texto de Boas-vindas ---
  welcomeText: (isDarkMode: boolean) => ({
    fontSize: 14,
    color: isDarkMode ? COLORS.subText : COLORS.gray,
    fontWeight: '500',
    marginTop: 4,
  }),

  // --- Card Atlântico ---
  atlanticoCard: (isDarkMode: boolean) => ({
    ...staticCarteiraStyles.atlanticoCardBase,
    backgroundColor: '#1a4a6d', // Azul escuro do Atlântico
    ...(isDarkMode && { 
      shadowColor: COLORS.primary, 
      shadowOpacity: 0.5, 
      shadowRadius: 10, 
      elevation: 12 
    }),
  }),

  atlanticoCardBack: (isDarkMode: boolean) => ({
    ...staticCarteiraStyles.atlanticoCardBack,
    backgroundColor: '#1a4a6d',
    ...(isDarkMode && { 
      shadowColor: COLORS.primary, 
      shadowOpacity: 0.5, 
      shadowRadius: 10, 
      elevation: 12 
    }),
  }),

  // --- Saldo ---
  saldoCard: (isDarkMode: boolean) => ({
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 20,
    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    ...Platform.select({
      ios: {
        shadowColor: isDarkMode ? '#000' : '#ccc',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  }),

  saldoValue: (isDarkMode: boolean) => ({
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.primary,
    marginVertical: 10,
  }),

  // --- Botão Histórico ---
  historyButton: (isDarkMode: boolean) => ({
    ...staticCarteiraStyles.historyButtonBase,
    backgroundColor: isDarkMode ? COLORS.cardDark : 'transparent',
    borderColor: isDarkMode ? COLORS.subText : COLORS.lightGray,
  }),

  historyButtonText: (isDarkMode: boolean) => ({
    ...staticCarteiraStyles.historyButtonTextBase,
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
  }),

  // --- Adicionar Cartão ---
  section: (isDarkMode: boolean) => ({
    ...staticCarteiraStyles.sectionBase,
    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    ...Platform.select({
      ios: {
        shadowColor: isDarkMode ? '#000' : '#ccc',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  }),

  addCardTrigger: (isDarkMode: boolean) => ({
    ...staticCarteiraStyles.addCardTrigger,
    backgroundColor: isDarkMode ? COLORS.cardDark : 'transparent',
    borderColor: isDarkMode ? COLORS.subText : COLORS.lightGray,
  }),

  addCardTriggerText: (isDarkMode: boolean) => ({
    ...staticCarteiraStyles.addCardTriggerTextBase,
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
  }),

  input: (isDarkMode: boolean) => ({
    ...staticCarteiraStyles.inputBase,
    borderColor: isDarkMode ? COLORS.subText : COLORS.lightGray,
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.white,
  }),

  button: (isDarkMode: boolean) => ({
    ...staticCarteiraStyles.buttonBase,
  }),

  // --- Seção de Pagamento ---
  paymentSection: (isDarkMode: boolean) => ({
    ...staticCarteiraStyles.paymentSectionBase,
    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
    ...Platform.select({
      ios: {
        shadowColor: isDarkMode ? '#000' : '#ccc',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  }),

  // --- Grid de Funcionalidades ---
  featureItem: (isDarkMode: boolean) => ({
    ...staticCarteiraStyles.featureItemBase,
    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    ...Platform.select({
      ios: {
        shadowColor: isDarkMode ? '#000' : '#ccc',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  }),

  featureText: (isDarkMode: boolean) => ({
    ...staticCarteiraStyles.featureTextBase,
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
  }),
};
