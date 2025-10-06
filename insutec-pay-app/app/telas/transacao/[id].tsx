// /telas/transacao/[id].tsx

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext/ThemeContext';
import { styles, COLORS } from '../../../styles/_Transaction.styles.ts';
import { formatCurrency } from '../../../src/utils/formatters';

export default function TransacaoScreen() {
    const { isDarkMode } = useTheme();
    const params = useLocalSearchParams();

    // Parâmetros de sucesso recebidos do CarteiraScreen
    const {
        id,
        id_transacao_unica,
        valor_total,
        descricao,
        metodo_pagamento,
        status, // 'SUCESSO' ou 'FALHA' (simulado)
        data // Data da transação
    } = params as {
        id: string;
        id_transacao_unica: string;
        valor_total: string;
        descricao: string;
        metodo_pagamento: string;
        status: string;
        data: string;
    };

    const valorTotalNum = parseFloat(valor_total || '0');
    const isSuccess = status === 'SUCESSO';
    
    // Formatação da data (exemplo: DD/MM/AAAA HH:MM)
    const transactionDate = data ? new Date(data).toLocaleString('pt-AO', {
        year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }) : 'N/D';

    const renderIcon = () => {
        if (isSuccess) {
            return <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />;
        }
        return <Ionicons name="close-circle" size={80} color={COLORS.danger} />;
    };

    return (
        <View style={styles.safeArea(isDarkMode)}>
            <Stack.Screen 
                options={{ 
                    title: isSuccess ? 'Pagamento Efetuado' : 'Falha na Transação', 
                    headerStyle: { backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground },
                    headerTintColor: isDarkMode ? COLORS.textLight : COLORS.textDark,
                }} 
            />
            <ScrollView contentContainerStyle={styles.container(isDarkMode)}>
                
                {/* Status e Ícone */}
                <View style={styles.statusContainer}>
                    {renderIcon()}
                    <Text style={styles.statusTitle(isDarkMode, isSuccess)}>
                        {isSuccess ? 'Pagamento Bem-Sucedido!' : 'Pagamento Falhou'}
                    </Text>
                    <Text style={styles.statusMessage(isDarkMode)}>
                        {isSuccess 
                            ? 'O seu pagamento foi processado e o recibo está disponível abaixo.' 
                            : 'Ocorreu um erro ao processar o seu pagamento. Por favor, tente novamente.'
                        }
                    </Text>
                </View>

                {/* Detalhes da Transação (Recibo) */}
                <View style={styles.reciboCard(isDarkMode)}>
                    <Text style={styles.reciboTitle(isDarkMode)}>Detalhes da Transação</Text>

                    <View style={styles.reciboRow}>
                        <Text style={styles.reciboLabel(isDarkMode)}>Referência:</Text>
                        <Text style={styles.reciboValue(isDarkMode)}>{id_transacao_unica}</Text>
                    </View>
                    <View style={styles.reciboRow}>
                        <Text style={styles.reciboLabel(isDarkMode)}>Serviço:</Text>
                        <Text style={styles.reciboValue(isDarkMode)}>{descricao}</Text>
                    </View>
                    <View style={styles.reciboRow}>
                        <Text style={styles.reciboLabel(isDarkMode)}>Data e Hora:</Text>
                        <Text style={styles.reciboValue(isDarkMode)}>{transactionDate}</Text>
                    </View>
                    <View style={styles.reciboRow}>
                        <Text style={styles.reciboLabel(isDarkMode)}>Método:</Text>
                        <Text style={styles.reciboValue(isDarkMode)}>{metodo_pagamento}</Text>
                    </View>

                    {/* Total Final */}
                    <View style={styles.totalRow(isDarkMode)}>
                        <Text style={styles.totalLabel(isDarkMode)}>Valor Pago:</Text>
                        <Text style={styles.totalValue(isDarkMode)}>{formatCurrency(valorTotalNum)}</Text>
                    </View>
                </View>
                
                {/* Ações */}
                <TouchableOpacity style={styles.downloadButton(isDarkMode)} disabled={!isSuccess}>
                    <FontAwesome name="download" size={20} color={COLORS.darkBackground} />
                    <Text style={styles.downloadButtonText}>Transferir Recibo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.homeButton(isDarkMode)} onPress={() => router.replace('/telas/home/HomeScreen')}>
                    <Text style={styles.homeButtonText(isDarkMode)}>Voltar ao Início</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
