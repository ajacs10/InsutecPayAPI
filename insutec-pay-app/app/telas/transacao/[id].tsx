// app/telas/transacao/[id].tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext/ThemeContext';
import { styles, COLORS } from '../../../styles/_Transaction.styles';
import { formatCurrency } from '../../../src/utils/formatters';
import { PagamentoTransacao } from '../../../src/types';

export default function TransacaoScreen() {
  const { isDarkMode } = useTheme();
  const params = useLocalSearchParams() as {
    id: string;
    id_transacao_unica: string;
    valor_total: string;
    descricao: string;
    metodo_pagamento: string;
    status: 'PAGO' | 'PENDENTE' | 'CANCELADO' | 'ERRO';
    data: string;
    saldo_anterior?: string;
    saldo_atual?: string;
  };

  // Parse parameters to correct types
  const valorTotalNum = parseFloat(params.valor_total || '0');
  const saldoAnteriorNum = parseFloat(params.saldo_anterior || '0');
  const saldoAtualNum = parseFloat(params.saldo_atual || '0');
  const isSuccess = params.status === 'PAGO'; // Adjusted to match PagamentoTransacao status

  // Format transaction date
  const transactionDate = params.data
    ? new Date(params.data).toLocaleString('pt-AO', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/D';

  // Render status icon
  const renderIcon = () => {
    if (isSuccess) {
      return <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />;
    }
    return <Ionicons name="close-circle" size={80} color={COLORS.danger} />;
  };

  // Handle download button (placeholder for actual download logic)
  const handleDownload = () => {
    // TODO: Implement download logic for caminho_documento (requires verificarStatusPagamento)
    console.log('[TransacaoScreen] Download iniciado para:', params.id_transacao_unica);
  };

  // Navigate back to HomeScreen
  const handleGoHome = () => {
    router.push('/telas/home/HomeScreen');
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
        <View style={styles.statusContainer}>
          {renderIcon()}
          <Text style={styles.statusTitle(isDarkMode, isSuccess)}>
            {isSuccess ? 'Pagamento Bem-Sucedido!' : 'Pagamento Falhou'}
          </Text>
          <Text style={styles.statusMessage(isDarkMode)}>
            {isSuccess
              ? 'O seu pagamento foi processado e o recibo está disponível abaixo.'
              : 'Ocorreu um erro ao processar o seu pagamento. Por favor, tente novamente.'}
          </Text>
        </View>

        <View style={styles.reciboCard(isDarkMode)}>
          <Text style={styles.reciboTitle(isDarkMode)}>Detalhes da Transação</Text>
          <View style={styles.reciboRow}>
            <Text style={styles.reciboLabel(isDarkMode)}>Referência:</Text>
            <Text style={styles.reciboValue(isDarkMode)}>{params.id_transacao_unica}</Text>
          </View>
          <View style={styles.reciboRow}>
            <Text style={styles.reciboLabel(isDarkMode)}>Serviço:</Text>
            <Text style={styles.reciboValue(isDarkMode)}>{params.descricao}</Text>
          </View>
          <View style={styles.reciboRow}>
            <Text style={styles.reciboLabel(isDarkMode)}>Data e Hora:</Text>
            <Text style={styles.reciboValue(isDarkMode)}>{transactionDate}</Text>
          </View>
          <View style={styles.reciboRow}>
            <Text style={styles.reciboLabel(isDarkMode)}>Método:</Text>
            <Text style={styles.reciboValue(isDarkMode)}>{params.metodo_pagamento}</Text>
          </View>
          <View style={styles.reciboRow}>
            <Text style={styles.reciboLabel(isDarkMode)}>Saldo Anterior:</Text>
            <Text style={styles.reciboValue(isDarkMode)}>{formatCurrency(saldoAnteriorNum)}</Text>
          </View>
          <View style={styles.reciboRow}>
            <Text style={styles.reciboLabel(isDarkMode)}>Saldo Atual:</Text>
            <Text style={styles.reciboValue(isDarkMode)}>{formatCurrency(saldoAtualNum)}</Text>
          </View>
          <View style={styles.totalRow(isDarkMode)}>
            <Text style={styles.totalLabel(isDarkMode)}>Total:</Text>
            <Text style={styles.totalValue(isDarkMode)}>{formatCurrency(valorTotalNum)}</Text>
          </View>
        </View>

        {isSuccess && (
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
            <FontAwesome name="download" size={20} color={COLORS.textLight} />
            <Text style={styles.downloadButtonText}>Baixar Comprovativo</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.homeButton(isDarkMode)} onPress={handleGoHome}>
          <Text style={styles.homeButtonText(isDarkMode)}>Voltar ao Início</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
