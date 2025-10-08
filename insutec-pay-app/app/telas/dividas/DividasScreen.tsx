import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../ThemeContext/ThemeContext';
import { useFinance } from '../../../components/FinanceContext';
import { formatCurrency } from '../../../src/utils/formatters';

// Interface para dívidas
interface Divida {
  id: string;
  descricao: string;
  valor_base: number;
  valor_total: number;
  data_vencimento: string;
  tipo_servico: string;
  estudante_alvo_id?: string;
}

export default function DividasScreen() {
  const { isDarkMode } = useTheme();
  const { saldo } = useFinance();
  const params = useLocalSearchParams();
  const [dividas, setDividas] = useState<Divida[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega dívidas adicionais do FolhadeProva ou outras telas
  useEffect(() => {
    console.log('[DividasScreen] Parâmetros recebidos:', params);
    if (params.servicosAdicionais) {
      try {
        const servicos = JSON.parse(params.servicosAdicionais as string) as Divida[];
        setDividas(servicos);
        console.log('[DividasScreen] Dívidas carregadas:', servicos);
      } catch (error) {
        console.error('[DividasScreen] Erro ao parsear servicosAdicionais:', error);
        setError('Não foi possível carregar os serviços adicionais.');
      }
    }
  }, [params.servicosAdicionais]);

  // Calcula o total
  const totalDividas = dividas.reduce((sum, divida) => sum + divida.valor_total, 0);

  // Inicia o pagamento
  const handleIniciarPagamento = () => {
    if (dividas.length === 0) {
      setError('Nenhuma dívida selecionada para pagamento.');
      return;
    }

    if (totalDividas > saldo) {
      Alert.alert('Erro', 'Saldo insuficiente para realizar o pagamento.');
      return;
    }

    setIsLoading(true);
    const idTransacaoUnica = `TX-${Date.now()}`;
    const descricao = dividas.map((d) => d.descricao).join(', ');
    const tipoServico = dividas[0]?.tipo_servico || 'OUTRO';
    const estudanteAlvoId = dividas[0]?.estudante_alvo_id;

    console.log('[DividasScreen] Iniciando pagamento:', {
      idTransacaoUnica,
      totalDividas,
      descricao,
      tipoServico,
      estudanteAlvoId,
    });

    setTimeout(() => {
      setIsLoading(false);
      router.push({
        pathname: '/telas/financeiro/CarteiraScreen',
        params: {
          id_transacao_unica: idTransacaoUnica,
          valor_total: totalDividas.toFixed(2),
          descricao,
          tipo_servico: tipoServico,
          estudante_alvo_id: estudanteAlvoId,
        },
      });
      console.log('[DividasScreen] Redirecionado para CarteiraScreen');
    }, 1000);
  };

  // Estilos
  const styles = {
    container: (isDark: boolean) => ({
      flex: 1,
      backgroundColor: isDark ? COLORS.darkBackground : COLORS.lightBackground,
    }),
    title: (isDark: boolean) => ({
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? COLORS.textLight : COLORS.textDark,
      textAlign: 'center',
      marginVertical: 20,
    }),
    loadingContainer: (isDark: boolean) => ({
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? COLORS.darkBackground : COLORS.lightBackground,
    }),
    emptyContainer: (isDark: boolean) => ({
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: isDark ? COLORS.darkBackground : COLORS.lightBackground,
    }),
    errorText: (isDark: boolean) => ({
      fontSize: 16,
      color: COLORS.danger,
      textAlign: 'center',
      marginTop: 10,
    }),
    emptyText: (isDark: boolean) => ({
      fontSize: 16,
      color: isDark ? COLORS.subText : COLORS.gray,
      textAlign: 'center',
      marginTop: 10,
    }),
    debtCard: (isDark: boolean) => ({
      backgroundColor: isDark ? COLORS.cardDark : COLORS.cardLight,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }),
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    serviceName: (isDark: boolean) => ({
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? COLORS.textLight : COLORS.textDark,
      flex: 1,
    }),
    dueDate: (isDark: boolean) => ({
      fontSize: 12,
      color: isDark ? COLORS.subText : COLORS.gray,
    }),
    valueRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    valueLabel: (isDark: boolean) => ({
      fontSize: 14,
      color: isDark ? COLORS.subText : COLORS.gray,
    }),
    valueAmount: (isDark: boolean) => ({
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? COLORS.textLight : COLORS.textDark,
    }),
    totalContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 16,
      marginVertical: 20,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? COLORS.gray : COLORS.lightGray,
    },
    totalLabel: (isDark: boolean) => ({
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? COLORS.textLight : COLORS.textDark,
    }),
    totalValue: (isDark: boolean) => ({
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.primary,
    }),
    payButton: {
      backgroundColor: COLORS.primary,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginHorizontal: 16,
      marginTop: 10,
      alignItems: 'center',
    },
    payButtonDisabled: {
      backgroundColor: COLORS.gray,
      opacity: 0.6,
    },
    payButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.darkBackground,
    },
  };

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

  return (
    <ScrollView style={styles.container(isDarkMode)} contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.title(isDarkMode)}>Minhas Dívidas</Text>

      {isLoading ? (
        <View style={styles.loadingContainer(isDarkMode)}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <View style={styles.emptyContainer(isDarkMode)}>
          <Text style={styles.errorText(isDarkMode)}>{error}</Text>
        </View>
      ) : dividas.length === 0 ? (
        <View style={styles.emptyContainer(isDarkMode)}>
          <FontAwesome name="exclamation-circle" size={40} color={COLORS.subText} />
          <Text style={styles.emptyText(isDarkMode)}>Nenhuma dívida encontrada.</Text>
        </View>
      ) : (
        dividas.map((divida) => (
          <View key={divida.id} style={styles.debtCard(isDarkMode)}>
            <View style={styles.headerRow}>
              <Text style={styles.serviceName(isDarkMode)}>{divida.descricao}</Text>
              <Text style={styles.dueDate(isDarkMode)}>
                Vencimento: {new Date(divida.data_vencimento).toLocaleDateString('pt-AO')}
              </Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel(isDarkMode)}>Valor Base:</Text>
              <Text style={styles.valueAmount(isDarkMode)}>{formatCurrency(divida.valor_base)}</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel(isDarkMode)}>Valor Total:</Text>
              <Text style={styles.valueAmount(isDarkMode)}>{formatCurrency(divida.valor_total)}</Text>
            </View>
            {divida.estudante_alvo_id && (
              <View style={styles.valueRow}>
                <Text style={styles.valueLabel(isDarkMode)}>Estudante:</Text>
                <Text style={styles.valueAmount(isDarkMode)}>{divida.estudante_alvo_id}</Text>
              </View>
            )}
          </View>
        ))
      )}

      {dividas.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel(isDarkMode)}>Total:</Text>
          <Text style={styles.totalValue(isDarkMode)}>{formatCurrency(totalDividas)}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.payButton, isLoading || dividas.length === 0 ? styles.payButtonDisabled : {}]}
        onPress={handleIniciarPagamento}
        disabled={isLoading || dividas.length === 0}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color={COLORS.darkBackground} size="small" />
        ) : (
          <Text style={styles.payButtonText}>
            Pagar Agora ({formatCurrency(totalDividas)}) <FontAwesome name="arrow-right" size={16} color={COLORS.darkBackground} />
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
