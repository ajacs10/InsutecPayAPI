import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Alert, 
  ScrollView,
  ActivityIndicator 
} from 'react-native';
import { router } from 'expo-router';

// Assumindo que o Contexto está em components/AuthContext
import { useAuth } from '../../../components/AuthContext'; 

// Assumindo que styles está em styles/Login.styles
import { styles, COLORS } from '../../../styles/Login.styles';

export default function LoginScreen() {
  const { signIn } = useAuth(); 
  const [numeroEstudante, setNumeroEstudante] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!numeroEstudante || !senha) {
      Alert.alert('Erro', 'Preencha o número de estudante e a senha.');
      return;
    }

    console.log(`Tentativa de Login: ${numeroEstudante} / ${senha}`); // Log para depuração

    try {
      setLoading(true);
      // Correção: Chama diretamente signIn com nr_estudante e password
      await signIn(numeroEstudante, senha);
      Alert.alert('Sucesso', 'Bem-vindo(a)!');
      router.push('/telas/home'); 
    } catch (error: any) {
      console.error('Erro no handleLogin:', error.message); // Log para depuração
      const errorMessage = error.message || 'Falha na comunicação com o servidor. Verifique o URL.';
      Alert.alert('Erro no Login', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        onPress={() => Alert.alert('Recuperação', 'Função em desenvolvimento.')}
        disabled={loading}
      >
        <Text style={styles.forgotPasswordText}>Esqueci a minha senha</Text>
      </TouchableOpacity>

      <Text style={styles.info}>
        Apenas estudantes do INSUTEC podem aceder ao APP
      </Text>
    </ScrollView>
  );
}
