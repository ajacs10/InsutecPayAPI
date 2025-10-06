import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, TextInput, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';

// Importa os estilos dinâmicos locais
import { propinaStyles } from '../../../styles/_Propina.styles'; 

// Importa COLORS APENAS uma vez, usando o nome de ficheiro exato
// Mantendo o nome original do ficheiro de estilos: _ServicoStyles.style.ts
import { COLORS } from '../../../styles/_ServicoStyles.style'; 

import { formatCurrency } from '../../../src/utils/formatters';

// Mocks (Simulações de API)
const checkPaymentStatus = async (studentId: string): Promise<boolean> => Promise.resolve(false);

const fetchOwedMonths = async (studentId: string, isPaid: boolean): Promise<string[]> => {
    // Meses da guia do utilizador: Novembro/2025 a Julho/2026
    const ACADEMIC_MONTHS = ['Novembro', 'Dezembro', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'];
    
    // Simula que o estudante deve todos estes meses
    return ACADEMIC_MONTHS; 
};

// Ajustando o valor para 42.550 (AOA) conforme a guia
const MONTHLY_FEE = 42550; 


export default function PropinaScreen() {
    const { aluno } = useAuth();
    const { isDarkMode } = useTheme();

    const styles = propinaStyles;

    const [numeroEstudante, setNumeroEstudante] = useState('1234'); // Mantido '1234' para mock
    const [selectedAno, setSelectedAno] = useState<number | null>(2025);
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]); // Inicialmente vazio
    const [owedMonths, setOwedMonths] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const targetStudentId = useMemo(() => numeroEstudante || aluno?.nr_estudante, [numeroEstudante, aluno]);

    useEffect(() => {
        const fetchData = async () => {
            if (!targetStudentId) return;
            setLoading(true);
            try {
                const isPaid = await checkPaymentStatus(targetStudentId);
                const unpaidMonths = await fetchOwedMonths(targetStudentId, isPaid);
                
                setOwedMonths(unpaidMonths);
                // 💡 CORREÇÃO: Define a seleção inicial como vazia (não pré-seleciona)
                setSelectedMonths([]); 

            } catch (e) {
                setError('Erro ao carregar dados de propina.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [targetStudentId]);

    const toggleMonth = (month: string) => {
        setSelectedMonths((prev) =>
            prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
        );
        setError(null);
    };

    const handleSelectAllMonths = () => {
        if (selectedMonths.length === owedMonths.length) {
            // Deselecionar todos
            setSelectedMonths([]);
        } else {
            // Selecionar todos os meses em dívida
            setSelectedMonths(owedMonths);
        }
        setError(null);
    };

    const getSubtotal = useMemo(() => MONTHLY_FEE * selectedMonths.length, [selectedMonths]);

    const handlePagarComCartao = () => {
        if (!targetStudentId || !selectedAno || selectedMonths.length === 0 || getSubtotal === 0) {
            setError('Por favor, verifique se selecionou o estudante, o ano e pelo menos um mês.');
            return;
        }

        const transacaoId = `PROPINA-${targetStudentId}-${Date.now()}`;
        const mesesDescricao = selectedMonths.join(', ');

        // NAVEGAÇÃO: Envia a transação para o ecrã CarteiraScreen para processar o pagamento.
        router.push({
            pathname: '/telas/financeiro/CarteiraScreen',
            params: {
                id_transacao_unica: transacaoId,
                valor_total: getSubtotal.toString(),
                descricao: `Pagamento de Propina: ${mesesDescricao} (${selectedAno}º Ano)`,
            },
        });
    };

    // Função auxiliar para renderizar itens da FlatList
    const renderMonthItem = ({ item }: { item: string }) => {
        const isSelected = selectedMonths.includes(item);
        return (
            <TouchableOpacity
                style={[
                    styles.monthButton(isDarkMode),
                    isSelected && styles.monthButtonSelected(isDarkMode)
                ]}
                onPress={() => toggleMonth(item)}
            >
                <Text style={[
                    styles.monthButtonText(isDarkMode),
                    isSelected && styles.monthButtonTextSelected(isDarkMode)
                ]}>
                    {item}
                </Text>
            </TouchableOpacity>
        );
    };


    if (loading && !owedMonths.length) {
        return (
            <View style={styles.loadingContainer(isDarkMode)}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText(isDarkMode)}>A carregar pendências...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.safeArea(isDarkMode)} contentContainerStyle={{ paddingBottom: 50 }}>
            <View style={styles.container(isDarkMode)}>
                <Text style={styles.sectionTitle(isDarkMode)}>Pagamento de Propina</Text>
                {/* O valor 42550 agora é usado para cálculo e exibição */}
                <Text style={styles.priceText(isDarkMode)}>Valor por mês: {formatCurrency(MONTHLY_FEE)}</Text>

                {/* Input Número do Estudante */}
                <View style={styles.inputContainer(isDarkMode)}>
                    <Text style={styles.label(isDarkMode)}>Número do Estudante</Text>
                    <TextInput
                        style={styles.input(isDarkMode)}
                        value={numeroEstudante}
                        onChangeText={setNumeroEstudante}
                        placeholder="Digite o número do estudante"
                        keyboardType="numeric"
                        placeholderTextColor={isDarkMode ? COLORS.gray : COLORS.lightGray}
                    />
                </View>

                {/* Year Picker */}
                <View style={styles.inputContainer(isDarkMode)}>
                    <Text style={styles.label(isDarkMode)}>Selecionar Ano</Text>
                    <View style={styles.picker(isDarkMode)}>
                        <Picker
                            selectedValue={selectedAno}
                            onValueChange={(value) => setSelectedAno(value)}
                            dropdownIconColor={isDarkMode ? COLORS.primary : COLORS.textDark}
                            style={{ color: isDarkMode ? COLORS.textLight : COLORS.textDark }}
                        >
                            <Picker.Item label="Selecione o ano" value={null} />
                            {[2025, 2026].map((ano) => (<Picker.Item key={ano} label={`${ano}º Ano`} value={ano} />))}
                        </Picker>
                    </View>
                </View>

                {/* Month Selection */}
                {selectedAno && (
                    <View style={styles.sectionContainer(isDarkMode)}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingHorizontal: 10 }}>
                            <Text style={styles.sectionTitle(isDarkMode)}>Meses Pendentes ({owedMonths.length})</Text>
                            {owedMonths.length > 0 && (
                                <TouchableOpacity onPress={handleSelectAllMonths}>
                                    <Text style={styles.selectAllText}>
                                        {selectedMonths.length === owedMonths.length ? 'Deselecionar Todos' : 'Selecionar Todos'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Listar os meses em dívida */}
                        <FlatList
                            data={owedMonths}
                            keyExtractor={(item) => item}
                            numColumns={2}
                            columnWrapperStyle={styles.monthList}
                            renderItem={renderMonthItem}
                            ListEmptyComponent={<Text style={styles.emptyText(isDarkMode)}>Nenhum mês pendente.</Text>}
                        />
                    </View>
                )}

                {/* Total e Botão Final */}
                {getSubtotal > 0 && (
                    <View style={styles.summaryContainer(isDarkMode)}>
                        <Text style={styles.totalText(isDarkMode)}>Total a Pagar:</Text>
                        <Text style={styles.totalValue(isDarkMode)}>{formatCurrency(getSubtotal)}</Text>
                    </View>
                )}

                {error && (<Text style={styles.error(isDarkMode)}>{error}</Text>)}

                <TouchableOpacity
                    style={[
                        styles.payButton,
                        getSubtotal === 0 && styles.payButtonDisabled
                    ]}
                    onPress={handlePagarComCartao}
                    disabled={getSubtotal === 0}
                >
                    <Text style={styles.payButtonText}>PAGAR COM CARTÃO ({formatCurrency(getSubtotal)}) <FontAwesome name="credit-card" size={16} color={COLORS.dark} /></Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
