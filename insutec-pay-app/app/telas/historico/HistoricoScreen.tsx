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
// Importa o tipo PagamentoTransacao da sua estrutura de tipos
import { getHistoricoTransacoes } from '../../../src/api/InsutecPayAPI'; 
import { PagamentoTransacao } from '../../../src/types'; 
// Supondo que você tem um arquivo de estilos:
import { styles, COLORS } from '../../../styles/_Historico.styles'; 

// ====================================================================
// Componente individual para renderizar uma transação na lista
// ====================================================================

interface TransactionItemProps {
    item: PagamentoTransacao;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ item }) => {
    // Função para formatar o valor para moeda (Angolana Kwanza - AOA)
    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-AO', {
            style: 'currency',
            currency: 'AOA',
            minimumFractionDigits: 2,
        });
    };

    // Determina o estilo do badge baseado no status
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PAGO':
                return styles.statusPAGO;
            case 'PENDENTE':
                return styles.statusPENDENTE;
            case 'CANCELADO':
                return styles.statusCANCELADO;
            default:
                return { backgroundColor: COLORS.secondary };
        }
    };

    // Formata o status para 'Pago', 'Pendente', 'Cancelado'
    const displayStatus = (status: string) => {
        return status.charAt(0) + status.slice(1).toLowerCase();
    };

    return (
        <View style={styles.transactionItem}>
            <View style={styles.infoContainer}>
                <Text style={styles.descriptionText}>{item.descricao}</Text>
                <Text style={styles.dateText}>
                    {/* Exibe a data formatada, ou uma mensagem se for nula */}
                    {item.data_transacao ? new Date(item.data_transacao).toLocaleDateString('pt-PT') : 'Data Indisponível'}
                </Text>
            </View>
            <View style={styles.amountContainer}>
                <Text style={styles.amountText}>
                    {formatCurrency(item.valor)}
                </Text>
                <Text style={[styles.statusBadge, getStatusStyle(item.status)]}>
                    {displayStatus(item.status)}
                </Text>
            </View>
        </View>
    );
};

// ====================================================================
// Hook para buscar e gerir o estado do histórico de transações
// ====================================================================

const useHistorico = (alunoId: number | undefined) => {
    const [transacoes, setTransacoes] = useState<PagamentoTransacao[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHistorico = useCallback(async () => {
        if (!alunoId) return;

        setLoading(true);
        setError(null);
        try {
            // Chama a função real da API (que chama o endpoint /aluno/:id/historico)
            const response = await getHistoricoTransacoes(alunoId);
            setTransacoes(response);
        } catch (err: any) {
            // Se o erro for 404/Network, o mock será exibido, mas o erro será notificado.
            setError(err.message || "Não foi possível carregar o histórico de transações.");
            Alert.alert("Erro de Carga", err.message || "Erro desconhecido ao carregar histórico.");
        } finally {
            setLoading(false);
        }
    }, [alunoId]);

    // Usa useFocusEffect para recarregar os dados sempre que o ecrã ganha foco
    useFocusEffect(
        useCallback(() => {
            fetchHistorico();
        }, [fetchHistorico])
    );

    return { transacoes, loading, error, fetchHistorico };
};

// ====================================================================
// Ecrã Principal
// ====================================================================

export default function HistoricoScreen() {
    const { aluno } = useAuth();
    const alunoId = aluno?.id;
    
    // Simulação de Dados (Fallback/Mock) - Mantidos para o caso da API falhar
    const mockTransacoes: PagamentoTransacao[] = [
        { id_transacao_unica: 'T123', descricao: 'Pagamento de Propinas - Setembro', valor: 45000, status: 'PAGO', data_transacao: '2024-09-05T10:00:00Z' },
        { id_transacao_unica: 'T124', descricao: 'Taxa de Inscrição 2024', valor: 5000, status: 'PAGO', data_transacao: '2024-08-15T10:00:00Z' },
        { id_transacao_unica: 'T125', descricao: 'Mensalidade de Outubro', valor: 45000, status: 'PENDENTE', data_transacao: '2024-10-01T10:00:00Z' },
        { id_transacao_unica: 'T126', descricao: 'Taxa de Recurso', valor: 7500, status: 'CANCELADO', data_transacao: '2024-07-20T10:00:00Z' },
    ];


    const { transacoes, loading, error, fetchHistorico } = useHistorico(alunoId);

    // Se a API retornar dados, usamos, senão usamos os mocks.
    const dataToDisplay = transacoes.length > 0 ? transacoes : mockTransacoes; 

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <FontAwesome name="history" size={60} color={COLORS.subText} />
            <Text style={styles.emptyText}>
                Não foram encontradas transações. 
                <Text style={{fontWeight: 'bold'}}> Comece a pagar as suas dívidas!</Text>
            </Text>
            <TouchableOpacity style={{marginTop: 15}} onPress={fetchHistorico}>
                <Text style={{color: COLORS.primary, fontWeight: 'bold'}}>Tentar Recarregar</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading && transacoes.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ marginTop: 10, color: COLORS.subText }}>A carregar histórico...</Text>
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
                // Permite 'pull-to-refresh'
                onRefresh={fetchHistorico}
                refreshing={loading}
            />
        </View>
    );
}
