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
  // Novo: Cores de Feedback
  success: '#4CAF50', 
};

// Tamanho máximo do formulário em telas grandes (tablet/web)
const MAX_FORM_WIDTH = 400;

export const styles = StyleSheet.create({
  // Novo estilo para a tela de carregamento inicial
  fullScreenLoading: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  } as ViewStyle,

  container: {
    flexGrow: 1,
    justifyContent: 'space-between', // Distribui o Header, Form e Footer
    alignItems: 'center',
    paddingHorizontal: width * 0.07, // 7% de padding lateral
    paddingVertical: 30,
    backgroundColor: COLORS.background,
    // Ajuste de padding para barra de status (Android)
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    minHeight: height, // Garante que ScrollView ocupe a altura total
  } as ViewStyle,

  header: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
    maxWidth: MAX_FORM_WIDTH,
  },
  logo: {
    // Responsividade da logo: 40% da largura da tela, com um máximo de 150
    width: Math.min(width * 0.4, 150), 
    height: Math.min(width * 0.4, 150),
    borderRadius: 15, // Aumenta o raio para visual moderno
    marginBottom: 25,
  },
  title: {
    fontSize: width > 400 ? 32 : 28, // Responsividade da fonte
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
    marginBottom: 30,
    maxWidth: MAX_FORM_WIDTH, // Limita a largura máxima do formulário
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20, // Aumenta o espaçamento
  },
  
  // Novo Wrapper para agrupar o TextInput e o botão de visibilidade
  passwordInputWrapper: { 
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  } as ViewStyle,

  input: {
    flex: 1, // Permite que o TextInput ocupe o espaço restante
    height: 52, // Altura um pouco maior
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    borderRadius: 10, // Aumenta o raio
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // Aumenta a sombra levemente
    shadowRadius: 4,
    elevation: 3,
  },
  // Estilo específico para input de senha para acomodar o botão
  passwordInput: { 
    paddingRight: 50, // Adiciona padding para o ícone
  },
  visibilityToggle: { // Novo estilo para o botão de alternar senha
    position: 'absolute',
    right: 0,
    height: 52,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
    // Garante que o toque funcione na área
    zIndex: 10, 
  } as ViewStyle,

  inputError: {
    borderColor: COLORS.error,
    borderWidth: 2, // Borda mais espessa para destacar o erro
    backgroundColor: COLORS.errorBackground,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13, // Fonte um pouco maior
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
    width: '100%', // Botão ocupa 100% da largura do formContainer (MAX_FORM_WIDTH)
    marginTop: 25,
    backgroundColor: COLORS.primary,
    borderRadius: 12, // Raio maior
    paddingVertical: 16, // Padding maior
    alignItems: 'center',
    shadowColor: COLORS.primary, // Sombra com a cor principal
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    transition: 'all 0.3s ease', // Pseudo-transição para web/desktop
  },
  buttonDisabled: {
    backgroundColor: COLORS.lightGray, // Cor mais neutra
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: '700', // Mais negrito
    fontSize: 18,
  },
  forgotPasswordButton: {
    marginTop: 20,
    padding: 8,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 20, // Espaço menor no final, já que o container usa space-between
    paddingBottom: 10,
    width: '100%',
    maxWidth: MAX_FORM_WIDTH,
  },
  info: {
    textAlign: 'center',
    color: COLORS.secondary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '300',
  },
});
