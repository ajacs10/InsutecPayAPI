import { StyleSheet, Platform, Dimensions } from 'react-native';
import { COLORS } from './_SharedFinance.styles';

const { width } = Dimensions.get('window');
// AJUSTE 1: PADDING_HORIZONTAL definido para 15 para um layout equilibrado
const PADDING_HORIZONTAL = 10;

// =APOIO AO CÁLCULO DE ESPAÇAMENTO DO CARTÃO ABSOLUTO=
const CARD_ASPECT_RATIO = 1.186;
// Valor de marginBottom do atlanticoCardBase que deve ser compensado.
const CARD_MARGIN_BOTTOM = 23;
// Largura real que o cartão ocupa (Largura total - padding horizontal)
const AVAILABLE_WIDTH = width - PADDING_HORIZONTAL * 2;
// Altura do cartão calculada: (Largura / AspectRatio) + MarginBottom
const CARD_SPACER_HEIGHT = (AVAILABLE_WIDTH / CARD_ASPECT_RATIO) + CARD_MARGIN_BOTTOM;
// ====================================================

// =========================================================================
// ESTILOS ESTÁTICOS PUROS (APENAS CARTEIRA)
// =========================================================================
const staticCarteiraStyles = StyleSheet.create({
  // --- Scroll Content ---
  scrollContent: 
  {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingBottom: 50,
    paddingTop: 2,
  },

  // --- Header ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  settingsButton: {
    padding: 5,
    borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },

  // NOVO ESTILO: Wrapper para garantir que o absolute não quebre o layout
  cardWrapper: {
    // Este wrapper deve ter a altura do spacer para que o conteúdo seguinte
    // (saldoCard) comece no local correto.
    // Se você estiver usando um componente View simples, a altura não é necessária aqui,
    // mas o cardSpacer abaixo é OBRIGATÓRIO para o layout fluir corretamente.
  },

  // CORRIGIDO: Agora absolute e com dimensões alinhadas ao verso
  atlanticoCardBase: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 25,
    borderRadius: 16,
    marginBottom: CARD_MARGIN_BOTTOM,
    aspectRatio: CARD_ASPECT_RATIO,
    justifyContent: 'space-between',
    backfaceVisibility: 'hidden',
    ...Platform.select({ 
      ios: { shadowOpacity: 0.5, shadowRadius: 7, shadowColor: COLORS.dark }, 
      android: { elevation: 9} 
    }),
  },

  // CORRIGIDO: Alinhado e também absolute
  atlanticoCardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 25,
    borderRadius: 16, // Alinhado com a frente
    aspectRatio: CARD_ASPECT_RATIO, // Alinhado com a frente
    justifyContent: 'space-between',
    backfaceVisibility: 'hidden',
  },

  // NOVO ESTILO: Espaçador para empurrar o saldo para baixo
  cardSpacer: {
    height: CARD_SPACER_HEIGHT, // Altura calculada: Card Height + MarginBottom
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
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: 10,
  },

  bankSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 6,
  },

  cardTypeBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 17,
    alignSelf: 'flex-start',
  },

  cardTypeText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '800',
    color: COLORS.white,
  },

  // Container para número do cartão COM CHIP
  
  cardNumberWithChipContainer: 
  {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 0,
  },

  chipContainerHorizontal: {
    marginRight: 10,
  },

  cardNumber: {
    fontSize: 18,
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
    flex: 2,
  },

  cardLogoContainer: {
    alignItems: 'flex-end',
  },

  footerLabel: { 
    fontSize: 13, 
    color: 'rgba(255,255,255,0.7)', 
    fontWeight: '700' 
  },

  footerValue: { 
    fontSize: 11, 
    fontWeight: '700', 
    color: COLORS.white, 
    marginTop: 2.5 
  },

  // Card Back Styles
  magneticStrip: 
  {
    height: 25,
    backgroundColor: COLORS.dark,
    marginVertical: 25,
    borderRadius: 7,
  },

  cvvContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 9,
    borderRadius: 7,
    marginBottom: 22,
  },

  cvvLabel: {
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: '600',
  },

  cvvValue: {
    fontSize: 16,
    color: COLORS.dark,
    fontWeight: '800',
    letterSpacing: 2,
  },

  cardBackText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // --- Saldo ---
  saldoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },

  saldoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
    marginLeft: 0,
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
    marginRight: 7,
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
    paddingVertical: 10, 
    borderRadius: 10, 
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
    padding: 10,
    borderRadius: 17,
    marginBottom: 6,
  },

  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  paymentDetails: {
    marginBottom: 20,
  },

  paymentLabel: 
  {
    fontSize: 18,
    color: COLORS.subText,
    fontWeight: '500',
    marginBottom: 5,
  },

  paymentValue: {
    fontSize: 16,
    color: '#f3f6f4' ,
    fontWeight: '500',
    marginBottom: 12,
  },

  paymentAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },

  paymentDivider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 6,
  },

  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
  },

  payButtonText: {
    color: COLORS.white,
    fontWeight: '800',
     justifyContent: 'center',
    fontSize: 12,
    marginLeft: 8,
  },

  // --- Grid de Funcionalidades ---
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },

  featureItemBase: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    // O cálculo da largura dos itens da grid usa o PADDING_HORIZONTAL atualizado
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
    // Padding do saldoCard é 20, agora igual ao atlanticoCardBase
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 17,
    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.primary,
    ...Platform.select({
      ios: {
        shadowColor: isDarkMode ? '#000' : '#ccc',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  }),

  saldoValue: (isDarkMode: boolean) => ({
    fontSize: 16,
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
    borderLeftWidth: 8,
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

