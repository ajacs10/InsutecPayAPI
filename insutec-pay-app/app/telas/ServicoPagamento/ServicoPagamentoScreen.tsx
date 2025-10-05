// /telas/servicos/Propina.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, TextInput, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';
import { styles, COLORS } from '../../../styles/_ServicoStyles.style.ts';
import { formatCurrency } from '../../../src/utils/formatters';

// Mocks
const checkPaymentStatus = async (studentId: string): Promise<boolean> => Promise.resolve(true); 
const fetchOwedMonths = async (studentId: string, isPaid: boolean): Promise<string[]> => {
    const ACADEMIC_MONTHS = ['Novembro', 'Dezembro', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'];
    return isPaid ? ACADEMIC_MONTHS.slice(4) : ACADEMIC_MONTHS; // Exemplo: Devolve Março em diante
};

const MONTHLY_FEE = 45550; // Exemplo de valor

export default function PropinaScreen() {
    const { aluno } = useAuth();
    const { isDarkMode } = useTheme();
    
    const [numeroEstudante, setNumeroEstudante] = useState(aluno?.nr_estudante || '');
    const [selectedAno, setSelectedAno] = useState<number | null>(null);
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
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
        setSelectedMonths(owedMonths);
        setError(null);
    };

    const getSubtotal = useMemo(() => MONTHLY_FEE * selectedMonths.length, [selectedMonths]);

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
            valor_total: MONTHLY_FEE, // Sem multa na tela de seleção
            data_vencimento: '2025-12-31', // Data de vencimento a ser definida
        }));

        router.push({
            pathname: '/telas/dividas/DividasScreen',
            params: {
                servicosAdicionais: JSON.stringify(propinasParaDividas),
                alunoId: targetStudentId,
            },
        });
    };

    // ... (restante do código de renderização do MonthItem, Picker e ScrollView)
    // Devido ao limite de espaço, assumimos que o layout é o da tela original.

    if (loading && !owedMonths.length) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
    }
    
    return (
        <ScrollView style={styles.container(isDarkMode)}>
            <Text style={styles.sectionTitle(isDarkMode)}>Pagamento de Propina</Text>
            <Text style={styles.priceText(isDarkMode)}>Valor por mês: {formatCurrency(MONTHLY_FEE)}</Text>

            {/* Input Número do Estudante */}
            <View style={styles.inputContainer(isDarkMode)}>
                <Text style={styles.label(isDarkMode)}>Número do Estudante</Text>
                <TextInput style={styles.input(isDarkMode)} value={numeroEstudante} onChangeText={setNumeroEstudante} placeholder="Digite o número do estudante" keyboardType="numeric" placeholderTextColor={isDarkMode ? COLORS.gray : COLORS.lightGray} />
            </View>

            {/* Year Picker */}
            <View style={styles.inputContainer(isDarkMode)}>
                <Text style={styles.label(isDarkMode)}>Selecionar Ano</Text>
                <View style={styles.picker(isDarkMode)}>
                    <Picker selectedValue={selectedAno} onValueChange={(value) => setSelectedAno(value)} itemStyle={{ color: isDarkMode ? COLORS.white : COLORS.textDark }}>
                        <Picker.Item label="Selecione o ano" value={null} />
                        {[1, 2, 3, 4, 5].map((ano) => (<Picker.Item key={ano} label={`${ano}º Ano`} value={ano} />))}
                    </Picker>
                </View>
            </View>

            {/* Month Selection */}
            {selectedAno && (
                <View style={styles.inputContainer(isDarkMode)}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.label(isDarkMode)}>Por Pagar ({owedMonths.length} meses)</Text>
                        {owedMonths.length > 0 && (<TouchableOpacity onPress={handleSelectAllMonths}><Text style={styles.selectAllText(isDarkMode)}>Selecionar Todos</Text></TouchableOpacity>)}
                    </View>
                    <FlatList
                        data={owedMonths}
                        keyExtractor={(item) => item}
                        numColumns={2}
                        columnWrapperStyle={styles.monthList}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.monthButton(isDarkMode), selectedMonths.includes(item) && styles.monthButtonSelected(isDarkMode)]}
                                onPress={() => toggleMonth(item)}
                            >
                                <Text style={[styles.monthButtonText(isDarkMode), selectedMonths.includes(item) && styles.monthButtonTextSelected(isDarkMode)]}>{item}</Text>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={<Text style={styles.error(isDarkMode)}>Nenhum mês pendente.</Text>}
                    />
                </View>
            )}

            {/* Total e Botão */}
            <Text style={styles.totalText(isDarkMode)}>Total Selecionado: {formatCurrency(getSubtotal)}</Text>
            {error && (<Text style={styles.error(isDarkMode)}>{error}</Text>)}

            <TouchableOpacity
                style={[styles.payButton, getSubtotal === 0 && styles.payButtonDisabled]}
                onPress={handleAddToDividas}
                disabled={getSubtotal === 0}
            >
                <Text style={styles.payButtonText}>Adicionar ao Carrinho ({formatCurrency(getSubtotal)}) <FontAwesome name="arrow-right" size={16} color={COLORS.white} /></Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
