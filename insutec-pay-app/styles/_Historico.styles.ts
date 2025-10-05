import { StyleSheet, Platform } from 'react-native';

export const COLORS = {
  primary: '#00FF00', // Neon green
  primaryDark: '#00CC00', // Darker neon green
  accent: '#00FFFF', // Neon cyan
  darkBackground: '#2E2E2E', // Cinza escuro para dark mode
  lightBackground: '#F5F5F5', // Branco acinzentado para light mode
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
    backgroundColor: isDarkMode ? COLORS.cardBackground : '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  }),
  headerText: (isDarkMode: boolean) => ({
    color: isDarkMode ? COLORS.text : COLORS.text,
    fontSize: 16,
  }),
  contentContainer: (isDarkMode: boolean) => ({
    paddingHorizontal: 16,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
  }),
  card: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? '#3A3A3A' : '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
    fontWeight: '600',
    color: isDarkMode ? COLORS.text : '#333333',
  }),
  totalPendencyValue: (isDarkMode: boolean) => ({
    fontSize: 24,
    fontWeight: 'bold',
    color: isDarkMode ? COLORS.text : '#333333',
    textAlign: 'center',
  }),
  cardSubtitle: (isDarkMode: boolean) => ({
    color: isDarkMode ? COLORS.subText : '#666666',
    textAlign: 'center',
  }),
  cardDetailSmall: (isDarkMode: boolean) => ({
    color: isDarkMode ? COLORS.subText : '#666666',
    textAlign: 'center',
  }),
  payButton: (isDarkMode: boolean) => ({
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
  }),
  payButtonText: (isDarkMode: boolean) => ({
    color: COLORS.white,
    fontWeight: '600',
  }),
  sectionContainer: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? '#2E2E2E' : '#F0F0F0',
    borderRadius: 8,
    marginBottom: 16,
  }),
  sectionTitle: (isDarkMode: boolean) => ({
    fontSize: 18,
    fontWeight: '600',
    color: isDarkMode ? COLORS.text : '#333333',
  }),
  accessList: (isDarkMode: boolean) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
  }),
  listItem: (isDarkMode: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#3A3A3A' : '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    padding: 8,
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
    marginLeft: 12,
  }),
  listItemTitle: (isDarkMode: boolean) => ({
    fontSize: 14,
    color: isDarkMode ? COLORS.text : '#333333',
  }),
  listItemSubtitle: (isDarkMode: boolean) => ({
    fontSize: 12,
    color: isDarkMode ? COLORS.subText : '#666666',
  }),
  listItemValueContainer: (isDarkMode: boolean) => ({
    alignItems: 'flex-end',
  }),
  listItemValue: (isDarkMode: boolean) => ({
    fontSize: 14,
    fontWeight: '600',
  }),
  viewAllButton: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? '#454545' : '#E0E0E0',
    borderRadius: 8,
    alignItems: 'center',
  }),
  viewAllText: (isDarkMode: boolean) => ({
    color: isDarkMode ? COLORS.text : '#333333',
    fontWeight: '600',
  }),
  logoutButton: (isDarkMode: boolean) => ({
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    alignItems: 'center',
  }),
  logoutText: (isDarkMode: boolean) => ({
    color: COLORS.white,
    fontWeight: '600',
  }),
  fab: (isDarkMode: boolean) => ({
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  }),
  fabIcon: (isDarkMode: boolean) => ({
    color: COLORS.white,
  }),
});

export const quickAccessStyles = StyleSheet.create({
  item: (isDarkMode: boolean) => ({
    flex: 1,
    backgroundColor: isDarkMode ? '#3A3A3A' : '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: Platform.OS === 'android' ? 2 : 0,
  }),
  iconContainer: (isDarkMode: boolean) => ({
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  label: (isDarkMode: boolean) => ({
    fontSize: 14,
    color: isDarkMode ? COLORS.text : '#333333',
    marginTop: 8,
    textAlign: 'center',
  }),
});

export const sidebarStyles = StyleSheet.create({
  item: (isDarkMode: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: isDarkMode ? '#2E2E2E' : '#F0F0F0',
    borderRadius: 8,
    marginBottom: 8,
  }),
  iconContainer: (isDarkMode: boolean) => ({
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  }),
  label: (isDarkMode: boolean) => ({
    fontSize: 16,
    color: isDarkMode ? COLORS.text : '#333333',
  }),
});
