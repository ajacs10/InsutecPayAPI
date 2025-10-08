import { StyleSheet, Platform, Dimensions, StatusBar } from 'react-native';

const { width } = Dimensions.get('window');
const PADDING_HORIZONTAL = 18;

// =========================================================================
// PALETA DE CORES
// =========================================================================
export const COLORS = {
  primary: '#16537e', // Azul Marinho Escuro
  textLight: '#E0E0E0', // Texto claro (para fundo escuro)
  darkBackground: '#121212', // Fundo principal escuro
  lightBackground: '#FFFFFF',
  dark: '#1F1F1F',
  white: '#FFFFFF',
  primaryLight: '#72bff8', // Azul claro para destaque
  cardDark: '#1F1F1F', // Fundo de cartões escuro
  cardLight: '#FFFFFF',
  textDark: '#1C1C1C',
  subText: '#888888',
  success: '#39FF14',
  danger: '#FF4500',
  warning: '#FFCC00',
  gray: '#666666',
  ana: '#073763',
  lightGray: '#DDDDDD',
  accent: '#FFD700', // Dourado
  menuBackground: '#2A2A2A',
  menuItemBorder: '#444444',
};

// =========================================================================
// TIPOS
// =========================================================================
export type StyleProps = {
  isDarkMode: boolean;
  width?: number;
};

// =========================================================================
// ESTILOS ESTÁTICOS
// =========================================================================
const staticStyles = StyleSheet.create({
  headerAndroidPadding: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
  },
  logoAndGreetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  logoContainer: {
    marginRight: 8,
    alignItems: 'center',
  },
  headerRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    paddingHorizontal: 8,
  },
  logoImage: {
    width: 35,
    height: 35,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  sidebarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  sidebarFooter: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  navBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 55 : 85,
    right: PADDING_HORIZONTAL,
    width: 200,
    backgroundColor: COLORS.menuBackground,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 100,
  },
  menuItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.menuItemBorder,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    color: COLORS.textLight,
    fontSize: 16,
    marginLeft: 10,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
});

// =========================================================================
// ESTILOS DINÂMICOS
// =========================================================================
export const styles = {
  ...staticStyles,
  safeArea: ({ isDarkMode }: StyleProps) => ({
    flex: 1,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
  }),
  contentContainer: ({ isDarkMode }: StyleProps) => ({
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingBottom: 0,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
  }),
  header: ({ isDarkMode }: StyleProps) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingVertical: 10,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    borderBottomWidth: 0,
    ...staticStyles.headerAndroidPadding, // Apply Android padding
  }),
// NOVO ESTILO 1: Para a Saudação Personalizada no Header
  appGreeting: ({ isDarkMode }: StyleProps) => ({
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    fontSize: 22, // Um pouco maior para se destacar
    fontWeight: 'bold',
    marginBottom: 2,
  }),
// FIM NOVO ESTILO 1
  appTitle: ({ isDarkMode }: StyleProps) => ({
    fontSize: 20,
    fontWeight: '900',
    color: isDarkMode ? COLORS.textLight : COLORS.primary,
  }),
  dateText: ({ isDarkMode }: StyleProps) => ({
    fontSize: 12,
    color: isDarkMode ? COLORS.subText : COLORS.gray,
  }),
  sectionContainer: ({ isDarkMode }: StyleProps) => ({
    marginTop: 25,
    paddingVertical: 1,
  }),
  sectionTitle: ({ isDarkMode }: StyleProps) => ({
    fontSize: 18,
    fontWeight: '800',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 10,
  }),
  saldoContainer: ({ isDarkMode }: StyleProps) => ({
    padding: 20,
    borderRadius: 15,
    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    marginTop: 15,
    borderWidth: 1.1,
    borderColor: isDarkMode ? COLORS.primary + '77' : COLORS.lightGray,
    ...Platform.select({
      ios: {
        shadowColor: isDarkMode ? COLORS.primary : COLORS.gray,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: { elevation: 6 },
    }),
  }),
  paymentSubtitle: ({ isDarkMode }: StyleProps) => ({
    fontSize: 14,
    color: isDarkMode ? COLORS.primaryLight : COLORS.primary,
    fontWeight: '700',
    marginBottom: 5,
  }),
  saldoTitle: ({ isDarkMode }: StyleProps) => ({
    fontSize: 16,
    color: isDarkMode ? COLORS.subText : COLORS.gray,
    fontWeight: '700',
  }),
  saldoValue: ({ isDarkMode }: StyleProps) => ({
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.primaryLight,
    marginVertical: 10,
    textShadowColor: COLORS.ana + '40',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 9,
  }),
  payButton: ({ isDarkMode }: StyleProps) => ({
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
      },
      android: { elevation: 8 },
    }),
  }),
  payButtonText: ({ isDarkMode }: StyleProps) => ({
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
  }),
  serviceListContainer: ({ isDarkMode }: StyleProps) => ({
    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDarkMode ? COLORS.subText + '20' : COLORS.lightGray,
  }),
  serviceListItem: ({ isDarkMode }: StyleProps) => ({
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? COLORS.menuItemBorder : COLORS.lightGray,
    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
  }),
  serviceListIconContainer: ({ isDarkMode }: StyleProps) => ({
    marginRight: 15,
    width: 30,
    alignItems: 'center',
  }),
  serviceListTitle: ({ isDarkMode }: StyleProps) => ({
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
  }),
  bottomNavBar: ({ isDarkMode }: StyleProps) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    borderTopWidth: 1,
    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    borderTopColor: isDarkMode ? COLORS.menuItemBorder : COLORS.lightGray,
  }),
  sidebar: ({ isDarkMode, width }: StyleProps) => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0, // Moved to left side as requested
    width: width || 250,
    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    zIndex: 11,
    shadowColor: isDarkMode ? '#000' : '#ccc',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  }),
// NOVO ESTILO 2: Para o Avatar da Sidebar
  sidebarAvatar: ({ isDarkMode }: StyleProps) => ({
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  }),
// FIM NOVO ESTILO 2
  sidebarHeader: ({ isDarkMode }: StyleProps) => ({
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 42 : 50,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? COLORS.subText + '30' : COLORS.lightGray,
  }),
  sidebarHeaderText: ({ isDarkMode }: StyleProps) => ({
    fontSize: 20,
    fontWeight: '800',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginTop: 12,
  }),
// NOVO ESTILO 3: Para o Texto do Avatar
  sidebarAvatarText: ({ isDarkMode }: StyleProps) => ({
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  }),
// FIM NOVO ESTILO 3
  sidebarHeaderSubtitle: ({ isDarkMode }: StyleProps) => ({
    fontSize: 16,
    color: isDarkMode ? COLORS.subText : COLORS.gray,
  }),
  sidebarText: ({ isDarkMode }: StyleProps) => ({
    fontSize: 16,
    color: isDarkMode ? COLORS.textLight : COLORS.textDark, // Ensured contrast
    marginLeft: 15,
    fontWeight: '600',
  }),
  sidebarItem: ({ isDarkMode }: StyleProps) => ({
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomColor: isDarkMode ? COLORS.dark : COLORS.lightGray,
  }),
  navBarText: ({ isDarkMode }: StyleProps) => ({
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
    color: isDarkMode ? COLORS.textLight : COLORS.gray,
  }),
};
