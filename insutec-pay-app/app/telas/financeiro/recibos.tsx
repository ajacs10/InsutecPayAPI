import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext/ThemeContext';
import { formatCurrency } from '../../../src/utils/formatters';

const COLORS = {
  primary: '#39FF14',
  success: '#00C853',
  danger: '#FF5252',
  white: '#FFFFFF',
  darkBackground: '#0F0F0F',
  lightBackground: '#F0F2F5',
  cardDark: '#1F1F1F',
  cardLight: '#FFFFFF',
  textDark: '#1C1C1C',
  textLight: '#E0E0E0',
  subText: '#888888',
  gray: '#9E9E9E',
  lightGray: '#E0E0E0',
};

export default function ReciboScreen() {
  const { isDarkMode } = useTheme();
  const params = useLocalSearchParams() as {
    id?: string;
    title?: string;
    description?: string;
    date?: string;
    total?: string;
    status?: 'PAGO' | 'PENDENTE' | 'VENCIDO';
    type?: string;
    saldo_anterior?: string;
    saldo_atual?: string;
    id_transacao_unica?: string;
    valor_total?: string;
    descricao?: string;
    tipo_servico?: string;
  };

  // Usa os parâmetros alternativos se os principais não estiverem disponíveis
  const transactionId = params.id || params.id_transacao_unica || 'N/A';
  const transactionTitle = params.title || params.tipo_servico || 'Transação';
  const transactionDescription = params.description || params.descricao || 'Pagamento de serviço';
  const transactionTotal = params.total || params.valor_total || '0';
  const transactionType = params.type || params.tipo_servico || 'Serviço';
  
  const totalNum = parseFloat(transactionTotal || '0');
  const saldoAnteriorNum = parseFloat(params.saldo_anterior || '0');
  const saldoAtualNum = parseFloat(params.saldo_atual || '0');
  const isSuccess = params.status === 'PAGO';

  const transactionDate = params.date
    ? new Date(params.date).toLocaleString('pt-AO', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleString('pt-AO', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

  const handleGoHome = () => {
    router.replace('/telas/home/HomeScreen');
  };

  const handleGoBack = () => {
    router.back();
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    },
    container: {
      padding: 16,
      flexGrow: 1,
    },
    statusContainer: {
      alignItems: 'center',
      marginVertical: 20,
      paddingHorizontal: 20,
    },
    statusTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? COLORS.textLight : COLORS.textDark,
      marginTop: 10,
      textAlign: 'center',
    },
    statusMessage: {
      fontSize: 16,
      color: isDarkMode ? COLORS.subText : COLORS.gray,
      textAlign: 'center',
      marginTop: 8,
      lineHeight: 22,
    },
    reciboCard: {
      backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
      borderRadius: 12,
      padding: 20,
      marginVertical: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    reciboTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? COLORS.textLight : COLORS.textDark,
      marginBottom: 16,
      textAlign: 'center',
    },
    reciboRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      paddingVertical: 4,
    },
    reciboLabel: {
      fontSize: 14,
      color: isDarkMode ? COLORS.subText : COLORS.gray,
      flex: 1,
    },
    reciboValue: {
      fontSize: 14,
      fontWeight: '600',
      color: isDarkMode ? COLORS.textLight : COLORS.textDark,
      flex: 1,
      textAlign: 'right',
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#333' : COLORS.lightGray,
    },
    totalLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    },
    totalValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.primary,
    },
    buttonContainer: {
      gap: 12,
      marginTop: 20,
    },
    homeButton: {
      backgroundColor: COLORS.primary,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    backButton: {
      backgroundColor: 'transparent',
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDarkMode ? COLORS.gray : COLORS.lightGray,
    },
    homeButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.darkBackground,
    },
    backButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: isSuccess ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 82, 82, 0.1)',
    },
    statusBadgeText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: isSuccess ? COLORS.success : COLORS.danger,
    },
    divider: {
      height: 1,
      backgroundColor: isDarkMode ? '#333' : COLORS.lightGray,
      marginVertical: 8,
    },
  });

  return (
    <View style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: isSuccess ? 'Recibo de Pagamento' : 'Transação Falhou',
          headerStyle: { 
            backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground 
          },
          headerTintColor: isDarkMode ? COLORS.textLight : COLORS.textDark,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Status da Transação */}
        <View style={styles.statusContainer}>
          <Ionicons
            name={isSuccess ? 'checkmark-circle' : 'close-circle'}
            size={80}
            color={isSuccess ? COLORS.success : COLORS.danger}
          />
          <Text style={styles.statusTitle}>
            {isSuccess ? 'Pagamento Concluído!' : 'Pagamento Não Concluído'}
          </Text>
          <Text style={styles.statusMessage}>
            {isSuccess
              ? 'Sua transação foi processada com sucesso. Um comprovativo foi gerado e salvo no seu histórico.'
              : 'Não foi possível completar a transação. Verifique seu saldo e tente novamente.'}
          </Text>
        </View>

        {/* Detalhes do Recibo */}
        <View style={styles.reciboCard}>
          <Text style={styles.reciboTitle}>Comprovativo de Pagamento</Text>
          
          <View style={styles.reciboRow}>
            <Text style={styles.reciboLabel}>ID da Transação:</Text>
            <Text style={styles.reciboValue}>{transactionId}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.reciboRow}>
            <Text style={styles.reciboLabel}>Serviço:</Text>
            <Text style={styles.reciboValue}>{transactionTitle}</Text>
          </View>
          
          <View style={styles.reciboRow}>
            <Text style={styles.reciboLabel}>Descrição:</Text>
            <Text style={styles.reciboValue}>{transactionDescription}</Text>
          </View>
          
          <View style={styles.reciboRow}>
            <Text style={styles.reciboLabel}>Tipo:</Text>
            <Text style={styles.reciboValue}>{transactionType}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.reciboRow}>
            <Text style={styles.reciboLabel}>Data e Hora:</Text>
            <Text style={styles.reciboValue}>{transactionDate}</Text>
          </View>
          
          <View style={styles.reciboRow}>
            <Text style={styles.reciboLabel}>Status:</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>
                {isSuccess ? 'PAGO' : params.status || 'PENDENTE'}
              </Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          {/* Informações de Saldo (se disponíveis) */}
          {(saldoAnteriorNum > 0 || saldoAtualNum > 0) && (
            <>
              <View style={styles.reciboRow}>
                <Text style={styles.reciboLabel}>Saldo Anterior:</Text>
                <Text style={styles.reciboValue}>{formatCurrency(saldoAnteriorNum)}</Text>
              </View>
              
              <View style={styles.reciboRow}>
                <Text style={styles.reciboLabel}>Valor da Transação:</Text>
                <Text style={[styles.reciboValue, { color: COLORS.danger }]}>
                  - {formatCurrency(totalNum)}
                </Text>
              </View>
              
              <View style={styles.reciboRow}>
                <Text style={styles.reciboLabel}>Saldo Atual:</Text>
                <Text style={styles.reciboValue}>{formatCurrency(saldoAtualNum)}</Text>
              </View>
              
              <View style={styles.divider} />
            </>
          )}
          
          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Valor Total:</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalNum)}</Text>
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.homeButton} 
            onPress={handleGoHome}
          >
            <Text style={styles.homeButtonText}>
              {isSuccess ? 'Voltar ao Início' : 'Tentar Novamente'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleGoBack}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
