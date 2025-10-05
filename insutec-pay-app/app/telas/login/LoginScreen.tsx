import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Alert, 
  ScrollView,
  ActivityIndicator // Adicionado para um indicador de carregamento mais visual
} from 'react-native';
import { router } from 'expo-router';

// Assumindo que a API está em src/api/InsutecPayAPI
import { login } from '../../../src/api/InsutecPayAPI'; 
// Assumindo que o Contexto está em components/AuthContext
import { useAuth } from '../../../components/AuthContext'; 

// Assumindo que styles está em styles/Login.styles
// NOTA: Certifica-te que os estilos e COLORS estão definidos neste ficheiro!
import { styles, COLORS } from '../../../styles/Login.styles';


export default function LoginScreen() {
  
  // Obter a função de autenticação do contexto
  const { signIn } = useAuth(); 
  const [numeroEstudante, setNumeroEstudante] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 1. Validação simples no frontend
    if (!numeroEstudante || !senha) {
      Alert.alert('Erro', 'Preencha o número de estudante e a senha.');
      return;
    }
    
    // DEBUG: A senha de teste é 123456
    // console.log(`Tentativa de Login: ${numeroEstudante} / ${senha}`);

    try {
      setLoading(true);

      // 2. CHAMA A API REAL (Envia a senha em texto puro, o servidor trata do bcrypt.compare)
      const aluno = await login(numeroEstudante, senha);

      // 3. USA O CONTEXTO PARA INICIAR A SESSÃO
      // O 'aluno.nr_estudante' é usado como token temporário.
      await signIn(aluno, aluno.nr_estudante);

      Alert.alert('Sucesso', `Bem-vindo(a), ${aluno.nome}!`);
      
      // Redireciona para o ecrã Home.
      router.push('/telas/home'); 

    } catch (error: any) {
      // O backend agora deve retornar uma mensagem clara de 401.
      const errorMessage = error.message || 'Falha na comunicação com o servidor. Verifique o URL.';
      Alert.alert('Erro no Login', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      // Garante que o teclado não cobre a área de input no Android/iOS
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
        // Desativa a edição durante o carregamento
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
        // Submete ao pressionar 'Enter' no teclado
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
