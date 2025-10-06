
import { StyleSheet, Platform } from 'react-native';

// Paleta de cores (alinhada com _ServicoStyles.ts)
export const COLORS = {
  primary: '#39FF14', // Verde neon
  primaryDark: '#00E600',
  darkBackground: '#0F0F0F',
  lightBackground: '#F0F2F5',
  cardDark: '#1F1F1F',
  cardLight: '#FFFFFF',
  textDark: '#1C1C1C',
  textLight: '#E0E0E0',
  subText: '#888888',
  success: '#39FF14',
  danger: '#FF4500',
  warning: '#FFCC00',
  white: '#FFFFFF',
  gray: '#666666',
  lightGray: '#BBBBBB',
};

// Estilos estáticos
const staticStyles = StyleSheet.create({
  payButton: {
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    backgroundColor: COLORS.primary,
    elevation: 6,
    ...Platform.select({ ios: { shadowOpacity: 0.2, shadowRadius: 4 }, android: { elevation: 6 } }),
  },
  payButtonDisabled: {
    opacity: 0.5,
    backgroundColor: COLORS.gray,
  },
  payButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.darkBackground,
    marginLeft: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalContainer: {
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

// Estilos dinâmicos
export const styles = {
  ...staticStyles,
  container: (isDarkMode: boolean) => ({
    flex: 1,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    paddingHorizontal: 16,
  }),
  title: (isDarkMode: boolean) => ({
    fontSize: 26,
    fontWeight: '800',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    padding: 20,
    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? COLORS.subText + '30' : COLORS.lightGray,
    textAlign: 'center',
  }),
  debtCard: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    borderRadius: 12,
    marginHorizontal: 15,
    marginTop: 15,
    padding: 15,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.danger,
    borderWidth: 1,
    borderColor: isDarkMode ? COLORS.subText + '30' : COLORS.lightGray,
    ...Platform.select({ ios: { shadowOpacity: 0.1, shadowRadius: 5 }, android: { elevation: 5 } }),
  }),
  serviceName: (isDarkMode: boolean) => ({
    fontSize: 18,
    fontWeight: '700',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    flexShrink: 1,
  }),
  dueDate: (isDarkMode: boolean) => ({
    fontSize: 13,
    color: isDarkMode ? COLORS.subText : COLORS.gray,
  }),
  valueLabel: (isDarkMode: boolean) => ({
    fontSize: 14,
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
  }),
  valueAmount: (isDarkMode: boolean) => ({
    fontSize: 14,
    fontWeight: '500',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
  }),
  totalLabel: (isDarkMode: boolean) => ({
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.danger,
  }),
  totalValue: (isDarkMode: boolean) => ({
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.danger,
  }),
  emptyContainer: (isDarkMode: boolean) => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 200,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
  }),
  emptyText: (isDarkMode: boolean) => ({
    fontSize: 18,
    color: isDarkMode ? COLORS.subText : COLORS.gray,
    textAlign: 'center',
    marginTop: 10,
  }),
  loadingContainer: (isDarkMode: boolean) => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
  }),
  errorText: (isDarkMode: boolean) => ({
    fontSize: 14,
    color: COLORS.danger,
    textAlign: 'center',
    marginTop: 10,
  }),
};

