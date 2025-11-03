// app/styles/_Success.styles.ts
import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from './_SharedFinance.styles';

const { width } = Dimensions.get('window');

/**
 * Estilos da tela de sucesso (SuccessScreen)
 */
export const successStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  content: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },

  iconContainer: {
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.success,
    marginBottom: 8,
    textAlign: 'center',
  },

  message: {
    fontSize: 16,
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },

  id: {
    fontSize: 14,
    color: COLORS.subText,
    marginBottom: 30,
    fontFamily: 'monospace',
  },

  buttons: {
    width: '100%',
    gap: 12,
  },

  primaryButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },

  secondaryText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
