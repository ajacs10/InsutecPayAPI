
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../ThemeContext/ThemeContext';
import { styles, COLORS } from '../../../styles/_Dividas.styles.ts';

import { formatCurrency } from '../../../src/utils/formatters';

// Interface para dívidas
interface Divida {
  id: string;
  descricao: string;
  valor_base: number;
  valor_total: number;
  data_vencimento: string;
}

export default function DividasScreen() {
  const { isDarkMode } = useTheme();
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

    setIsLoading(true);
    const idTransacaoUnica = `TX-${Date.now()}`;
    console.log('[DividasScreen] Iniciando pagamento:', { idTransacaoUnica, totalDividas });

    setTimeout(() => {
      setIsLoading(false);
      router.push({
        pathname: '/telas/transacao/[id]',
        params: {
          id: idTransacaoUnica,
          id_transacao_unica: idTransacaoUnica,
          valor_total: totalDividas.toString(),
          descricao: dividas.map((d) => d.descricao).join(', '),
        },
      });
      console.log('[DividasScreen] Redirecionado para TransactionScreen');
    }, 1000);
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
