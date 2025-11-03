// app/styles/_SharedFinance.styles.ts
import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#39FF14',
  primaryDark: '#00E600',
  success: '#00C853',
  danger: '#FF5252',
  darkBackground: '#0F0F0F',
  lightBackground: '#F0F2F5',
  cardDark: '#1F1F1F',
  cardLight: '#FFFFFF',
  textDark: '#1C1C1C',
  textLight: '#E0E0E0',
  subText: '#888888',
  gray: '#666666',
  lightGray: '#BBBBBB',
  dark: '#000000',
};

// Estilos ESTÁTICOS (StyleSheet.create)
const staticStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  payButton: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
  },
  payButtonDisabled: {
    backgroundColor: COLORS.lightGray,
    opacity: 0.7,
  },
  payButtonText: {
    color: COLORS.dark,
    fontSize: 16,
    fontWeight: '800',
  },
});

// Estilos DINÂMICOS (funções)
export const sharedStyles = {
  // Estáticos
  ...staticStyles,

  // Dinâmicos
  container: (dark: boolean) => ({
    ...staticStyles.container,
    backgroundColor: dark ? COLORS.darkBackground : COLORS.lightBackground,
  }),
  title: (dark: boolean) => ({
    ...staticStyles.title,
    color: dark ? COLORS.textLight : COLORS.textDark,
  }),
  sectionTitle: (dark: boolean) => ({
    ...staticStyles.sectionTitle,
    color: dark ? COLORS.textLight : COLORS.textDark,
  }),
  card: (dark: boolean) => ({
    ...staticStyles.card,
    backgroundColor: dark ? COLORS.cardDark : COLORS.cardLight,
  }),
  label: (dark: boolean) => ({
    ...staticStyles.label,
    color: dark ? COLORS.subText : COLORS.gray,
  }),
  value: (dark: boolean) => ({
    ...staticStyles.value,
    color: dark ? COLORS.textLight : COLORS.textDark,
  }),
};
