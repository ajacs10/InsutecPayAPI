import React, { useState, useEffect, useRef } from 'react'; // Importamos useRef
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Para o ícone de senha
import { router } from 'expo-router';
import { useAuth } from '../../../components/AuthContext';
import { styles, COLORS } from '../../../styles/Login.styles';
import { ValidationRules, formatNumeroEstudante, cleanSenha } from '../../../src/utils/validators';

export default function LoginScreen() {
  const { signIn, aluno, isLoading: authLoading } = useAuth();
  
  // Refs para controle de foco
  const passwordInputRef = useRef<TextInput>(null); 

  const [numeroEstudante, setNumeroEstudante] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{numeroEstudante?: string; senha?: string}>({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Novo estado para visibilidade da senha

  // ... [O restante dos useEffects (autenticação e limpeza de erros) é o mesmo] ...
  useEffect(() => {
    if (aluno && !authLoading) {
      console.log('[LoginScreen] Usuário já autenticado, redirecionando para home');
      router.replace('/telas/home/HomeScreen');
    }
  }, [aluno, authLoading]);

  useEffect(() => {
    if (errors.numeroEstudante && numeroEstudante) {
      setErrors(prev => ({ ...prev, numeroEstudante: undefined }));
    }
    if (errors.senha && senha) {
      setErrors(prev => ({ ...prev, senha: undefined }));
    }
  }, [numeroEstudante, senha]);
  // ... [Fim dos useEffects] ...

  const handleNumeroEstudanteChange = (text: string) => {
    const formatted = formatNumeroEstudante(text);
    setNumeroEstudante(formatted);
  };

  const handleSenhaChange = (text: string) => {
    const cleaned = cleanSenha(text);
    setSenha(cleaned);
  };

  const validateFields = (): boolean => {
    const validNumero = ValidationRules.numeroEstudante(numeroEstudante);
    const validSenha = ValidationRules.senha(senha);

    const newErrors: {numeroEstudante?: string; senha?: string} = {};

    if (!validNumero.isValid) {
      newErrors.numeroEstudante = validNumero.message;
    }

    if (!validSenha.isValid) {
      newErrors.senha = validSenha.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateFields()) {
      Alert.alert('Campos Inválidos', 'Por favor, corrija os erros nos campos destacados.');
      return;
    }

    try {
      setLoading(true);
      await signIn(numeroEstudante.trim(), senha);
      
      router.replace('/telas/home/HomeScreen');
      
    } catch (error: any) {
      console.log('[LoginScreen] Erro capturado:', error.message);
      
      Alert.alert(
        'Erro no Login', 
        error.message,
        [{ text: 'OK', style: 'default' }]
      );
      
      setSenha('');
      
    } finally {
      setLoading(false);
    }
  };

  const handleRecuperarSenha = () => {
    try {
      router.push('/telas/recuperacao/RecuperarEmailScreen');
    } catch (error) {
      Alert.alert('Atenção', 'Não foi possível acessar a recuperação de senha.');
    }
  };

  // Se ainda está carregando a autenticação, mostra loading
  if (authLoading) {
    return (
      <View style={styles.fullScreenLoading}> {/* Uso de um estilo mais adequado */}
        <StatusBar translucent backgroundColor="transparent" />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.info}>A preparar o sistema...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo e Título */}
        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>Sistema de pagamentos de emolumento INSUTEC</Text>
        </View>

        {/* Formulário de Login */}
        <View style={styles.formContainer}>
          
          {/* Campo Número de Estudante */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                errors.numeroEstudante && styles.inputError
              ]}
              placeholder="Número de Estudante (6 dígitos)"
              placeholderTextColor={COLORS.gray}
              keyboardType="numeric"
              value={numeroEstudante}
              onChangeText={handleNumeroEstudanteChange}
              editable={!loading}
              maxLength={6}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              // Foca no campo de senha após submeter este
              onSubmitEditing={() => passwordInputRef.current?.focus()} 
            />
            {errors.numeroEstudante && (
              <Text style={styles.errorText}>{errors.numeroEstudante}</Text>
            )}
            <Text style={styles.helperText}>
              {numeroEstudante.length}/6 dígitos
            </Text>
          </View>

          {/* Campo Senha com Botão de Visibilidade */}
          <View style={styles.inputContainer}>
            <View style={styles.passwordInputWrapper}> 
              <TextInput
                ref={passwordInputRef} // Anexamos a ref aqui
                style={[
                  styles.input,
                  errors.senha && styles.inputError,
                  styles.passwordInput
                ]}
                placeholder="Senha"
                placeholderTextColor={COLORS.gray}
                secureTextEntry={!isPasswordVisible} // Controla a visibilidade
                value={senha}
                onChangeText={handleSenhaChange}
                editable={!loading}
                onSubmitEditing={handleLogin}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                maxLength={20}
              />
              <TouchableOpacity
                style={styles.visibilityToggle}
                onPress={() => setIsPasswordVisible(prev => !prev)}
                disabled={loading}
              >
                <MaterialCommunityIcons 
                  name={isPasswordVisible ? 'eye-off' : 'eye'} 
                  size={24} 
                  color={COLORS.darkGray} 
                />
              </TouchableOpacity>
            </View>
            {errors.senha && (
              <Text style={styles.errorText}>{errors.senha}</Text>
            )}
          </View>

          {/* Botão de Login */}
          <TouchableOpacity
            style={[
              styles.button, 
              (loading || !numeroEstudante || !senha) && styles.buttonDisabled
            ]}
            onPress={handleLogin}
            disabled={loading || !numeroEstudante || !senha}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          {/* Link para recuperação de senha */}
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={handleRecuperarSenha}
            disabled={loading}
          >
            <Text style={styles.forgotPasswordText}>Esqueci a minha senha</Text>
          </TouchableOpacity>
        </View>

        {/* Informação */}
        <View style={styles.footer}>
          <Text style={styles.info}>
            Acesso exclusivo para estudantes do INSUTEC
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
