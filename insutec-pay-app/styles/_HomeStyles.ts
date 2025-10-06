
import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const PADDING_HORIZONTAL = 16;
const GRID_MARGIN = 10;
const CARD_WIDTH_3_COL = (width - PADDING_HORIZONTAL * 2 - GRID_MARGIN * 2) / 3;

// =========================================================================
// PALETA DE CORES
// =========================================================================
export const COLORS = {
  primary: '#72bff8',
  primaryDark: '#0b5394',
  darkBackground: '#0F0F0F',
  lightBackground: '#f5f9ff',
  cardDark: '#1F1F1F',
  cardLight: '#f3f6f4',
  textDark: '#1C1C1C',
  textLight: '#E0E0E0',
  subText: '#888888',
  success: '#39FF14',
  danger: '#FF4500',
  warning: '#FFCC00',
  white: '#FFFFFF',
  gray: '#666666',
  ana: '#073763',
  lightGray: '#BBBBBB',
};

// =========================================================================
// ESTILOS ESTÁTICOS
// =========================================================================
const staticStyles = StyleSheet.create({
  logoAndGreetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 2,
  },
  logoContainer: {
    marginRight: 39,
    alignItems: 'center',
  },
  headerRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    paddingHorizontal: 5,
  },
  logoImage: {
    paddingVertical: 55,
    width: 80,
    height: 60,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  dividaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightServicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  quickAccessScrollContainer: {
    flexDirection: 'row',
    gap: GRID_MARGIN,
    paddingVertical: 1,
    paddingHorizontal: 5,
  },
  sidebarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Ajustado para maior visibilidade
    zIndex: 10,
  },
  sidebarFooter: {
    marginTop: 'auto',
    paddingTop: 1,
  },
  sidebarItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
  },
});

// =========================================================================
// ESTILOS DINÂMICOS
// =========================================================================
export const styles = {
  ...staticStyles,
  safeArea: (isDarkMode: boolean) => ({
    flex: 1,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
  }),
  contentContainer: (isDarkMode: boolean) => ({
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingBottom: 60,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
  }),
  header: (isDarkMode: boolean) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingVertical: 10,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.cardLight,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? COLORS.cardDark : COLORS.lightGray,
  }),
  greetingText: (isDarkMode: boolean) => ({
    fontSize: 18,
    fontWeight: 'bold',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
  }),
  sectionContainer: (isDarkMode: boolean) => ({
    marginTop: 25,
    paddingVertical: 1,
  }),
  sectionTitle: (isDarkMode: boolean) => ({
    fontSize: 19,
    fontWeight: '800',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 14,
    paddingHorizontal: 4,
  }),
  saldoContainer: (isDarkMode: boolean) => ({
    padding: 16,
    borderRadius: 25,
    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    marginTop: 15,
    borderWidth: 1.1,
    borderColor: isDarkMode ? COLORS.primary + '55' : COLORS.lightGray,
    ...Platform.select({
      ios: { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 6 },
      android: { elevation: 6 },
    }),
  }),
  saldoTitle: (isDarkMode: boolean) => ({
    fontSize: 17,
    color: isDarkMode ? COLORS.subText : COLORS.gray,
    fontWeight: '700',
  }),
  saldoValue: (isDarkMode: boolean) => ({
    fontSize: 25,
    fontWeight: '900',
    color: COLORS.primary,
    marginVertical: 10,
    textShadowColor: COLORS.ana + '40',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 9,
  }),
  payButton: (isDarkMode: boolean) => ({
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  }),
  payButtonText: (isDarkMode: boolean) => ({
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.darkBackground,
  }),
  card: (isDarkMode: boolean) => ({
    width: CARD_WIDTH_3_COL,
    marginBottom: GRID_MARGIN,
    padding: 9,
    borderRadius: 9,
    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: isDarkMode ? COLORS.subText + '20' : COLORS.lightGray,
    ...Platform.select({ ios: { shadowOpacity: 0.05 }, android: { elevation: 2 } }),
  }),
  cardIconContainer: (isDarkMode: boolean) => ({
    width: 55,
    height: 37,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  }),
  cardTitle: (isDarkMode: boolean) => ({
    fontSize: 14,
    fontWeight: '800',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    textAlign: 'center',
  }),
  cardSubtitle: (isDarkMode: boolean) => ({
    display: 'none',
  }),
  quickAccessCard: (isDarkMode: boolean) => ({
    width: 100,
    height: 90,
    padding: 15,
    borderRadius: 11,
    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary + '90',
    ...Platform.select({ ios: { shadowOpacity: 0.05 }, android: { elevation: 2 } }),
  }),
  quickAccessText: (isDarkMode: boolean) => ({
    fontSize: 14,
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginTop: 9,
    fontWeight: '800',
    textAlign: 'center',
  }),
  sidebar: (isDarkMode: boolean, width: number) => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: width,
    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    zIndex: 11,
  }),
  sidebarHeader: (isDarkMode: boolean) => ({
    padding: 7,
    paddingTop: Platform.OS === 'android' ? 42 : 50,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    borderBottomWidth: 0.4,
    borderBottomColor: isDarkMode ? COLORS.subText : COLORS.lightGray,
  }),
  sidebarHeaderText: (isDarkMode: boolean) => ({
    fontSize: 20,
    fontWeight: '800',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginTop: 12,
  }),
  sidebarHeaderSubtitle: (isDarkMode: boolean) => ({
    fontSize: 16,
    color: isDarkMode ? COLORS.subText : COLORS.gray,
  }),
  sidebarText: (isDarkMode: boolean) => ({
    fontSize: 15,
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginLeft: 8,
    fontWeight: '800',
  }),
  sidebarItem: (isDarkMode: boolean) => ({
    ...staticStyles.sidebarItemContainer,
    borderBottomColor: isDarkMode ? COLORS.cardDark : COLORS.lightGray,
  }),
};
