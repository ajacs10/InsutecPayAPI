// app/telas/Success/SuccessScreen.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
// ⚠️ Ajuste os caminhos conforme a estrutura real do seu projeto
import { useTheme } from '../ThemeContext/ThemeContext'; 
import { useFinance } from '../../../components/FinanceContext';

// --- CORES BASE ---
const baseColors = {
    primary: '#4CAF50', // Verde de sucesso
    white: '#FFFFFF',
    textDark: '#333333',
    textLight: '#E0E0E0',
    lightBackground: '#F5F5F5',
    darkBackground: '#121212',
    black: '#000',
};

// 💡 CORREÇÃO: Função para criar os estilos dinamicamente com base no tema.
const createStyles = (isDarkMode: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDarkMode ? baseColors.darkBackground : baseColors.lightBackground,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        padding: 30,
        borderRadius: 16,
        // Uso de ternário seguro dentro da função de estilo
        backgroundColor: isDarkMode ? '#1E1E1E' : baseColors.white,
        shadowColor: baseColors.black, 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
    },
    iconContainer: {
        marginBottom: 25,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: isDarkMode ? baseColors.textLight : baseColors.textDark,
        marginBottom: 20,
        textAlign: 'center',
    },
    transactionDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 8,
        paddingHorizontal: 10,
    },
    transactionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: isDarkMode ? baseColors.textLight : baseColors.textDark,
        opacity: 0.7,
    },
    transactionValue: {
        fontSize: 14,
        fontWeight: '600',
        color: isDarkMode ? baseColors.textLight : baseColors.textDark,
    },
    message: {
        fontSize: 16,
        color: isDarkMode ? baseColors.textLight : baseColors.textDark,
        textAlign: 'center',
        marginVertical: 25,
        lineHeight: 24,
        opacity: 0.8,
    },
    button: {
        backgroundColor: baseColors.primary,
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: baseColors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    secondaryButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: isDarkMode ? baseColors.textLight : baseColors.textDark,
    },
    secondaryButtonText: {
        color: isDarkMode ? baseColors.textLight : baseColors.textDark,
        fontSize: 14,
        fontWeight: '600',
    },
});

// --- COMPONENTE PRINCIPAL ---
export default function SuccessScreen() {
    const { isDarkMode } = useTheme();
    const { processarPagamento } = useFinance();
    const params = useLocalSearchParams();

    // 💡 Chama a função de estilo aqui, após a definição de isDarkMode
    const styles = createStyles(isDarkMode); 

    const {
        tipo_servico,
        descricao,
        valor_total,
        id_transacao_unica,
    } = params as {
        tipo_servico?: string;
        descricao?: string;
        valor_total?: string;
        id_transacao_unica?: string;
    };

    // Efeito para finalizar o pagamento no contexto, caso a transação não tenha um ID único (transação pendente).
    useEffect(() => {
        const processPayment = async () => {
            if (valor_total && descricao && !id_transacao_unica) {
                const valor = parseFloat(valor_total);
                if (isNaN(valor)) {
                    Alert.alert('Erro', 'Valor inválido fornecido.');
                    router.replace('/(tabs)');
                    return;
                }
                const success = await processarPagamento(valor, descricao);
                if (success) {
                    // Se o pagamento for bem-sucedido, redireciona para o comprovativo
                    router.replace({
                        pathname: '/telas/comprovativo/ComprovativoScreen',
                        params: { id: Date.now().toString() }, 
                    });
                } else {
                    Alert.alert('Erro', 'Falha ao processar o pagamento. Verifique seu saldo.');
                    router.replace('/(tabs)');
                }
            }
        };
        processPayment();
    }, [valor_total, descricao, id_transacao_unica, processarPagamento]);

    const getMensagemSucesso = () => {
        switch (tipo_servico) {
            case 'FOLHA_PROVA':
                return 'Sua solicitação de Folha de Prova foi processada com sucesso. Você pode acompanhar o status nos seus pedidos.';
            case 'MENSALIDADE':
                return 'Pagamento da mensalidade processado com sucesso. Sua situação está regularizada.';
            case 'MATERIAL_DIDATICO':
                return 'Pagamento do material didático processado com sucesso. O material será disponibilizado em breve.';
            default:
                return 'Pagamento processado com sucesso. O comprovativo foi guardado no seu histórico.';
        }
    };
    
    // Lida com o redirecionamento principal
    const handleGoHome = () => {
        if (id_transacao_unica) {
            // Se já tem ID de transação, vai para o comprovativo
            router.replace({
                pathname: '/telas/comprovativo/ComprovativoScreen',
                params: { id: id_transacao_unica },
            });
        } else {
            // Se não, volta para o início
            router.replace('/(tabs)');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <AntDesign name="checkcircle" size={80} color={baseColors.primary} />
                </View>
                <Text style={styles.title}>Pagamento Concluído! 🎉</Text>
                
                {Platform.OS === 'web' && (
                    <Text style={styles.message}>
                        Pagamento processado, mas a visualização do comprovativo em PDF não está disponível na web. Use o aplicativo móvel.
                    </Text>
                )}
                
                {/* Detalhes da Transação */}
                {descricao && (
                    <View style={styles.transactionDetails}>
                        <Text style={styles.transactionLabel}>Serviço:</Text>
                        <Text style={styles.transactionValue}>{descricao}</Text>
                    </View>
                )}
                
                {valor_total && (
                    <View style={styles.transactionDetails}>
                        <Text style={styles.transactionLabel}>Valor:</Text>
                        <Text style={styles.transactionValue}>
                            {parseFloat(valor_total).toLocaleString('pt-AO', {
                                style: 'currency',
                                currency: 'AOA',
                            })}
                        </Text>
                    </View>
                )}
                
                <Text style={styles.message}>{getMensagemSucesso()}</Text>
                
                {/* Botão Principal */}
                <TouchableOpacity style={styles.button} onPress={handleGoHome} activeOpacity={0.8}>
                    <Text style={styles.buttonText}>
                        {id_transacao_unica ? 'VER COMPROVATIVO' : 'VOLTAR PARA O INÍCIO'}
                    </Text>
                </TouchableOpacity>
                
                {/* Botão Secundário */}
                <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace('/(tabs)')}>
                    <Text style={styles.secondaryButtonText}>Ir para o Início</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
