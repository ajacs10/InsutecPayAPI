import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    ActivityIndicator, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView 
} from 'react-native';
import { router } from 'expo-router'; // Importação CRÍTICA para navegação
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../../components/AuthContext'; 
import { register } from '../../../src/api/InsutecPayAPI'; 
import { styles, COLORS } from '../../../styles/_Cadastro.styles.ts';


export default function CadastroScreen() {
    const { setAluno } = useAuth();
    const [nome, setNome] = useState('');
    const [nrEstudante, setNrEstudante] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Valida os campos de entrada antes de submeter.
     */
    const validate = () => {
        setError(null);

        if (!nome || !nrEstudante || !email || !password || !confirmPassword) {
            setError("Por favor, preencha todos os campos obrigatórios.");
            return false;
        }
        if (password.length < 6) {
            setError("A palavra-passe deve ter pelo menos 6 caracteres.");
            return false;
        }
        if (password !== confirmPassword) {
            setError("A palavra-passe e a confirmação não coincidem.");
            return false;
        }
        if (!email.includes('@') || !email.includes('.')) {
            setError("Por favor, insira um endereço de email válido.");
            return false;
        }
        return true;
    };

    /**
     * Lida com o processo de registo: validação, chamada à API e redirecionamento.
     */
    const handleRegister = async () => {
        if (!validate()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Chama a função de registo na API (a ser implementada)
            // A API deve retornar o objeto do Aluno registado
            const alunoData = await register({ 
                nome, 
                nr_estudante: nrEstudante, 
                email, 
                password 
            });

            // Registo bem-sucedido: define o aluno no contexto e redireciona para a Home
            setAluno(alunoData);
            Alert.alert("Sucesso", "Registo realizado com sucesso!");

        } catch (err: any) {
            // Se a API falhar (ex: estudante já existe)
            const message = err.message || "Ocorreu um erro durante o registo. Tente novamente.";
            setError(message);
            console.error("Erro de Registo:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.container}>
                
                {/* Cabeçalho */}
                <View style={styles.header}>
                    <Text style={styles.title}>Criar Conta Estudante</Text>
                    <Text style={styles.subtitle}>Registe os seus dados para aceder ao Insutec Pay.</Text>
                </View>

                {/* Mensagem de Erro */}
                {error && (
                    <Text style={styles.errorText}>
                        <FontAwesome name="exclamation-circle" size={14} color={COLORS.error} /> {error}
                    </Text>
                )}

                {/* Campo Nome Completo */}
                <TextInput
                    style={styles.input}
                    placeholder="Nome Completo"
                    value={nome}
                    onChangeText={setNome}
                    autoCapitalize="words"
                    editable={!loading}
                />

                {/* Campo Nº de Estudante */}
                <TextInput
                    style={styles.input}
                    placeholder="Nº de Estudante (Ex: 12345)"
                    keyboardType="numeric"
                    value={nrEstudante}
                    onChangeText={setNrEstudante}
                    autoCapitalize="none"
                    editable={!loading}
                />

                {/* Campo Email */}
                <TextInput
                    style={styles.input}
                    placeholder="Email Institucional"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    editable={!loading}
                />

                {/* Campo Palavra-passe */}
                <TextInput
                    style={styles.input}
                    placeholder="Palavra-passe (mín. 6 caracteres)"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    editable={!loading}
                />

                {/* Campo Confirmação de Palavra-passe */}
                <TextInput
                    style={styles.input}
                    placeholder="Confirmar Palavra-passe"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    editable={!loading}
                />

                {/* Botão de Registo */}
                <TouchableOpacity 
                    style={styles.registerButton} 
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <Text style={styles.buttonText}>Registar-me</Text>
                    )}
                </TouchableOpacity>

                {/* Link para Login */}
                <TouchableOpacity
                    style={styles.loginLink}
                    onPress={() => router.replace('/telas/login/LoginScreen')} // Usa replace para não voltar aqui com o 'back'
                    disabled={loading}
                >
                    <Text style={styles.loginText}>
                        Já tem conta? {' '}
                        <Text style={styles.loginLinkText}>Fazer Login</Text>
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

