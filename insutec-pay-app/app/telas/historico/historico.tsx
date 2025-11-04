import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../../components/AuthContext';
import { getHistoricoTransacoes } from '../../../src/api/InsutecPayAPI';
import { PagamentoTransacao } from '../../../src/types';
import { styles, COLORS } from '../../../styles/_Historico.styles';

interface TransactionItemProps {
  item: PagamentoTransacao;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ item }) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 2,
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PAGO': return styles.statusPAGO;
      case 'PENDENTE': return styles.statusPENDENTE;
      case 'CANCELADO': return styles.statusCANCELADO;
      default: return { backgroundColor: COLORS.secondary };
    }
  };

  const displayStatus = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  return (
    <View style={styles.transactionItem}>
      <View style={styles.infoContainer}>
        <Text style={styles.descriptionText}>{item.descricao}</Text>
        <Text style={styles.dateText}>
          {item.data_transacao ? new Date(item.data_transacao).toLocaleDateString('pt-AO') : 'Data indisponível'}
        </Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.amountText}>{formatCurrency(item.valor)}</Text>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <FontAwesome
            name={item.status === 'PAGO' ? 'check-circle' : item.status === 'PENDENTE' ? 'clock-o' : 'times-circle'}
            size={14}
            color="white"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.statusText}>{displayStatus(item.status)}</Text>
        </View>
      </View>
    </View>
  );
};

const useHistorico = (alunoId: number | undefined) => {
  const [transacoes, setTransacoes] = useState<PagamentoTransacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistorico = useCallback(async () => {
    if (!alunoId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getHistoricoTransacoes(alunoId);
      setTransacoes(response);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar histórico.");
    } finally {
      setLoading(false);
    }
  }, [alunoId]);

  useFocusEffect(
    useCallback(() => {
      fetchHistorico();
    }, [fetchHistorico])
  );

  return { transacoes, loading, error, fetchHistorico };
};

export default function HistoricoScreen() {
  const { aluno } = useAuth();
  const alunoId = aluno?.id;

  const mockTransacoes: PagamentoTransacao[] = [
    { id_transacao_unica: 'T123', descricao: 'Pagamento de Propinas - Setembro', valor: 45000, status: 'PAGO', data_transacao: '2024-09-05T10:00:00Z' },
    { id_transacao_unica: 'T124', descricao: 'Taxa de Inscrição 2024', valor: 5000, status: 'PAGO', data_transacao: '2024-08-15T10:00:00Z' },
    { id_transacao_unica: 'T125', descricao: 'Mensalidade de Outubro', valor: 45000, status: 'PENDENTE', data_transacao: '2024-10-01T10:00:00Z' },
  ];

  const { transacoes, loading, error, fetchHistorico } = useHistorico(alunoId);
  const dataToDisplay = transacoes.length > 0 ? transacoes : mockTransacoes;

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="history" size={60} color={COLORS.subText} />
      <Text style={styles.emptyText}>
        Não foram encontradas transações.
        <Text style={{ fontWeight: 'bold' }}> Comece a pagar!</Text>
      </Text>
      <TouchableOpacity style={{ marginTop: 15 }} onPress={fetchHistorico}>
        <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Tentar Recarregar</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && transacoes.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10, color: COLORS.subText }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={dataToDisplay}
        keyExtractor={(item) => item.id_transacao_unica}
        renderItem={({ item }) => <TransactionItem item={item} />}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={dataToDisplay.length === 0 ? { flexGrow: 1 } : { paddingTop: 10 }}
        onRefresh={fetchHistorico}
        refreshing={loading}
      />
    </View>
  );
}
