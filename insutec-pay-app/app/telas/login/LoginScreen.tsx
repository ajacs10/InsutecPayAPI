// app/telas/login/login.tsx
import React, { useState, useEffect, useRef } from 'react';
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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../../components/AuthContext';
// Certifica-te que este caminho está correto:
import { styles, COLORS } from '../../../styles/Login.styles'; 
import { ValidationRules } from '../../../src/utils/validators';

export default function LoginScreen() {
  const { signIn, aluno, loading: authLoading } = useAuth();
  const passwordInputRef = useRef<TextInput>(null);

  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ identificador?: string; senha?: string }>({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isEmail = identificador.includes('@');

  // === CORREÇÃO CRÍTICA DO REDIRECIONAMENTO ===
  useEffect(() => {
    // Verifica se o aluno está logado E se o carregamento inicial terminou.
    if (aluno && !authLoading) {
      // Corrigido para as ROTAS CURTAS (dashboard e home), conforme os ficheiros renomeados.
      const destino = aluno.tipo_usuario === 'ADMIN'
        ? '/telas/admin/dashboard' 
        : '/telas/home/home';
      
      // Usamos replace para impedir que o utilizador volte para o login
      router.replace(destino);
    }
  }, [aluno, authLoading]);

  // Limpa erros ao digitar
  useEffect(() => {
    if (errors.identificador && identificador) setErrors(prev => ({ ...prev, identificador: undefined }));
    if (errors.senha && senha) setErrors(prev => ({ ...prev, senha: undefined }));
  }, [identificador, senha]);

  // Formata entrada
  const handleIdentificadorChange = (text: string) => {
    if (text.includes('@')) {
      setIdentificador(text.toLowerCase().trim());
    } else {
      const numbers = text.replace(/\D/g, '').slice(0, 6);
      setIdentificador(numbers);
    }
  };

  // Validação
  const validateFields = (): boolean => {
    const validIdent = ValidationRules.identificador(identificador);
    const validSenha = ValidationRules.senha(senha);

    const newErrors: any = {};
    if (!validIdent.isValid) newErrors.identificador = validIdent.message;
    if (!validSenha.isValid) newErrors.senha = validSenha.message;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Login
  const handleLogin = async () => {
    if (!validateFields()) {
      Alert.alert('Erro', 'Corrija os campos destacados.');
      return;
    }

    try {
      setLoading(true);
      await signIn(identificador.trim(), senha);
    } catch (error: any) {
      Alert.alert('Erro no Login', error.message || 'Falha ao conectar.');
      setSenha('');
    } finally {
      setLoading(false);
    }
  };

  const handleRecuperarSenha = () => {
    // Corrigido para a rota curta 'RecuperarEmail'
    router.push('/telas/recuperacao/RecuperarEmail'); 
  };

  if (authLoading) {
    return (
      <View style={styles.fullScreenLoading}>
        <StatusBar translucent backgroundColor="transparent" />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.info}>Preparando o sistema...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Cabeçalho */}
        <View style={styles.header}>
          {/* Assumindo que o caminho da imagem está correto */}
          <Image source={require('../../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" /> 
          <Text style={styles.title}>INSUTEC PAY</Text>
          <Text style={styles.subtitle}>Sistema de pagamentos de emolumentos</Text>
        </View>

        {/* Formulário */}
        <View style={styles.formContainer}>
          {/* Identificador */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.identificador && styles.inputError]}
              placeholder={isEmail ? 'Email' : 'Nº de Estudante (6 dígitos)'}
              placeholderTextColor={COLORS.gray}
              keyboardType={isEmail ? 'email-address' : 'numeric'}
              value={identificador}
              onChangeText={handleIdentificadorChange}
              editable={!loading}
              autoCapitalize="none"
              maxLength={isEmail ? 50 : 6}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />
            {errors.identificador && <Text style={styles.errorText}>{errors.identificador}</Text>}
            {!isEmail && identificador && (
              <Text style={styles.helperText}>{identificador.length}/6 dígitos</Text>
            )}
          </View>

          {/* Senha */}
          <View style={styles.inputContainer}>
            <View style={styles.passwordInputWrapper}>
              <TextInput
                ref={passwordInputRef}
                style={[styles.input, errors.senha && styles.inputError, styles.passwordInput]}
                placeholder="Senha"
                placeholderTextColor={COLORS.gray}
                secureTextEntry={!isPasswordVisible}
                value={senha}
                onChangeText={setSenha}
                editable={!loading}
                onSubmitEditing={handleLogin}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.visibilityToggle}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                disabled={loading}
              >
                <MaterialCommunityIcons
                  name={isPasswordVisible ? 'eye-off' : 'eye'}
                  size={24}
                  color={COLORS.darkGray}
                />
              </TouchableOpacity>
            </View>
            {errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}
          </View>

          {/* Botão Entrar */}
          <TouchableOpacity
            style={[styles.button, (loading || !identificador || !senha) && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading || !identificador || !senha}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          {/* Esqueci a senha */}
          <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleRecuperarSenha} disabled={loading}>
            <Text style={styles.forgotPasswordText}>Esqueci a senha</Text>
          </TouchableOpacity>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.info}>Acesso exclusivo para INSUTEC</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
