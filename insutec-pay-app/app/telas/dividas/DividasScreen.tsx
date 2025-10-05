import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Alert,
    Modal,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../components/AuthContext';
// Simulação de APIs (É necessário ter estes ficheiros no teu projeto)
import { getDividas, initiatePayment } from '../../../src/api/InsutecPayAPI'; 
import { formatCurrency, formatDate } from '../../../src/utils/formatters';
// Tipos (Certifica-te que 'Divida' está corretamente definido)
import { Divida } from '../../../src/types'; 
// Certifica-te que o caminho do estilo está correto
import { styles, COLORS } from '../../../styles/_Dividas.styles'; 

// =========================================================================
// INTERFACES E TIPOS ADICIONAIS
// =========================================================================

// Interface para o item que vem das telas de detalhes (Propina.tsx, etc.)
// Usado no parâmetro 'servicosAdicionais'
interface ServicoAdicional {
    id: string; // ID temporário ou único para o item
    descricao: string;
    valor_total: number;
    valor_base: number;
    // ... outros campos (meses, quantidade, etc.)
}

// =========================================================================
// Componente Individual de Dívida (Selecionável)
// =========================================================================
interface DividaItemProps {
    item: Divida;
    isSelected: boolean;
    onToggle: (item: Divida) => void;
}

const DividaItem: React.FC<DividaItemProps> = ({ item, isSelected, onToggle }) => {
    // Nota: Aqui usei a interface Divida. Se o 'item' vier do FE (servicosAdicionais),
    // ele deve ser mapeado para a interface 'Divida' antes de ser adicionado à lista.
    const valorMulta = item.valor_total - (item.valor_base || 0);

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
                    {item.data_vencimento && (
                         <Text style={styles.dueDate}>Vence: {formatDate(item.data_vencimento)}</Text>
                    )}
                </View>
                <View style={styles.valueRow}>
                    <Text style={styles.valueLabel}>Valor Base:</Text>
                    <Text style={styles.valueAmount}>{formatCurrency(item.valor_base || item.valor_total)}</Text>
                </View>
                {valorMulta > 0 && (
                    <View style={styles.valueRow}>
                        <Text style={styles.valueLabel}>Multa/Juros:</Text>
                        <Text style={[styles.valueAmount, { color: COLORS.warning }]}>
                            {formatCurrency(valorMulta)}
                        </Text>
                    </View>
                )}
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

// =========================================================================
// Ecrã Principal: DIVIDAS SCREEN (CHECKOUT CENTRAL)
// =========================================================================
export default function DividasScreen() {
    const { aluno } = useAuth();
    // Use servicosAdicionais para itens vindos das telas específicas (Propina, etc.)
    const { servicosAdicionais } = useLocalSearchParams(); 
    const [dividas, setDividas] = useState<Divida[]>([]);
    const [selectedDividas, setSelectedDividas] = useState<Divida[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);

    // O targetAlunoId garante que a busca é feita corretamente
    const targetAlunoId = aluno?.nr_estudante; 

    // LÓGICA DE BUSCA DE DÍVIDAS ATUALIZADA
    const fetchDividas = useCallback(
        async (showLoading = true) => {
            if (!targetAlunoId) {
                // Não precisa de mostrar um erro se o aluno ainda estiver a carregar ou não estiver logado.
                return;
            }

            if (showLoading) setLoading(true);
            setError(null);

            try {
                // Busca dívidas do Backend (BE)
                const result = await getDividas(targetAlunoId);
                const dividasReais: Divida[] = result.dividas;

                let initialSelection: Divida[] = [];

                // NOVO FLUXO: Processar dívidas criadas pelo Frontend (servicosAdicionais)
                if (servicosAdicionais) {
                    try {
                        // O parâmetro vem como string, precisamos de o analisar (parse)
                        // NOTA: Assumimos que o FE mapeou corretamente para um array de Divida/ServicoAdicional
                        const parsedAdicionais = JSON.parse(servicosAdicionais as string) as Divida[];
                        initialSelection.push(...parsedAdicionais);
                    } catch (e) {
                        console.error("Erro ao analisar servicosAdicionais:", e);
                    }
                }
                
                // MANTÉM TODAS AS DÍVIDAS DO BE NA LISTA PRINCIPAL
                setDividas(dividasReais);

                // Inicializa a seleção com os itens vindos da tela anterior
                // O merge e remoção de duplicados é um bom toque!
                const allItems = [...initialSelection, ...dividasReais];
                const uniqueSelection = allItems.filter((v, i, a) => 
                    a.findIndex(t => (t.id === v.id || t.descricao === v.descricao)) === i
                );

                // Inicializa a seleção apenas com os itens adicionais (e não todas as dívidas pendentes)
                setSelectedDividas(initialSelection);

            } catch (err: any) {
                console.error('[DividasScreen] Erro ao buscar dívidas:', err);
                setError(err.message || 'Não foi possível carregar as suas dívidas.');
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [targetAlunoId, servicosAdicionais]
    );

    useEffect(() => {
        fetchDividas();
    }, [fetchDividas]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchDividas(false);
    };

    // NOVO CÁLCULO: Discriminação dos totais (Base vs. Multa)
    const { totalPagar, totalItems, totalBase, totalMulta } = useMemo(() => {
        const total = selectedDividas.reduce((sum, d) => sum + d.valor_total, 0);
        const base = selectedDividas.reduce((sum, d) => sum + (d.valor_base || d.valor_total), 0);
        // A multa é a diferença entre o total e a base
        const multa = Math.max(0, total - base); 

        return {
            totalPagar: total,
            totalItems: selectedDividas.length,
            totalBase: base,
            totalMulta: multa,
        };
    }, [selectedDividas]);

    // Função para adicionar/remover uma dívida da seleção
    const toggleDivida = (divida: Divida) => {
        setSelectedDividas((prev) =>
            prev.some((d) => d.id === divida.id)
                ? prev.filter((d) => d.id !== divida.id)
                : [...prev, divida]
        );
    };
    
    // FUNÇÃO PRINCIPAL DE INICIAÇÃO DO PAGAMENTO (APÓS O MODAL)
    const confirmAndInitiatePayment = async () => {
        setIsReviewModalVisible(false); // Fechar o modal
        setLoading(true);

        const servicesPayload = selectedDividas.map((d) => ({
            // ID único do item (pode ser o ID do BE ou o ID temporário do FE)
            id: d.id, 
            valor_liquidado: d.valor_total,
        }));

        try {
            const response = await initiatePayment(targetAlunoId!, servicesPayload);

            // Sucesso: Redirecionar para a tela de Transação/QR Code
            router.push({
                pathname: '/telas/transacao/TransactionScreen',
                params: {
                    id_transacao_unica: response.id_transacao_unica,
                    valor_total: response.valor_total.toString(),
                    descricao: selectedDividas.map((d) => d.descricao).join(', '),
                },
            });
            setSelectedDividas([]);
        } catch (error: any) {
            Alert.alert('Erro de Transação', error.message || 'Não foi possível iniciar o pagamento. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // NOVO HANDLER: Abre o modal de revisão
    const handleReviewPayment = () => {
        if (totalItems === 0) {
            Alert.alert('Atenção', 'Selecione pelo menos um serviço a pagar.');
            return;
        }
        setIsReviewModalVisible(true);
    };

    // NOVO COMPONENTE: Modal de Revisão de Pagamento
    const ReviewPaymentModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isReviewModalVisible}
            onRequestClose={() => setIsReviewModalVisible(false)}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Revisão do Pagamento</Text>
                    <Text style={styles.modalSubtitle}>{totalItems} Serviço(s) Selecionado(s)</Text>

                    {/* Lista Resumida de Itens */}
                    <View style={styles.summaryList}>
                        <FlatList
                            data={selectedDividas}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.summaryItem}>
                                    <Text style={styles.summaryText} numberOfLines={1}>{item.descricao}</Text>
                                    <Text style={styles.summaryValue}>{formatCurrency(item.valor_total)}</Text>
                                </View>
                            )}
                            // Limitar a altura da lista para evitar que o modal seja muito grande
                            style={{ maxHeight: 150, width: '100%' }}
                        />
                    </View>
                    
                    {/* Detalhes do Cálculo */}
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Subtotal (Valor Base):</Text>
                        <Text style={styles.detailValue}>{formatCurrency(totalBase)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Total de Multas/Juros:</Text>
                        <Text style={[styles.detailValue, totalMulta > 0 && { color: COLORS.warning }]}>{formatCurrency(totalMulta)}</Text>
                    </View>
                    <View style={styles.totalSeparator} />
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabelTotal}>TOTAL FINAL A PAGAR:</Text>
                        <Text style={styles.detailValueTotal}>{formatCurrency(totalPagar)}</Text>
                    </View>

                    {/* Botões de Ação */}
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setIsReviewModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={confirmAndInitiatePayment}
                            disabled={loading}
                        >
                            <Text style={styles.confirmButtonText}>{loading ? 'A Processar...' : 'Confirmar e Pagar'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
    
    // Renderização Principal
    if (loading && !refreshing) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>A carregar dívidas...</Text>
            </View>
        );
    }
    
    if (error) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>🚨 Erro ao carregar: {error}</Text>
                <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ReviewPaymentModal />

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
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <FontAwesome name="check-circle" size={50} color={COLORS.success} />
                        <Text style={styles.emptyText}>Parabéns! Nenhuma dívida pendente encontrada.</Text>
                    </View>
                }
            />

            {totalItems > 0 && (
                <View style={styles.floatingCart}>
                    <View style={styles.cartInfo}>
                        <Text style={styles.cartLabel}>{totalItems} Serviço(s) Selecionado(s)</Text>
                        <Text style={styles.cartTotal}>{formatCurrency(totalPagar)}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.payAllButton}
                        onPress={handleReviewPayment}
                        disabled={loading}
                        accessibilityLabel="Pagar dívidas selecionadas"
                    >
                        <Text style={styles.payAllButtonText}>{'REVER E PAGAR'}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
