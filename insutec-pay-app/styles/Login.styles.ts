// styles/Login.styles.ts
import { StyleSheet, Dimensions, Platform, StatusBar, ViewStyle, TextStyle } from 'react-native';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;
const isWeb = Platform.OS === 'web';

export const COLORS = {
  primary: '#007bff',
  secondary: '#666666',
  gray: '#888888',
  background: '#f5f5f5',
  white: '#ffffff',
  black: '#000000',
  lightGray: '#E0E0E0',
  darkGray: '#424242',
  error: '#ff3b30',
  errorBackground: '#ffebee',
  success: '#4CAF50',
  warning: '#FFCC00',
  primaryLight: '#4da6ff',
  cardShadow: '#000000',
};

// Tamanho máximo do formulário
const MAX_FORM_WIDTH = 400;

export const styles = StyleSheet.create({
  // === TELAS DE LOADING ===
  fullScreenLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  } as ViewStyle,

  // === CONTAINER PRINCIPAL ===
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: width * 0.07,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 40,
    backgroundColor: COLORS.background,
    minHeight: height,
  } as ViewStyle,

  // === HEADER COM LOGO ===
  header: {
    alignItems: 'center',
    marginTop: isWeb ? 60 : Platform.OS === 'ios' ? 80 : 50,
    marginBottom: 50,
    width: '100%',
    maxWidth: MAX_FORM_WIDTH,
  } as ViewStyle,

  logo: {
    width: Math.min(width * 0.6, 210),
    height: Math.min(width * 0.5, 250),
    borderRadius: 20,
    marginBottom: 35,
    backgroundColor: COLORS.white,
    elevation: 5,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  } as ViewStyle,

  title: {
    fontSize: isTablet ? 32 : 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: COLORS.black,
  } as TextStyle,

  subtitle: {
    fontSize: isTablet ? 18 : 16,
    marginBottom: 40,
    textAlign: 'center',
    color: COLORS.secondary,
    lineHeight: 22,
    fontWeight: '400',
  } as TextStyle,

  // === FORMULÁRIO ===
  formContainer: {
    width: '100%',
    alignItems: 'center',
    maxWidth: MAX_FORM_WIDTH,
    marginBottom: 0,
  } as ViewStyle,

  inputContainer: {
    width: '100%',
    marginBottom: 20,
  } as ViewStyle,

  // === INPUTS ===
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  } as ViewStyle,

  input: {
    height: 52,
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,

  passwordInput: {
    paddingRight: 50,
  } as ViewStyle,

  visibilityToggle: {
    position: 'absolute',
    right: 0,
    height: 52,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  } as ViewStyle,

  // === ESTADOS DE ERRO ===
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 2,
    backgroundColor: COLORS.errorBackground,
  } as ViewStyle,

  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  } as TextStyle,

  helperText: {
    color: COLORS.gray,
    fontSize: 12,
    marginTop: 6,
    alignSelf: 'flex-end',
    fontWeight: '400',
  } as TextStyle,

  // === BOTÃO PRINCIPAL ===
  button: {
    width: '100%',
    marginTop: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  } as ViewStyle,

  buttonDisabled: {
    backgroundColor: COLORS.lightGray,
    elevation: 0,
    shadowOpacity: 0,
  } as ViewStyle,

  buttonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
  } as TextStyle,

  // === LINK ESQUECI SENHA ===
  forgotPasswordButton: {
    marginTop: 10,
    padding: 8,
    alignSelf: 'center',
  } as ViewStyle,

  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  } as TextStyle,

  // === RODAPÉ ===
  footer: {
    marginTop: 50,
    paddingBottom: 30,
    width: '100%',
    maxWidth: 1000,
    alignItems: 'center',
  } as ViewStyle,

  info: {
    textAlign: 'center',
    color: COLORS.secondary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '300',
  } as TextStyle,

  // === ESTILOS EXTRAS (para futuro uso) ===
  card: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    marginVertical: 10,
    width: '100%',
    maxWidth: MAX_FORM_WIDTH,
    elevation: 4,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  } as ViewStyle,

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  } as ViewStyle,
});
