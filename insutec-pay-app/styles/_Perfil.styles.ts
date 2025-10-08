import { StyleSheet, Platform, Dimensions } from 'react-native';

export const COLORS = {
  primary: '#0b5394', // Azul Principal
  primaryDark: '#00CC00', // Verde Acentuação
  secondary: '#00FFFF', // Ciano/Turquesa
  accent: '#00FFFF',
  lightBackground: '#f8f9fa',
  darkBackground: '#1F1F1F', // Deeper dark for better contrast
  cardBackground: '#2A2A2A', // Darker card background
  textDark: '#333',
  textLight: '#E0E0E0', // Brighter text for dark mode
  text: '#E0E0E0',
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

const staticStyles = StyleSheet.create({
  // No static styles for scrollContentWrapper anymore
});

export const styles = {
  ...staticStyles,
  fullScreenContainer: ({ isDarkMode }: StyleProps) => ({
    flex: 1,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
  }),
  container: ({ isDarkMode }: StyleProps) => ({
    flex: 1,
    padding: 10,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  scrollContainer: ({ isDarkMode }: StyleProps) => ({
    flex: 1,
    width: '100%',
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
  }),
  scrollContentWrapper: ({ isDarkMode }: StyleProps) => ({
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent', // Ensure parent background is visible
  }),
  profileCard: ({ isDarkMode }: StyleProps) => ({
    backgroundColor: isDarkMode ? COLORS.cardBackground : COLORS.white,
    padding: 20,
    borderRadius: 20,
    width: '90%',
    marginTop: 60,
    alignItems: 'center',
    shadowColor: isDarkMode ? COLORS.darkBackground : '#6fa8dc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: Platform.OS === 'android' ? 4 : 0,
  }),
  avatar: ({ isDarkMode }: StyleProps) => ({
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: isDarkMode ? '#454545' : '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: isDarkMode ? COLORS.gray : '#CCCCCC',
  }),
  avatarText: ({ isDarkMode }: StyleProps) => ({
    fontSize: 32,
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    fontWeight: 'bold',
  }),
  nameText: ({ isDarkMode }: StyleProps) => ({
    fontSize: 24,
    fontWeight: 'bold',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 6,
  }),
  studentNumberText: ({ isDarkMode }: StyleProps) => ({
    fontSize: 17,
    color: isDarkMode ? COLORS.subText : COLORS.gray,
    marginBottom: 18,
  }),
  infoBlock: ({ isDarkMode }: StyleProps) => ({
    width: '100%',
    marginTop: 15,
    padding: 15,
    backgroundColor: isDarkMode ? COLORS.darkBackground : '#d2caca',
    borderRadius: 10,
    borderWidth: isDarkMode ? 1 : 0,
    borderColor: isDarkMode ? COLORS.gray : 'transparent',
  }),
  infoTitle: ({ isDarkMode }: StyleProps) => ({
    fontSize: 18,
    fontWeight: '800',
    color: isDarkMode ? COLORS.primary : COLORS.primaryDark,
    marginBottom: 8,
  }),
  infoDetail: ({ isDarkMode }: StyleProps) => ({
    fontSize: 16,
    color: isDarkMode ? COLORS.text : COLORS.textDark,
    marginBottom: 5,
  }),
  toggleContainer: ({ isDarkMode }: StyleProps) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    width: '90%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: isDarkMode ? COLORS.cardBackground : COLORS.lightBackground,
    shadowColor: isDarkMode ? COLORS.darkBackground : '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: Platform.OS === 'android' ? 2 : 0,
  }),
  toggleLabelContainer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  label: ({ isDarkMode }: StyleProps) => ({
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
  }),
  logoutButton: ({ isDarkMode }: StyleProps) => ({
    backgroundColor: COLORS.danger,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    width: '70%',
    alignItems: 'center',
    marginTop: 30,
    shadowColor: isDarkMode ? COLORS.danger : '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: Platform.OS === 'android' ? 6 : 0,
  }),
  logoutButtonText: ({ isDarkMode }: StyleProps) => ({
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  }),
  errorText: ({ isDarkMode }: StyleProps) => ({
    color: COLORS.error,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  }),
  linkButton: ({ isDarkMode }: StyleProps) => ({
    marginTop: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: isDarkMode ? COLORS.cardBackground : COLORS.lightBackground,
  }),
  linkText: ({ isDarkMode }: StyleProps) => ({
    color: COLORS.primary,
    fontSize: 16,
    textAlign: 'center',
  }),
  statusContainer: ({ isDarkMode }: StyleProps) => ({
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: isDarkMode ? COLORS.cardBackground : '#f0f0f0',
  }),
  statusText: ({ isDarkMode }: StyleProps) => ({
    color: isDarkMode ? COLORS.subText : COLORS.gray,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
  }),
};
