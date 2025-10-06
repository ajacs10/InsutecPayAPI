
import { StyleSheet, Platform, Dimensions } from 'react-native';

// Constantes para espaçamentos e tamanhos
const { width } = Dimensions.get('window');
const PADDING_HORIZONTAL = 20;
const PADDING_VERTICAL = 15;
const CARD_MARGIN = 15;
const BORDER_RADIUS = 12;
const FONT_SIZES = {
  header: 26,
  description: 16,
  cardTitle: 18,
  detail: 16,
  total: 18,
  buttonText: 18,
  smallText: 12,
  noteText: 12,
};

// Paleta de cores
export const COLORS = {
  primary: '#0b5394', // Azul principal
  primaryDark: '#073763',
  accent: '#00FFFF',
  lightBackground: '#f8f9fa',
  darkBackground: '#2E2E2E',
  cardBackgroundLight: '#FFFFFF',
  cardBackgroundDark: '#3A3A3A',
  textDark: '#333333',
  textLight: '#FFFFFF',
  subText: '#AAAAAA',
  success: '#00CC00',
  danger: '#FF3333',
  white: '#FFFFFF',
};

// Estilos estáticos
const staticStyles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingVertical: PADDING_VERTICAL,
    paddingBottom: 40,
    alignItems: 'center',
  },
  fileDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 5,
  },
  confirmButton: {
    backgroundColor: COLORS.success,
    paddingVertical: PADDING_VERTICAL,
    borderRadius: BORDER_RADIUS,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    ...Platform.select({
      ios: { shadowColor: COLORS.textDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },
  confirmButtonDisabled: {
    backgroundColor: COLORS.subText,
    opacity: 0.7,
  },
});

// Estilos dinâmicos
export const styles = {
  ...staticStyles,
  container: (isDarkMode: boolean) => ({
    flex: 1,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
  }),
  header: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.header,
    fontWeight: '700',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 15,
    textAlign: 'center',
  }),
  description: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.description,
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: PADDING_HORIZONTAL,
  }),
  card: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? COLORS.cardBackgroundDark : COLORS.cardBackgroundLight,
    padding: PADDING_HORIZONTAL,
    borderRadius: BORDER_RADIUS,
    width: width - PADDING_HORIZONTAL * 2,
    marginBottom: CARD_MARGIN,
    borderWidth: 1,
    borderColor: isDarkMode ? COLORS.subText + '33' : COLORS.subText + '20',
    ...Platform.select({
      ios: { shadowColor: COLORS.textDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  }),
  cardTitle: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.cardTitle,
    fontWeight: '700',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? COLORS.subText + '50' : COLORS.subText + '30',
    paddingBottom: 5,
  }),
  fileStatus: (isDarkMode: boolean, hasFile: boolean) => ({
    marginLeft: 10,
    fontSize: FONT_SIZES.smallText,
    fontStyle: 'italic',
    color: hasFile ? COLORS.success : isDarkMode ? COLORS.subText : COLORS.textDark,
  }),
  uploadButton: (isDarkMode: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS,
    marginBottom: 10,
  }),
  uploadButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONT_SIZES.buttonText,
  },
  smallText: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.smallText,
    color: isDarkMode ? COLORS.subText : COLORS.textDark,
    textAlign: 'center',
  }),
  detailLabel: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.detail,
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
  }),
  detailValue: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.detail,
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
  }),
  divider: (isDarkMode: boolean) => ({
    height: 1,
    backgroundColor: isDarkMode ? COLORS.subText : COLORS.textDark,
    marginVertical: 10,
    opacity: 0.3,
  }),
  totalLabel: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.total,
    fontWeight: '700',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
  }),
  totalValue: {
    fontSize: FONT_SIZES.total,
    fontWeight: '700',
    color: COLORS.primary,
  },
  noteText: (isDarkMode: boolean) => ({
    marginTop: 15,
    fontSize: FONT_SIZES.noteText,
    color: isDarkMode ? COLORS.subText : COLORS.textDark,
    textAlign: 'center',
    opacity: 0.7,
  }),
};
