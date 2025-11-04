// app/telas/ServicoPagamento/ServicoPagamentoScreen.tsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    // 💡 IMPORTAÇÕES CORRIGIDAS: Garantindo que 'View', 'Text', etc., estejam definidos
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    FlatList, 
    Alert, 
    ActivityIndicator,
    StyleSheet,
    SafeAreaView
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

// ⚠️ Ajuste estes caminhos conforme a estrutura real do seu projeto
import { useAuth } from '../../../components/AuthContext';
import { useFinance } from '../../../components/FinanceContext';
import { useTheme } from '../ThemeContext/ThemeContext'; 
import { formatCurrency } from '../../../src/utils/formatters';

// --- MOCKS E TIPAGEM ---
// (Você deve substituir MOCK_SERVICOS_DISPONIVEIS pela chamada à sua API)
type ServicoItem = {
    id: string;
    descricao: string;
    valor_base: number;
    valor_total: number; 
    data_vencimento: string;
};

const MOCK_SERVICOS_DISPONIVEIS: ServicoItem[] = [
    { id: '1', descricao: 'Matrícula 2024/2025', valor_base: 50000, valor_total: 50000, data_vencimento: '2024-10-31' },
    { id: '2', descricao: 'Material Escolar', valor_base: 15000, valor_total: 15000, data_vencimento: '2024-12-31' },
    { id: '3', descricao: 'Multa Biblioteca (Atraso)', valor_base: 2500, valor_total: 2500, data_vencimento: '2024-11-15' },
];

// --- COMPONENTE PRINCIPAL ---
export default function ServicoPagamentoScreen() {
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const { saldo, processarPagamento } = useFinance(); // Usando o contexto financeiro
    const { aluno } = useAuth(); // Para obter o ID do aluno

    const [servicos, setServicos] = useState<ServicoItem[]>([]);
    const [selectedServicosIds, setSelectedServicosIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Carrega os serviços disponíveis
    useEffect(() => {
        const fetchServicos = async () => {
            setError(null);
            setLoading(true);
            try {
                // ⚠️ Substitua esta linha pela chamada real à sua API
                await new Promise(resolve => setTimeout(resolve, 1000));
                setServicos(MOCK_SERVICOS_DISPONIVEIS);
            } catch (e) {
                setError('Não foi possível carregar os serviços disponíveis.');
            } finally {
                setLoading(false);
            }
        };
        fetchServicos();
    }, []);

    // Calcula o subtotal dos itens selecionados
    const getSubtotal = useMemo(() => {
        return servicos
            .filter(item => selectedServicosIds.includes(item.id))
            .reduce((sum, item) => sum + item.valor_total, 0);
    }, [selectedServicosIds, servicos]);

    // Função para selecionar/desselecionar um serviço
    const toggleServico = useCallback((id: string) => {
        setSelectedServicosIds(prev => {
            const newIds = prev.includes(id) 
                ? prev.filter(itemId => itemId !== id) 
                : [...prev, id];
            setError(null); // Limpa o erro ao selecionar algo
            return newIds;
        });
    }, []);

    // Função para processar o pagamento
    const handleProcessPayment = async () => {
        if (getSubtotal === 0) {
            setError('Selecione pelo menos um serviço para pagar.');
            return;
        }
        if (saldo < getSubtotal) {
            setError(`Saldo insuficiente. Necessário: ${formatCurrency(getSubtotal)}`);
            Alert.alert('Erro', 'Saldo insuficiente para cobrir os serviços selecionados.');
            return;
        }

        const servicosParaPagar = servicos
            .filter(item => selectedServicosIds.includes(item.id));
        
        // Simular a chamada ao processo de pagamento (usando o Contexto Financeiro)
        // Nota: No mundo real, você faria uma única transação com os detalhes de cada item.
        const descricaoPagamento = `Pagamento de ${servicosParaPagar.length} serviços. Subtotal: ${formatCurrency(getSubtotal)}`;
        
        const success = await processarPagamento(getSubtotal, descricaoPagamento);

        if (success) {
            Alert.alert('Sucesso!', 'Os serviços foram pagos e o comprovativo gerado.');
            // Após o pagamento, navegue para a tela de confirmação ou início
            router.replace('/(tabs)/home'); 
        }
    };
    
    // --- RENDERIZAÇÃO DE ITENS DA LISTA ---
    const renderServicoItem = ({ item }: { item: ServicoItem }) => {
        const isSelected = selectedServicosIds.includes(item.id);
        
        return (
            <TouchableOpacity 
                style={[
                    localStyles.itemContainer(isDarkMode), 
                    isSelected && localStyles.itemContainerSelected(isDarkMode)
                ]}
                onPress={() => toggleServico(item.id)}
            >
                <View style={localStyles.itemInfo}>
                    <Text style={localStyles.itemTitle(isDarkMode)}>{item.descricao}</Text>
                    <Text style={localStyles.itemDate(isDarkMode)}>Vence em: {item.data_vencimento}</Text>
                </View>
                <View style={localStyles.itemValue}>
                    <Text style={localStyles.itemPrice(isDarkMode)}>
                        {formatCurrency(item.valor_total)}
                    </Text>
                    <FontAwesome 
                        name={isSelected ? "check-circle" : "circle-o"} 
                        size={24} 
                        color={isSelected ? COLORS.secondary : COLORS.gray} 
                        style={localStyles.itemIcon}
                    />
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={localStyles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={localStyles.loadingText(isDarkMode)}>A carregar serviços...</Text>
            </View>
        );
    }
    
    return (
        <SafeAreaView style={localStyles.safeArea(isDarkMode)}>
            <Stack.Screen options={{ title: 'Pagamento de Serviços' }} />
            
            <FlatList
                data={servicos}
                keyExtractor={(item) => item.id}
                renderItem={renderServicoItem}
                contentContainerStyle={localStyles.listContent}
                ListHeaderComponent={() => (
                    <View style={localStyles.header}>
                        <Text style={localStyles.sectionTitle(isDarkMode)}>Serviços Pendentes</Text>
                        {error && (<Text style={localStyles.errorText(isDarkMode)}>{error}</Text>)}
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View style={localStyles.emptyContainer}>
                        <Text style={localStyles.infoText(isDarkMode)}>Não há serviços pendentes no momento.</Text>
                    </View>
                )}
            />

            {/* Rodapé Fixo com Total e Botão */}
            <View style={localStyles.footerContainer(isDarkMode)}>
                <View style={localStyles.totalRow}>
                    <Text style={localStyles.totalLabel(isDarkMode)}>Subtotal ({selectedServicosIds.length})</Text>
                    <Text style={localStyles.totalValue(isDarkMode)}>{formatCurrency(getSubtotal)}</Text>
                </View>
                
                <TouchableOpacity
                    style={[
                        localStyles.payButton, 
                        (getSubtotal === 0 || saldo < getSubtotal) && localStyles.payButtonDisabled
                    ]}
                    onPress={handleProcessPayment}
                    disabled={getSubtotal === 0 || saldo < getSubtotal}
                >
                    <Text style={localStyles.payButtonText}>Pagar Agora</Text>
                    <FontAwesome name="lock" size={18} color={COLORS.white} style={{ marginLeft: 10 }}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// --- ESTILOS (DEFINIDOS LOCALMENTE PARA CLAREZA) ---

const COLORS = {
    primary: '#1a4a6d', // Azul Escuro
    secondary: '#2ecc71', // Verde
    white: '#ffffff',
    textDark: '#333333',
    gray: '#999999',
    lightGray: '#f0f0f0',
    darkBackground: '#1c1c1c',
    lightBackground: '#f5f5f5',
    error: '#e74c3c',
    selected: '#eaf4ff',
    darkBorder: '#333333',
};

const localStyles = StyleSheet.create({
    safeArea: (isDark: boolean) => ({
        flex: 1,
        backgroundColor: isDark ? COLORS.darkBackground : COLORS.lightBackground,
    }),
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: (isDark: boolean) => ({
        marginTop: 10,
        color: isDark ? COLORS.white : COLORS.textDark,
        fontSize: 16,
    }),
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 120, // Espaço para o rodapé
    },
    header: {
        marginBottom: 10,
        paddingTop: 10,
    },
    sectionTitle: (isDark: boolean) => ({
        fontSize: 22,
        fontWeight: 'bold',
        color: isDark ? COLORS.white : COLORS.textDark,
        marginBottom: 15,
    }),
    emptyContainer: {
        marginTop: 50,
        alignItems: 'center',
    },
    infoText: (isDark: boolean) => ({
        color: isDark ? COLORS.gray : COLORS.textDark,
        fontSize: 16,
    }),
    errorText: (isDark: boolean) => ({
        color: COLORS.error,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
    }),
    // Item da Lista
    itemContainer: (isDark: boolean) => ({
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
        backgroundColor: isDark ? COLORS.darkBorder : COLORS.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: isDark ? COLORS.darkBorder : COLORS.lightGray,
        shadowColor: isDark ? '#000' : '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    }),
    itemContainerSelected: (isDark: boolean) => ({
        borderColor: COLORS.primary,
        backgroundColor: isDark ? COLORS.darkBorder : COLORS.selected,
        borderWidth: 2,
    }),
    itemInfo: {
        flex: 3,
    },
    itemTitle: (isDark: boolean) => ({
        fontSize: 16,
        fontWeight: '600',
        color: isDark ? COLORS.white : COLORS.textDark,
        marginBottom: 4,
    }),
    itemDate: (isDark: boolean) => ({
        fontSize: 12,
        color: isDark ? COLORS.gray : COLORS.gray,
    }),
    itemValue: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    itemPrice: (isDark: boolean) => ({
        fontSize: 16,
        fontWeight: 'bold',
        color: isDark ? COLORS.secondary : COLORS.primary,
        marginRight: 10,
    }),
    itemIcon: {
        marginLeft: 5,
    },
    // Rodapé
    footerContainer: (isDark: boolean) => ({
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        backgroundColor: isDark ? COLORS.darkBackground : COLORS.white,
        borderTopWidth: 1,
        borderTopColor: isDark ? COLORS.darkBorder : COLORS.lightGray,
        elevation: 10,
    }),
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    totalLabel: (isDark: boolean) => ({
        fontSize: 16,
        color: isDark ? COLORS.white : COLORS.textDark,
        fontWeight: '500',
    }),
    totalValue: (isDark: boolean) => ({
        fontSize: 22,
        fontWeight: 'bold',
        color: isDark ? COLORS.secondary : COLORS.primary,
    }),
    payButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        borderRadius: 10,
    },
    payButtonDisabled: {
        backgroundColor: COLORS.gray,
        opacity: 0.8,
    },
    payButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
