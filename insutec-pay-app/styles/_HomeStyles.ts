import { StyleSheet, Platform } from 'react-native';

// Paleta de cores local (ajustada para o tema neon)
const COLORS = {
  primary: '#00FF00', // Neon green
  lightBackground: '#f8f9fa',
  darkBackground: '#2E2E2E',
  textDark: '#333',
  textLight: '#fff',
  primaryDark: '#00CC00',
  accent: '#00FFFF',
  cardBackground: '#3A3A3A',
  success: '#00FF00',
  danger: '#FF3333',
  warning: '#FFCC00',
  secondary: '#00FFFF',
  text: '#E0E0E0',
  subText: '#AAAAAA',
  white: '#FFFFFF',
  gray: '#666666',
};

export const styles = StyleSheet.create({
  safeArea: (isDarkMode: boolean) => ({
    flex: 1,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
  }),
  header: (isDarkMode: boolean) => ({
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    backgroundColor: isDarkMode ? COLORS.cardBackground : COLORS.lightBackground,
  }),
  contentContainer: (isDarkMode: boolean) => ({
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
  }),
  sectionContainer: (isDarkMode: boolean) => ({
    padding: 12,
    backgroundColor: isDarkMode ? COLORS.cardBackground : '#FFFFFF',
  }),
  card: (isDarkMode: boolean) => ({
    padding: 12,
    borderRadius: 8,
    backgroundColor: isDarkMode ? '#454545' : '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: Platform.OS === 'android' ? 2 : 0,
  }),
  cardSuccess: (isDarkMode: boolean) => ({
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  }),
  cardHeader: (isDarkMode: boolean) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  }),
  cardTitle: (isDarkMode: boolean) => ({
    fontSize: 16,
    fontWeight: 'bold',
    color: isDarkMode ? COLORS.text : COLORS.textDark,
  }),
  totalPendencyValue: (isDarkMode: boolean) => ({
    fontSize: 20,
    fontWeight: 'bold',
    color: isDarkMode ? COLORS.text : COLORS.textDark,
  }),
  cardSubtitle: (isDarkMode: boolean) => ({
    fontSize: 12,
    color: isDarkMode ? COLORS.subText : COLORS.textDark,
  }),
  cardDetailSmall: (isDarkMode: boolean) => ({
    fontSize: 12,
    color: isDarkMode ? COLORS.subText : COLORS.textDark,
  }),
  payButton: (isDarkMode: boolean) => ({
    paddingVertical: 8,
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: isDarkMode ? COLORS.primaryDark : COLORS.primary,
    opacity: 0.5,
  }),
  payButtonText: (isDarkMode: boolean) => ({
    color: COLORS.white,
    fontSize: 14,
    textAlign: 'center',
  }),
  listItem: (isDarkMode: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: isDarkMode ? COLORS.cardBackground : '#FFFFFF',
  }),
  listItemIconContainer: (isDarkMode: boolean) => ({
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  listItemTextContainer: (isDarkMode: boolean) => ({
    flex: 1,
    marginLeft: 10,
  }),
  listItemTitle: (isDarkMode: boolean) => ({
    fontSize: 12,
    color: isDarkMode ? COLORS.text : COLORS.textDark,
  }),
  listItemSubtitle: (isDarkMode: boolean) => ({
    fontSize: 10,
    color: isDarkMode ? COLORS.subText : COLORS.textDark,
  }),
  listItemValueContainer: (isDarkMode: boolean) => ({
    marginLeft: 10,
  }),
  listItemValue: (isDarkMode: boolean) => ({
    fontSize: 12,
    color: isDarkMode ? COLORS.text : COLORS.textDark,
  }),
  viewAllButton: (isDarkMode: boolean) => ({
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: isDarkMode ? COLORS.primaryDark : COLORS.primary,
  }),
  viewAllText: (isDarkMode: boolean) => ({
    color: COLORS.white,
    fontSize: 14,
    textAlign: 'center',
  }),
  logoutButton: (isDarkMode: boolean) => ({
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: isDarkMode ? COLORS.danger : '#FF6666',
    alignItems: 'center',
  }),
  logoutText: (isDarkMode: boolean) => ({
    color: COLORS.white,
    fontSize: 14,
  }),
  fab: (isDarkMode: boolean) => ({
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: isDarkMode ? COLORS.primaryDark : COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  }),
  fabIcon: (isDarkMode: boolean) => ({
    color: COLORS.white,
    fontSize: 24,
  }),
  // Add other styles as needed based on HomeScreen usage
  accessList: (isDarkMode: boolean) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  }),
  sectionTitle: (isDarkMode: boolean) => ({
    fontSize: 18,
    marginBottom: 8,
    color: isDarkMode ? COLORS.text : COLORS.textDark,
  }),
});
