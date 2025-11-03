import { StyleSheet, Platform, Dimensions } from 'react-native'
import { useSafeAreaInsets, EdgeInsets } from 'react-native-safe-area-context'

const WINDOW_HEIGHT = Dimensions.get('window').height
const ESTIMATED_HEADER_HEIGHT = 80

export const COLORS = {
  primary: '#16537e',
  textLight: '#E0E0E0',
  darkBackground: '#121212',
  lightBackground: '#FFFFFF',
  dark: '#1F1F1F',
  white: '#FFFFFF',
  primaryLight: '#72bff8',
  cardDark: '#1F1F1F',
  cardLight: '#FFFFFF',
  textDark: '#1C1C1C',
  subText: '#888888',
  success: '#39FF14',
  danger: '#FF4500',
  warning: '#FFCC00',
  gray: '#666666',
  ana: '#073763',
  lightGray: '#DDDDDD',
  accent: '#FFD700',
  menuBackground: '#2A2A2A',
  menuItemBorder: '#444444',
}

export type StyleProps = {
  isDarkMode: boolean
  insets?: EdgeInsets
  width?: number
}

const staticStyles = StyleSheet.create({
  headerWithZIndex: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 11,
  },
  logoAndGreetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  logoContainer: {
    marginRight: 10,
    alignItems: 'center',
    paddingTop: 10,
  },
  headerRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  headerButton: {
    paddingHorizontal: 0,
    marginLeft: 15,
  },
  logoImage: {
    width: 100,
    height: 70,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  sidebarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  sidebarFooter: {
    marginTop: 10,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  navBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 6,
  },
  greetingTextWrapper: {
    flexShrink: 1,
  },
})

export const styles = {
  ...staticStyles,

  safeArea: ({ isDarkMode }: StyleProps) => ({
    flex: 1,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
  }),

  mainScrollView: ({ isDarkMode, insets }: StyleProps) => ({
    flex: 1,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    paddingTop: ESTIMATED_HEADER_HEIGHT + (insets?.top || 0),
  }),

  contentContainer: ({ isDarkMode, insets }: StyleProps) => ({
    paddingHorizontal: 20,
    paddingBottom: 100, // Ajustado no HomeScreen para incluir a Nav Bar + insets
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
  }),

  header: ({ isDarkMode, insets }: StyleProps) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: insets?.top || 0,
    paddingBottom: 12,
    backgroundColor: isDarkMode ? COLORS.dark : COLORS.white,
    // Removendo borderBottomWidth para evitar que corte o arredondamento e usando sombra/elevação para separação
    borderBottomWidth: 0, 
    
    // --- CORREÇÃO: ARREDONDAMENTO DE CANTOS ---
    // Arredonda os cantos inferiores para destacar a separação do conteúdo (visual moderno)
    borderBottomLeftRadius: 50, 
    borderBottomRightRadius: 50,
    
    // Adiciona sombra/elevação para simular a borda
    ...Platform.select({
      ios: { 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 4 
      },
      android: { 
        elevation: 8 
      },
    }),
  }),

  appGreeting: ({ isDarkMode }: StyleProps) => ({
    fontSize: 18,
    fontWeight: '700',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
  }),

  dateText: ({ isDarkMode }: StyleProps) => ({
    fontSize: 12,
    color: isDarkMode ? COLORS.subText : COLORS.gray,
    marginTop: 2,
  }),

  saldoContainer: ({ isDarkMode }: StyleProps) => ({
    marginTop: 30,
    padding: 20,
    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    borderRadius: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 },
      android: { elevation: 8 },
    }),
  }),

  paymentSubtitle: ({ isDarkMode }: StyleProps) => ({
    fontSize: 14,
    color: isDarkMode ? COLORS.subText : COLORS.gray,
    textAlign: 'center',
    marginBottom: 8,
  }),

  saldoTitle: ({ isDarkMode }: StyleProps) => ({
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
  }),

  saldoValue: ({ isDarkMode }: StyleProps) => ({
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primaryLight,
    marginVertical: 12,
    textAlign: 'center',
  }),

  payButton: ({ isDarkMode }: StyleProps) => ({
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  }),

  payButtonText: () => ({
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  }),

  sectionContainer: () => ({
    marginTop: 32,
  }),

  sectionTitle: ({ isDarkMode }: StyleProps) => ({
    fontSize: 20,
    fontWeight: '700',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 16,
    textAlign: 'center',
  }),

  serviceListContainer: ({ isDarkMode }: StyleProps) => ({
    alignSelf: 'center',
    width: '100%',
    maxWidth: 500,
    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    borderRadius: 20,
    marginVertical: 10,
  }),

  bottomNavBar: ({ isDarkMode, insets }: StyleProps) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: isDarkMode ? COLORS.dark : COLORS.white,
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? COLORS.menuItemBorder : COLORS.lightGray,
    paddingHorizontal: 10,
    zIndex: 100,
    elevation: 20,
    
    paddingTop: 4, 
    paddingBottom: insets?.bottom || 0, 
}),

  navBarText: ({ isDarkMode }: StyleProps) => ({
    fontSize: 11,
    marginTop: 4,
    color: isDarkMode ? COLORS.textLight : COLORS.gray,
    fontWeight: '600',
  }),

sidebar: ({ isDarkMode, width, insets }: StyleProps) => ({
  position: 'absolute',
  left: 0,
  width: width || 300,
  backgroundColor: isDarkMode ? COLORS.menuBackground : COLORS.white,
  zIndex: 12,
  borderRightWidth: 1,
  borderRightColor: COLORS.menuItemBorder,

  // POSIÇÃO: ABAIXO DO HEADER
  top: 100 + (insets?.top || 0),

  // ALTURA REDUZIDA: 70% da tela
  height: 851 * 0.6,

  // CANTOS ARREDONDADOS SÓ EM CIMA
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  borderBottomLeftRadius: 30,
  borderBottomRightRadius: 30,

  // Sombra suave para destacar
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
    },
    android: {
      elevation: 16,
    },
  }),

  // Garante que o conteúdo não vaze pelos cantos
  overflow: 'hidden',
}),

  sidebarHeader: ({ isDarkMode, insets }: StyleProps) => ({
    padding: 20,
    paddingTop: (insets?.top || 0) + 10,
    backgroundColor: isDarkMode ? COLORS.dark : COLORS.lightGray + '20',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.menuItemBorder,
  }),

  sidebarAvatar: ({ isDarkMode }: StyleProps) => ({
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  }),

  sidebarAvatarText: ({ isDarkMode }: StyleProps) => ({
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '700',
  }),

  sidebarHeaderText: ({ isDarkMode }: StyleProps) => ({
    fontSize: 18,
    fontWeight: '700',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    textAlign: 'center',
  }),

  sidebarHeaderSubtitle: ({ isDarkMode }: StyleProps) => ({
    fontSize: 14,
    color: COLORS.primaryLight,
    textAlign: 'center',
    marginTop: 4,
  }),

  sidebarItem: ({ isDarkMode }: StyleProps) => ({
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.menuItemBorder,
  }),

  sidebarText: ({ isDarkMode }: StyleProps) => ({
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    fontWeight: '600',
  }),
}
