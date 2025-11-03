import { StyleSheet, Dimensions, Platform, StatusBar, ViewStyle, TextStyle } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: '#007bff',
  secondary: '#666',
  gray: '#888',
  background: '#f5f5f5',
  white: '#fff',
  black: '#000',
  lightGray: '#E0E0E0',
  darkGray: '#424242',
  error: '#ff3b30',
  errorBackground: '#ffebee',
  success: '#4CAF50', 
};

// Tamanho máximo do formulário em telas grandes (tablet/web)
const MAX_FORM_WIDTH = 400;

export const styles = StyleSheet.create({
  fullScreenLoading: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  } as ViewStyle,

  container: {
    flexGrow: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingHorizontal: width * 0.07,
    paddingVertical: 0,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0, 
    minHeight: height,
  } as ViewStyle,

  header: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 80 : 50, 
    marginBottom: 50,
    width: '100%',
    maxWidth: MAX_FORM_WIDTH,
  },
  logo: {
    width: Math.min(width * 0.6, 210), 
    height: Math.min(width * 0.5, 250),
    borderRadius: 20,
    marginBottom: 35,
  },
  title: {
    fontSize: width > 600 ? 30 : 28, 
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: COLORS.black,
  },
  subtitle: {
    fontSize: width > 400 ? 18 : 16,
    marginBottom: 40,
    textAlign: 'center',
    color: COLORS.secondary,
    lineHeight: 22,
  },
  
  formContainer: {
    width: '100%',
    alignItems: 'center',
    // AJUSTE AQUI: Removendo o marginBottom, pois o footer controlará o espaço
    marginBottom: 0, 
    maxWidth: MAX_FORM_WIDTH, 
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20, 
  },
  
  passwordInputWrapper: { 
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  } as ViewStyle,

  input: {
    flex: 1, 
    height: 52, 
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    borderRadius: 10, 
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, 
    shadowRadius: 4,
    elevation: 3,
  },
  passwordInput: { 
    paddingRight: 50, 
  },
  visibilityToggle: { 
    position: 'absolute',
    right: 0,
    height: 52,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
    zIndex: 10, 
  } as ViewStyle,

  inputError: {
    borderColor: COLORS.error,
    borderWidth: 2, 
    backgroundColor: COLORS.errorBackground,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13, 
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  helperText: {
    color: COLORS.gray,
    fontSize: 12,
    marginTop: 6,
    alignSelf: 'flex-end',
    fontWeight: '400',
  },
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
    transition: 'all 0.3s ease', 
  },
  buttonDisabled: {
    backgroundColor: COLORS.lightGray, 
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: '700', 
    fontSize: 18,
  },
  forgotPasswordButton: {
    // AJUSTE AQUI: Reduzindo o espaçamento superior e inferior do link
    marginTop: 10,
    padding: 8,
    marginBottom: 0, 
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footer: {
 
    marginTop: 50, 
    paddingBottom: 0, 
    width: '100%',
    maxWidth: 1000,
  },
  info: {
    textAlign: 'center',
    color: COLORS.secondary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '300',
  },
});
