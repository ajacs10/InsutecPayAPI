import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmall = width < 380;

export const COLORS = {
  primary: '#0b5394',        // Azul Principal
  primaryDark: '#00CC00',    // Verde Acentuação
  secondary: '#00FFFF',      // Ciano/Turquesa
  accent: '#00FFFF',
  lightBackground: '#f8f9fa',
  darkBackground: '#1A1A1A', // Fundo escuro mais suave
  cardBackground: '#252525', // Card escuro com contraste
  textDark: '#333',
  textLight: '#E8E8E8',      // Texto claro mais legível
  text: '#E8E8E8',
  subText: '#AAAAAA',
  white: '#FFFFFF',
  gray: '#666666',
  success: '#00FF00',
  danger: '#FF3333',
  error: '#FF3333',
  warning: '#FFCC00',
};

export type StyleProps = {
  isDarkMode: boolean;
};

const staticStyles = StyleSheet.create({});

export const styles = {
  ...staticStyles,

  fullScreenContainer: ({ isDarkMode }: StyleProps) => ({
    flex: 1,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
  }),

  scrollContainer: ({ isDarkMode }: StyleProps) => ({
    flex: 1,
    width: '100%',
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
  }),

  scrollContentWrapper: ({ isDarkMode }: StyleProps) => ({
    flexGrow: 1,
    width: '100%',
    paddingHorizontal: isSmall ? 12 : 16,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  }),

  profileCard: ({ isDarkMode }: StyleProps) => ({
    backgroundColor: isDarkMode ? COLORS.cardBackground : COLORS.white,
    padding: 24,
    borderRadius: 28,
    width: '92%',
    maxWidth: 420,
    marginTop: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: isDarkMode ? 0.5 : 0.15,
    shadowRadius: 16,
    elevation: Platform.OS === 'android' ? 10 : 0,
    borderWidth: isDarkMode ? 1 : 0,
    borderColor: isDarkMode ? '#333' : 'transparent',
  }),

  avatar: ({ isDarkMode }: StyleProps) => ({
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: isDarkMode ? '#3A3A3A' : '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: isDarkMode ? COLORS.primary : '#CCCCCC',
  }),

  avatarText: ({ isDarkMode }: StyleProps) => ({
    fontSize: 36,
    color: isDarkMode ? COLORS.accent : COLORS.primary,
    fontWeight: 'bold',
  }),

  nameText: ({ isDarkMode }: StyleProps) => ({
    fontSize: 26,
    fontWeight: 'bold',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 6,
    textAlign: 'center',
  }),

  studentNumberText: ({ isDarkMode }: StyleProps) => ({
    fontSize: 17,
    color: isDarkMode ? '#00CC00' : COLORS.primary,
    marginBottom: 20,
    fontWeight: '600',
  }),

  infoBlock: ({ isDarkMode }: StyleProps) => ({
    width: '100%',
    marginTop: 20,
    padding: 18,
    backgroundColor: isDarkMode ? '#2C2C2C' : '#F0F8FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: isDarkMode ? '#3A3A3A' : '#D0E8FF',
  }),

  infoTitle: ({ isDarkMode }: StyleProps) => ({
    fontSize: 18,
    fontWeight: '800',
    color: isDarkMode ? COLORS.primary : COLORS.primaryDark,
    marginBottom: 10,
  }),

  infoDetail: ({ isDarkMode }: StyleProps) => ({
    fontSize: 16,
    color: isDarkMode ? COLORS.text : '#444',
    marginBottom: 6,
    fontWeight: '500',
  }),

  toggleContainer: ({ isDarkMode }: StyleProps) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
    width: '92%',
    maxWidth: 420,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: isDarkMode ? '#2C2C2C' : '#FFFFFF',
    borderWidth: 1,
    borderColor: isDarkMode ? '#3A3A3A' : '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  }),

  toggleLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  label: ({ isDarkMode }: StyleProps) => ({
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
  }),

  statusContainer: ({ isDarkMode }: StyleProps) => ({
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: isDarkMode ? '#2C2C2C' : '#F0FFF0',
    borderWidth: 1,
    borderColor: isDarkMode ? '#3A3A3A' : '#C8E6C9',
  }),

  statusText: ({ isDarkMode }: StyleProps) => ({
    color: isDarkMode ? '#00FF00' : '#006400',
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
  }),
};
