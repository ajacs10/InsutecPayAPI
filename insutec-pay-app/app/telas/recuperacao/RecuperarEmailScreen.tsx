// telas/recuperacao/NovaPasswordScreen.tsx

import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    ActivityIndicator,
    Alert
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

// Estilos criados anteriormente
import { styles, COLORS } from '../../../styles/_Recuperacao.styles.ts'; 

// Simulação de API
const redefinirPalavraPasse = async (token: string, novaPassword: string): Promise<boolean> => {
    console.log(`[API] Redefinindo senha com token: ${token}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulação de sucesso
    return true; 
};

// ====================================================================
// Ecrã Principal (Redefinir Palavra-Passe)
// ====================================================================

export default function NovaPasswordScreen() {
    // Recebe o token (se existir) do Passo 2
    const { identificador, token } = useLocalSearchParams(); 
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Validação de Segurança Simples
    const isPasswordValid = password.length >= 8;
    const passwordsMatch = password === confirmPassword;
    const canSubmit = isPasswordValid && passwordsMatch && !loading && !success;

    const handleRedefinir = async () => {
        if (!token) {
            Alert.alert("Erro de Segurança", "Token de recuperação inválido ou inexistente.");
            router.replace('/telas/login');
            return;
        }

        if (!canSubmit) {
            // Isto não deve acontecer se o botão estiver disabled, mas é bom ter
            Alert.alert("Erro de Senha", "Certifique-se de que a senha tem 8 ou mais caracteres e que ambas as senhas coincidem.");
            return;
        }

        setLoading(true);

        try {
            const successAPI = await redefinirPalavraPasse(token as string, password);

            if (successAPI) {
                setSuccess(true);
                // Dá um feedback visual e depois redireciona
                setTimeout(() => {
                    Alert.alert("Sucesso!", "A sua Palavra-Passe foi redefinida com êxito! Faça login agora.");
                    router.replace('/telas/login');
                }, 1500); 

            } else {
                Alert.alert("Erro", "Falha ao redefinir a palavra-passe. O token pode ter expirado. Por favor, tente novamente.");
                router.replace('/telas/recuperacao'); // Volta ao Passo 1
            }

        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro de rede. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* O botão 'Voltar' só deve aparecer se não houver sucesso */}
            {!success && (
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={24} color={COLORS.dark} />
                </TouchableOpacity>
            )}
            
            <View style={styles.content}>
                <FontAwesome name="key" size={60} color={COLORS.primary} style={{ marginBottom: 20 }} />
                
                {success ? (
                    <>
                        <Text style={[styles.title, { color: COLORS.success }]}>Palavra-Passe Redefinida!</Text>
                        <Text style={styles.successMessage}>
                            Pode agora regressar ao ecrã de Login para aceder à sua conta.
                        </Text>
                        <TouchableOpacity 
                            style={[styles.button, { backgroundColor: COLORS.success }]}
                            onPress={() => router.replace('/telas/login')}
                        >
                            <Text style={styles.buttonText}>Ir para o Login</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.title}>Definir Nova Palavra-Passe</Text>
                        <Text style={styles.subtitle}>
                            Defina uma nova palavra-passe segura para a conta
                            <Text style={{ fontWeight: 'bold' }}> {identificador}</Text>.
                        </Text>
        
                        {/* Campo Nova Palavra-Passe */}
                        <TextInput
                            style={styles.input}
                            placeholder="Nova Palavra-Passe (mín. 8 caracteres)"
                            placeholderTextColor={COLORS.subText}
                            secureTextEntry={true}
                            value={password}
                            onChangeText={setPassword}
                        />
                        {password.length > 0 && !isPasswordValid && (
                            <Text style={{ color: COLORS.danger, fontSize: 12, marginBottom: 10 }}>
                                A palavra-passe deve ter, pelo menos, 8 caracteres.
                            </Text>
                        )}

                        {/* Campo Confirmação de Palavra-Passe */}
                        <TextInput
                            style={styles.input}
                            placeholder="Confirmar Nova Palavra-Passe"
                            placeholderTextColor={COLORS.subText}
                            secureTextEntry={true}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        {confirmPassword.length > 0 && !passwordsMatch && (
                            <Text style={{ color: COLORS.danger, fontSize: 12, marginBottom: 10 }}>
                                As palavras-passe não coincidem.
                            </Text>
                        )}

                        <TouchableOpacity 
                            style={styles.button}
                            onPress={handleRedefinir}
                            disabled={!canSubmit}
                        >
                            {loading ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <Text style={styles.buttonText}>Redefinir e Entrar</Text>
                            )}
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}
