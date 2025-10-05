// /telas/servicos/Propina.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, TextInput, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';
// Nota: O caminho do estilo foi mantido, mas styles/_ServicoStyles.style.ts parece um nome de ficheiro incorreto (pode ser .style.ts ou _ServicoStyles.ts)
import { styles, COLORS } from '../../../styles/_ServicoStyles.style.ts';
import { formatCurrency } from '../../../src/utils/formatters';

// Mocks: Simulação de API
const MONTHLY_FEE = 45550; // Exemplo de valor

const ACADEMIC_MONTHS = ['Novembro', 'Dezembro', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'];
// Simulação de fetch de meses em dívida (dependendo do estudante e do ano)
const fetchOwedMonths = async (studentId: string, selectedYear: number): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simula delay de rede

    // Lógica Mock: Simula que para o 1º ano deve Novembro e Dezembro, para outros, deve Março em diante
    if (selectedYear === 1 && studentId.endsWith('1234')) {
        return ACADEMIC_MONTHS.slice(0, 2); // Novembro, Dezembro
    }
    if (selectedYear && studentId) {
        return ACADEMIC_MONTHS.slice(4); // Março a Julho
    }

    return [];
};

export default function PropinaScreen() {
    const { aluno } = useAuth();
    const { isDarkMode } = useTheme();
    
    // Estado do Input do Estudante
    const [numeroEstudante, setNumeroEstudante] = useState(aluno?.nr_estudante || '');
    
    // Estados de Seleção e Dados
    const [selectedAno, setSelectedAno] = useState<number | null>(null);
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
    const [owedMonths, setOwedMonths] = useState<string[]>([]);
    
    // Estados de UI
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // O ID de destino é o valor do input ou, se vazio, o ID do aluno logado
    const targetStudentId = useMemo(() => numeroEstudante.trim() || aluno?.nr_estudante, [numeroEstudante, aluno]);

    // Função para reverter o estado
    const resetMonths = useCallback(() => {
        setSelectedMonths([]);
        setOwedMonths([]);
        setError(null);
    }, []);

    // 🌟 CORREÇÃO 1: Adicionar selectedAno como dependência e validar
    useEffect(() => {
        const fetchData = async () => {
            // Apenas faz fetch se tiver ID do estudante E um ano selecionado
            if (!targetStudentId || !selectedAno) {
                resetMonths();
                return;
            }
            
            setLoading(true);
            resetMonths(); // Limpa seleções antes de novo fetch

            try {
                // A simulação de checkPaymentStatus foi removida, pois não é usada
                const unpaidMonths = await fetchOwedMonths(targetStudentId, selectedAno);
                setOwedMonths(unpaidMonths);
            } catch (e) {
                setError('Erro ao carregar dados de propina.');
                setOwedMonths([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [targetStudentId, selectedAno, resetMonths]); // 👈 Dependências ajustadas

    // Lógica para alternar a seleção de meses
    const toggleMonth = (month: string) => {
        setSelectedMonths((prev) => 
            prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
        );
        setError(null);
    };

    const handleSelectAllMonths = () => {
        setSelectedMonths(owedMonths);
        setError(null);
    };

    const getSubtotal = useMemo(() => MONTHLY_FEE * selectedMonths.length, [selectedMonths]);

    // Lógica para Adicionar ao Carrinho (DividasScreen)
    const handleAddToDividas = () => {
        if (!targetStudentId) {
            setError('Por favor, insira o número do estudante.');
            return;
        }
        if (!selectedAno) {
            setError('Selecione o ano académico.');
            return;
        }
        if (selectedMonths.length === 0) {
            setError('Selecione pelo menos um mês a pagar.');
            return;
        }

        const propinasParaDividas = selectedMonths.map(month => ({
            id: `PROPINA-${targetStudentId}-${selectedAno}-${month}`,
            descricao: `Propina - ${month}/${selectedAno}º Ano`,
            valor_base: MONTHLY_FEE,
            valor_total: MONTHLY_FEE, // Sem multa nesta tela de seleção
            data_vencimento: '2025-12-31', // Data de vencimento a ser definida pela API real
        }));

        // 🌟 Melhoria: Passar os dados para a tela de Dívidas/Checkout
        router.push({
            pathname: '/telas/dividas/DividasScreen',
            params: {
                servicosAdicionais: JSON.stringify(propinasParaDividas),
                alunoId: targetStudentId,
            },
        });
    };

    // 🌟 Melhoria: Ecrã de loading mais robusto e só quando está a carregar
    if (loading && !owedMonths.length && targetStudentId && selectedAno) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={[styles.label(isDarkMode), { marginTop: 10 }]}>A procurar meses em dívida...</Text>
            </View>
        );
    }
    
    return (
        <ScrollView style={styles.container(isDarkMode)} contentContainerStyle={{ paddingBottom: 30 }}>
            <Text style={styles.headerTitle(isDarkMode)}>Pagamento de Propina</Text>
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

            {/* Year Picker - Só visível se houver um estudante de destino */}
            {targetStudentId ? (
                <View style={styles.inputContainer(isDarkMode)}>
                    <Text style={styles.label(isDarkMode)}>Selecionar Ano Académico</Text>
                    <View style={styles.picker(isDarkMode)}>
                        <Picker 
                            selectedValue={selectedAno} 
                            onValueChange={(value) => setSelectedAno(value)} 
                            itemStyle={{ color: isDarkMode ? COLORS.white : COLORS.textDark, height: 120 }} // Ajuste de altura para iOS
                        >
                            <Picker.Item label="--- Selecione o Ano ---" value={null} />
                            {[1, 2, 3, 4, 5].map((ano) => (<Picker.Item key={ano} label={`${ano}º Ano`} value={ano} />))}
                        </Picker>
                    </View>
                </View>
            ) : (
                <Text style={[styles.error(isDarkMode), { marginTop: 15 }]}>
                    Por favor, insira o número de estudante para continuar.
                </Text>
            )}


            {/* Month Selection - Só visível se o ano estiver selecionado E não estiver a carregar */}
            {selectedAno && !loading && (
                <View style={styles.inputContainer(isDarkMode)}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={styles.label(isDarkMode)}>Meses em Dívida ({owedMonths.length})</Text>
                        {owedMonths.length > 0 && (
                            <TouchableOpacity onPress={handleSelectAllMonths}>
                                <Text style={styles.selectAllText(isDarkMode)}>Selecionar Todos</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    
                    <FlatList
                        data={owedMonths}
                        keyExtractor={(item) => item}
                        numColumns={2}
                        columnWrapperStyle={styles.monthList}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.monthButton(isDarkMode), 
                                    selectedMonths.includes(item) && styles.monthButtonSelected(isDarkMode)
                                ]}
                                onPress={() => toggleMonth(item)}
                            >
                                <Text style={[
                                    styles.monthButtonText(isDarkMode), 
                                    selectedMonths.includes(item) && styles.monthButtonTextSelected(isDarkMode)
                                ]}>{item}</Text>
                            </TouchableOpacity>
                        )}
                        // Caso a lista de meses esteja vazia
                        ListEmptyComponent={
                            <View style={{ paddingVertical: 20 }}>
                                <Text style={styles.error(isDarkMode)}>
                                    {owedMonths.length === 0 && targetStudentId && selectedAno 
                                        ? 'Parabéns! Nenhuma propina pendente para este ano.' 
                                        : ''}
                                </Text>
                            </View>
                        }
                    />
                </View>
            )}

            {/* Total e Botão de Ação */}
            <View style={styles.summaryContainer(isDarkMode)}>
                <Text style={styles.totalText(isDarkMode)}>Total a Adicionar: </Text>
                <Text style={styles.totalValue(isDarkMode)}>{formatCurrency(getSubtotal)}</Text>
            </View>

            {error && (<Text style={styles.error(isDarkMode)}>{error}</Text>)}

            <TouchableOpacity
                style={[styles.payButton, (getSubtotal === 0 || loading || !selectedAno) && styles.payButtonDisabled]}
                onPress={handleAddToDividas}
                disabled={getSubtotal === 0 || loading || !selectedAno}
            >
                <Text style={styles.payButtonText}>
                    Adicionar ao Carrinho <FontAwesome name="arrow-right" size={16} color={COLORS.white} />
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
