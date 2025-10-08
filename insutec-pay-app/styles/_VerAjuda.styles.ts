// styles/_VerAjuda.styles.ts
import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/Colors';

const { width } = Dimensions.get('window');

const FONT_SIZES = {
  h1: 32,
  h2: 20,
  h3: 18,
  p: 16,
  small: 14,
};

export const styles = {
  // Container Principal
  container: (isDarkMode: boolean) => ({
    flex: 1,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
  }),

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 140,
    paddingBottom: 30,
  },

  // Header Animado
  headerContainer: (isDarkMode: boolean) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 10,
    backgroundColor: isDarkMode ? COLORS.primary : '#667eea',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  }),

  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },

  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },

  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  headerIconText: {
    fontSize: 28,
  },

  headerTextContainer: {
    flex: 1,
  },

  headerTitle: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.h1,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 4,
  }),

  headerSubtitle: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.p,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
  }),

  headerDecoration: {
    flexDirection: 'row',
  },

  decorationCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginLeft: 4,
  },

  // Barra de Pesquisa
  searchContainer: (isDarkMode: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 24,
  }),

  searchIcon: {
    marginRight: 12,
  },

  searchIconText: {
    fontSize: 18,
    opacity: 0.6,
  },

  searchInput: (isDarkMode: boolean) => ({
    flex: 1,
    fontSize: FONT_SIZES.p,
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    opacity: 0.7,
  }),

  // Ações Rápidas
  quickActionsContainer: {
    marginBottom: 24,
  },

  quickActionsTitle: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.h3,
    fontWeight: '700',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 16,
  }),

  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  quickActionButton: (isDarkMode: boolean) => ({
    alignItems: 'center',
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    padding: 16,
    borderRadius: 16,
    width: (width - 80) / 3,
  }),

  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },

  quickActionLabel: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
  }),

  // Seletor de Seções
  sectionSelectorContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },

  sectionSelectorButton: (isActive: boolean, isDarkMode: boolean) => ({
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: isActive ? COLORS.primary : 'transparent',
  }),

  sectionSelectorText: (isActive: boolean, isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.p,
    fontWeight: '600',
    color: isActive ? COLORS.white : (isDarkMode ? COLORS.textLight : COLORS.textDark),
  }),

  // Seções de Conteúdo
  sectionContainer: {
    marginBottom: 24,
  },

  sectionTitle: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.h3,
    fontWeight: '700',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 16,
    marginLeft: 8,
  }),

  // Itens de Ajuda
  helpItemContainer: (isDarkMode: boolean, gradient?: string[]) => ({
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    backgroundColor: gradient ? 'transparent' : (isDarkMode ? 'rgba(255,255,255,0.1)' : COLORS.white),
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: gradient ? 2 : 0,
    borderColor: gradient ? `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` : 'transparent',
  }),

  helpItemIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  helpItemIcon: {
    fontSize: 22,
  },

  helpItemTextContainer: {
    flex: 1,
  },

  helpItemText: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.p,
    fontWeight: '600',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 4,
  }),

  helpItemSubtitle: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.small,
    color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
    fontWeight: '500',
  }),

  helpItemArrowContainer: {
    marginLeft: 12,
  },

  helpItemArrowCircle: (isDarkMode: boolean) => ({
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  helpItemArrow: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  // Espaçamento
  bottomSpacer: {
    height: 30,
  },
};
