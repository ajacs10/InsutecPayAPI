import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../components/AuthContext';
import { getDividas, initiatePayment } from '../../../src/api/InsutecPayAPI';
import { formatCurrency, formatDate } from '../../../src/utils/formatters';
import { Divida } from '../../../src/types';
import { styles, COLORS } from '../../../styles/_Dividas.styles';

// Componente Individual de Dívida (Selecionável)
interface DividaItemProps {
  item: Divida;
  isSelected: boolean;
  onToggle: (item: Divida) => void;
}

const DividaItem: React.FC<DividaItemProps> = ({ item, isSelected, onToggle }) => {
  const valorMulta = item.valor_total - item.valor_base;

  return (
    <TouchableOpacity
      style={[styles.debtCard, isSelected && styles.debtCardSelected]}
      onPress={() => onToggle(item)}
      activeOpacity={0.8}
      accessibilityLabel={`Dívida ${item.descricao}`}
    >
      <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
        {isSelected && <FontAwesome name="check" size={16} color={COLORS.white} />}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.serviceName}>{item.descricao}</Text>
          <Text style={styles.dueDate}>Vence: {formatDate(item.data_vencimento)}</Text>
        </View>
        <View style={styles.valueRow}>
          <Text style={styles.valueLabel}>Valor Base:</Text>
          <Text style={styles.valueAmount}>{formatCurrency(item.valor_base)}</Text>
        </View>
        <View style={styles.valueRow}>
          <Text style={styles.valueLabel}>Multa Aplicada:</Text>
          <Text
            style={[
              styles.valueAmount,
              { color: valorMulta > 0 ? COLORS.warning : styles.valueAmount.color },
            ]}
          >
            {formatCurrency(valorMulta)}
          </Text>
        </View>
        <View style={styles.totalContainer}>
          <View>
            <Text style={styles.totalLabel}>TOTAL:</Text>
            <Text style={styles.totalValue}>{formatCurrency(item.valor_total)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Ecrã Principal com Lógica de Carrinho Flutuante
export default function DividasScreen() {
  const { aluno } = useAuth();
  const { servico, alunoId } = useLocalSearchParams(); // Captura alunoId
  const [dividas, setDividas] = useState<Divida[]>([]);
  const [selectedDividas, setSelectedDividas] = useState<Divida[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetAlunoId = alunoId || aluno?.id; // Usa alunoId do parâmetro ou do usuário logado

  const fetchDividas = useCallback(
    async (showLoading = true) => {
      if (!targetAlunoId) {
        setError('Usuário não autenticado.');
        return;
      }

      if (showLoading) setLoading(true);
      setError(null);

      try {
        const result = await getDividas(targetAlunoId);
        setDividas(result.dividas);

        if (servico) {
          const parsedServico = JSON.parse(servico as string);
          const dividaDoServico = result.dividas.find((d: Divida) => d.descricao === parsedServico.nome);
          if (dividaDoServico) {
            setSelectedDividas([dividaDoServico]);
          }
        }
      } catch (err: any) {
        console.error('[DividasScreen] Erro ao buscar dívidas:', err);
        setError(err.message || 'Não foi possível carregar as suas dívidas.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [targetAlunoId, servico]
  );

  useEffect(() => {
    fetchDividas();
  }, [fetchDividas]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDividas(false);
  };

  const { totalPagar, totalItems } = useMemo(() => {
    const total = selectedDividas.reduce((sum, d) => sum + d.valor_total, 0);
    return {
      totalPagar: total,
      totalItems: selectedDividas.length,
    };
  }, [selectedDividas]);

  const toggleDivida = (divida: Divida) => {
    setSelectedDividas((prev) =>
      prev.some((d) => d.id === divida.id)
        ? prev.filter((d) => d.id !== divida.id)
        : [...prev, divida]
    );
  };

  const handleInitiatePayment = async () => {
    if (totalItems === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um serviço a pagar.');
      return;
    }

    setLoading(true);

    const servicesPayload = selectedDividas.map((d) => ({
      id: d.id,
      valor_liquidado: d.valor_total,
    }));

    try {
      const response = await initiatePayment(targetAlunoId!, servicesPayload);

      Alert.alert(
        'Transação Iniciada',
        `ID: ${response.id_transacao_unica}\nTotal: ${formatCurrency(response.valor_total)}.\n\nAvançando para o QR Code...`,
        [
          {
            text: 'OK',
            onPress: () => {
              router.push({
                pathname: '/telas/transacao/TransactionScreen',
                params: {
                  id_transacao_unica: response.id_transacao_unica,
                  valor_total: response.valor_total.toString(),
                  descricao: selectedDividas.map((d) => d.descricao).join(', '),
                },
              });
              setSelectedDividas([]);
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Erro de Transação', error.message || 'Não foi possível iniciar o pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !refreshing && !dividas.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10 }}>A carregar as suas dívidas...</Text>
      </View>
    );
  }

  if (!dividas.length && !loading) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome name="check-circle" size={50} color={COLORS.success} />
        <Text style={styles.emptyText}>Parabéns!</Text>
        <Text style={styles.emptyText}>Não tem dívidas pendentes neste momento.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dívidas Pendentes ({dividas.length})</Text>

      <FlatList
        data={dividas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <DividaItem
            item={item}
            isSelected={selectedDividas.some((d) => d.id === item.id)}
            onToggle={toggleDivida}
          />
        )}
        contentContainerStyle={{ paddingBottom: totalItems > 0 ? 90 : 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      />

      {totalItems > 0 && (
        <View style={styles.floatingCart}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartLabel}>{totalItems} Serviço(s) Selecionado(s)</Text>
            <Text style={styles.cartTotal}>{formatCurrency(totalPagar)}</Text>
          </View>
          <TouchableOpacity
            style={styles.payAllButton}
            onPress={handleInitiatePayment}
            disabled={loading}
            accessibilityLabel="Pagar dívidas selecionadas"
          >
            <Text style={styles.payAllButtonText}>{loading ? 'A Processar...' : 'PAGAR TUDO'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
