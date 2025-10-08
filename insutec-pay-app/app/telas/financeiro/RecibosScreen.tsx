import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
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
    id: string;
    title: string;
    description: string;
    date: string;
    total: string;
    status: 'PAGO' | 'PENDENTE' | 'VENCIDO';
    type: string;
    saldo_anterior?: string;
    saldo_atual?: string;
  };

  const totalNum = parseFloat(params.total || '0');
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
    : 'N/D';

  const handleGoHome = () => {
    router.push('/telas/home/HomeScreen');
  };

  const styles = {
    safeArea: {
      flex: 1,
      backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    },
    container: {
      padding: 16,
      flexGrow: 1,
      alignItems: 'center',
    },
    statusContainer: {
      alignItems: 'center',
      marginVertical: 20,
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
      paddingHorizontal: 20,
    },
    reciboCard: {
      backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
      borderRadius: 12,
      padding: 16,
      width: '100%',
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
      marginBottom: 12,
    },
    reciboRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    reciboLabel: {
      fontSize: 14,
      color: isDarkMode ? COLORS.subText : COLORS.gray,
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
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? COLORS.gray : COLORS.lightGray,
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    },
    totalValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: COLORS.primary,
    },
    homeButton: {
      backgroundColor: isDarkMode ? COLORS.gray : COLORS.subText,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginVertical: 10,
      width: '100%',
      alignItems: 'center',
    },
    homeButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.white,
    },
  };

  return (
    <View style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: isSuccess ? 'Detalhes do Recibo' : 'Falha na Transação',
          headerStyle: { backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground },
          headerTintColor: isDarkMode ? COLORS.textLight : COLORS.textDark,
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.statusContainer}>
          <Ionicons
            name={isSuccess ? 'checkmark-circle' : 'close-circle'}
            size={80}
            color={isSuccess ? COLORS.success : COLORS.danger}
          />
          <Text style={styles.statusTitle}>
            {isSuccess ? 'Pagamento Bem-Sucedido!' : 'Pagamento Falhou'}
          </Text>
          <Text style={styles.statusMessage}>
            {isSuccess
              ? 'O seu pagamento foi processado com sucesso.'
              : 'Ocorreu um erro ao processar o seu pagamento.'}
          </Text>
        </View>

        <View style={styles.reciboCard}>
          <Text style={styles.reciboTitle}>{params.title}</Text>
          <View style={styles.reciboRow}>
            <Text style={styles.reciboLabel}>Referência:</Text>
            <Text style={styles.reciboValue}>{params.id}</Text>
          </View>
          <View style={styles.reciboRow}>
            <Text style={styles.reciboLabel}>Descrição:</Text>
            <Text style={styles.reciboValue}>{params.description}</Text>
          </View>
          <View style={styles.reciboRow}>
            <Text style={styles.reciboLabel}>Data e Hora:</Text>
            <Text style={styles.reciboValue}>{transactionDate}</Text>
          </View>
          <View style={styles.reciboRow}>
            <Text style={styles.reciboLabel}>Tipo:</Text>
            <Text style={styles.reciboValue}>{params.type}</Text>
          </View>
          <View style={styles.reciboRow}>
            <Text style={styles.reciboLabel}>Status:</Text>
            <Text style={styles.reciboValue}>{params.status}</Text>
          </View>
          <View style={styles.reciboRow}>
            <Text style={styles.reciboLabel}>Saldo Anterior:</Text>
            <Text style={styles.reciboValue}>{formatCurrency(saldoAnteriorNum)}</Text>
          </View>
          <View style={styles.reciboRow}>
            <Text style={styles.reciboLabel}>Saldo Atual:</Text>
            <Text style={styles.reciboValue}>{formatCurrency(saldoAtualNum)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalNum)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Text style={styles.homeButtonText}>Voltar ao Início</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
