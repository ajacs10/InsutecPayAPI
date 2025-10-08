// styles/_TermosScreen.styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Cores para o Insutec Pay
const COLORS = {
  primary: '#2563eb',
  secondary: '#1e40af',
  white: '#ffffff',
  black: '#000000',
  gray: '#6b7280',
  lightGray: '#f3f4f6',
  darkGray: '#374151',
  lightBackground: '#ffffff',
  darkBackground: '#111827',
  textLight: '#ffffff',
  textDark: '#1f2937',
};

const FONT_SIZES = {
  h1: 28,
  h2: 22,
  h3: 18,
  p: 16,
  small: 14,
  xsmall: 12,
};

// CORREÇÃO: Remover todas as referências a isDarkMode dos estilos estáticos
// e mover apenas para as funções que recebem isDarkMode como parâmetro

export const styles = {
  // Container Principal - CORRIGIDO
  container: (isDarkMode: boolean) => ({
    flex: 1,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
  }),

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  // Header - CORRIGIDO
  header: (isDarkMode: boolean) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  }),

  logoContainer: {
    flex: 1,
  },

  logo: {
    fontSize: FONT_SIZES.h1,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 2,
  },

  subLogo: {
    fontSize: FONT_SIZES.small,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
  },

  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  badgeText: {
    fontSize: FONT_SIZES.xsmall,
    fontWeight: '600',
    color: COLORS.white,
  },

  // Card de Introdução - CORRIGIDO
  introCard: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : COLORS.white,
    margin: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  }),

  introTitle: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.h2,
    fontWeight: '700',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 12,
  }),

  introText: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.p,
    lineHeight: 24,
    color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
    marginBottom: 16,
  }),

  updateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },

  updateLabel: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.small,
    color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
    fontWeight: '500',
  }),

  updateDate: {
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Container das Seções
  sectionsContainer: {
    paddingHorizontal: 20,
  },

  sectionsTitle: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.h3,
    fontWeight: '700',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 20,
    textAlign: 'center',
  }),

  // Seções Individuais - CORRIGIDO
  sectionContainer: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },

  sectionHeader: (isDarkMode: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  }),

  sectionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  sectionNumberText: {
    fontSize: FONT_SIZES.small,
    fontWeight: '700',
    color: COLORS.white,
  },

  sectionTitle: (isDarkMode: boolean) => ({
    flex: 1,
    fontSize: FONT_SIZES.p,
    fontWeight: '600',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
  }),

  sectionArrow: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  // CORREÇÃO CRÍTICA: sectionContent não deve depender de isDarkMode
  // pois é usado dentro de um componente Animated que não recebe a prop
  sectionContent: {
    backgroundColor: 'rgba(0,0,0,0.02)', // Cor fixa para light mode como fallback
    overflow: 'hidden',
  },

  // Função alternativa se precisar de background dinâmico
  sectionContentDynamic: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    overflow: 'hidden',
  }),

  sectionText: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.p,
    lineHeight: 24,
    color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
    padding: 20,
  }),

  // Card de Contacto - CORRIGIDO
  contactCard: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : COLORS.white,
    margin: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  }),

  contactTitle: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.h3,
    fontWeight: '700',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 20,
    textAlign: 'center',
  }),

  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },

  contactIcon: {
    fontSize: 20,
    marginRight: 16,
    marginTop: 2,
  },

  contactInfo: {
    flex: 1,
  },

  contactLabel: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
    color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
    marginBottom: 4,
  }),

  contactValue: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.p,
    fontWeight: '500',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 2,
  }),

  contactButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },

  contactButtonText: {
    fontSize: FONT_SIZES.p,
    fontWeight: '600',
    color: COLORS.white,
  },

  // Footer - CORRIGIDO
  footer: (isDarkMode: boolean) => ({
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    marginTop: 20,
  }),

  footerText: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 4,
  }),

  footerSubText: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.xsmall,
    color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
    marginBottom: 16,
    textAlign: 'center',
  }),

  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  footerLink: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.xsmall,
    color: isDarkMode ? COLORS.primary : COLORS.primary,
    fontWeight: '500',
  }),

  footerSeparator: {
    fontSize: FONT_SIZES.xsmall,
    color: 'rgba(0,0,0,0.3)',
    marginHorizontal: 8,
  },
};
