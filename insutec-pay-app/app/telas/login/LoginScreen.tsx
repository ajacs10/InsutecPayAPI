import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView, // Adicionado para melhor UX em mobile
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../../components/AuthContext';
import { styles, COLORS } from '../../../styles/Login.styles';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [numeroEstudante, setNumeroEstudante] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 1. Validação de campos (Mantenha a validação de formato aqui, se necessário)
    if (!numeroEstudante || !senha) {
      Alert.alert('Erro', 'Preencha o número de estudante e a senha.');
      return;
    }

    try {
      setLoading(true);
      console.log('[LoginScreen] Tentativa de Login:', { numeroEstudante });
      
      // Chama o método de login do contexto. O AuthContext lida com o redirecionamento.
      await signIn(numeroEstudante, senha); 
      
      // ✅ CORREÇÃO: Removida a linha 'router.replace' daqui. O AuthContext fará o redirecionamento.

      // Feedback visual opcional (o redirecionamento acontecerá logo após)
      // Alert.alert('Sucesso', 'Bem-vindo(a)!'); 

    } catch (error: any) {
      console.error('[LoginScreen] Erro no handleLogin:', error.message);
      // Apresenta a mensagem de erro que o AuthContext lançou
      const errorMessage = error.message || 'Falha na comunicação com o servidor. Verifique o URL.';
      Alert.alert('Erro no Login', errorMessage);

    } finally {
      // O loading só deve ser desligado em caso de erro. 
      // Em caso de sucesso, o componente é desmontado pelo router.replace (do AuthContext).
      if (loading) {
        setLoading(false);
      }
    }
  };

  return (
    // Usa KeyboardAvoidingView para evitar que o teclado cubra os inputs (melhor prática)
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require('../../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Insutec Pay</Text>
        <Text style={styles.subtitle}>Sistema de pagamentos do INSUTEC.</Text>

        <TextInput
          style={styles.input}
          placeholder="Número de Estudante"
          placeholderTextColor={COLORS.gray}
          keyboardType="numeric"
          value={numeroEstudante}
          onChangeText={setNumeroEstudante}
          editable={!loading}
          maxLength={10}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={COLORS.gray}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          editable={!loading}
          onSubmitEditing={handleLogin}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => router.push('/telas/recuperar-senha/RecuperarSenhaScreen')}
          disabled={loading}
        >
          <Text style={styles.forgotPasswordText}>Esqueci a minha senha</Text>
        </TouchableOpacity>

        <Text style={styles.info}>
          Apenas estudantes do INSUTEC podem aceder ao APP
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
