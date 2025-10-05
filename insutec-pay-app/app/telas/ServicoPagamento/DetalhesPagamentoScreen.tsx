import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, FlatList, Pressable, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';
import { styles, COLORS } from '../../../styles/_ServicoStyles.style.ts';
import { formatCurrency } from '../../../src/utils/formatters';
import { Servico } from './HomeScreen';

// Mock function to check payment status
const checkPaymentStatus = async (studentId: string): Promise<boolean> => {
    console.log('Checking payment status for student:', studentId);
    return true; // Assume some months paid for demo
};

// Mock function to fetch owed months
const fetchOwedMonths = async (studentId: string, paymentStatus: boolean): Promise<string[]> => {
    const ACADEMIC_MONTHS = [
        'Novembro', 'Dezembro', 'Janeiro', 'Fevereiro',
        'Março', 'Abril', 'Maio', 'Junho', 'Julho'
    ];
    const months = paymentStatus ? ACADEMIC_MONTHS.slice(4) : ACADEMIC_MONTHS;
    console.log('Owed months for student', studentId, ':', months);
    return months;
};

// Tela de Detalhes de Pagamento
export default function DetalhesPagamentoScreen() {
    const { aluno } = useAuth();
    const { isDarkMode } = useTheme();
    const { servico } = useLocalSearchParams();

    let parsedServico: Servico | null = null;
    if (servico) {
        try {
            parsedServico = JSON.parse(servico as string);
            console.log('Parsed Servico:', parsedServico);
        } catch (e) {
            console.error('Error parsing servico:', e);
        }
    }

    const [numeroEstudante, setNumeroEstudante] = useState(aluno?.nr_estudante || '');
    const [selectedAno, setSelectedAno] = useState<number | null>(null);
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<boolean>(false);
    const [owedMonths, setOwedMonths] = useState<string[]>([]);

    // Fetch global data
    useEffect(() => {
        const fetchData = async () => {
            if (numeroEstudante && aluno) {
                const isPaid = await checkPaymentStatus(numeroEstudante);
                setPaymentStatus(isPaid);

                if (parsedServico?.nome === 'Propina') {
                    const unpaidMonths = await fetchOwedMonths(numeroEstudante, isPaid);
                    setOwedMonths(unpaidMonths);
                }
            }
        };
        fetchData();
    }, [numeroEstudante, aluno, parsedServico]);

    // Handle month selection
    const toggleMonth = (month: string) => {
        setSelectedMonths((prev) => {
            const newMonths = prev.includes(month)
                ? prev.filter((m) => m !== month)
                : [...prev, month];
            console.log('Toggling month:', month, 'New months:', newMonths);
            return newMonths;
        });
    };

    // Handle quantity adjustment
    const adjustQuantity = (increment: boolean) => {
        setQuantity((prev) => Math.max(1, prev + (increment ? 1 : -1)));
    };

    // Calculate subtotal
    const getSubtotal = () => {
        if (!parsedServico) return 0;
        if (parsedServico.nome === 'Propina' && selectedAno) {
            const monthlyFee = 45550;
            return monthlyFee * selectedMonths.length;
        }
        if (['Declaração com Notas', 'Declaração sem Notas'].includes(parsedServico.nome)) {
            return (parsedServico.valor || 0) * quantity;
        }
        return parsedServico.valor || 0;
    };

    // Handle payment confirmation
    const handlePagar = () => {
        if (!numeroEstudante) {
            setError('Por favor, insira o número do estudante.');
            return;
        }
        if (!parsedServico) {
            setError('Nenhum serviço selecionado.');
            return;
        }
        let errorMsg = '';
        if (parsedServico.nome === 'Propina') {
            if (!selectedAno) errorMsg += 'Selecione o ano para Propina. ';
            if (!selectedMonths.length) errorMsg += 'Selecione pelo menos um mês para Propina. ';
        } else if (['Declaração com Notas', 'Declaração sem Notas'].includes(parsedServico.nome)) {
            if (quantity < 1) errorMsg += `Selecione uma quantidade válida para ${parsedServico.nome}. `;
        }
        if (errorMsg) {
            setError(errorMsg);
            return;
        }

        const total = getSubtotal();
        const servicoData = {
            ...parsedServico,
            valor: total,
            selectedMonths: parsedServico.nome === 'Propina' ? selectedMonths : undefined,
            quantity: ['Declaração com Notas', 'Declaração sem Notas'].includes(parsedServico.nome) ? quantity : undefined,
        };

        Alert.alert(
            'Confirmação de Pagamento',
            `Total a pagar: ${formatCurrency(total)}. \nDeseja continuar para a página de Pagamento?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar e Pagar',
                    onPress: () => {
                        router.push({
                            pathname: '/telas/dividas/DividasScreen',
                            params: {
                                servicos: JSON.stringify([servicoData]),
                                alunoId: numeroEstudante,
                            },
                        });
                    },
                },
            ]
        );
    };

    // Render month item
    const renderMonthItem = ({ item }: { item: string }) => (
        <Pressable
            style={[
                styles.monthButton(isDarkMode),
                selectedMonths.includes(item) && styles.monthButtonSelected(isDarkMode),
            ]}
            onPress={() => toggleMonth(item)}
        >
            <Text
                style={[
                    styles.monthButtonText(isDarkMode),
                    selectedMonths.includes(item) && styles.monthButtonTextSelected(isDarkMode),
                ]}
            >
                {item}
            </Text>
        </Pressable>
    );

    // Botão para selecionar todos os meses
    const handleSelectAllMonths = () => {
        setSelectedMonths(owedMonths);
    };

    if (!parsedServico) {
        return (
            <View style={styles.container(isDarkMode)}>
                <Text style={styles.error(isDarkMode)}>Erro: Nenhum serviço selecionado.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container(isDarkMode)}>
            <View style={styles.sectionContainer(isDarkMode)}>
                <Text style={styles.sectionTitle(isDarkMode)}>{parsedServico.nome}</Text>
                <Text style={styles.priceText(isDarkMode)}>
                    Valor:{' '}
                    {parsedServico.nome === 'Propina'
                        ? formatCurrency(selectedAno ? 45550 : 0)
                        : formatCurrency(parsedServico.valor || 0)}
                </Text>

                {/* Student Number Input */}
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

                {/* Year Picker for Propina */}
                {parsedServico.nome === 'Propina' && (
                    <View style={styles.inputContainer(isDarkMode)}>
                        <Text style={styles.label(isDarkMode)}>Selecionar Ano</Text>
                        <View style={styles.picker(isDarkMode)}>
                            <Picker
                                selectedValue={selectedAno}
                                onValueChange={(value) => setSelectedAno(value)}
                                itemStyle={{ color: isDarkMode ? COLORS.white : COLORS.textDark }}
                            >
                                <Picker.Item label="Selecione o ano" value={null} />
                                {aluno?.programa?.toLowerCase().includes('engenharia informática')
                                    ? [1, 2, 3, 4].map((ano) => (
                                          <Picker.Item key={ano} label={`${ano}º Ano`} value={ano} />
                                      ))
                                    : [1, 2, 3, 4, 5].map((ano) => (
                                          <Picker.Item key={ano} label={`${ano}º Ano`} value={ano} />
                                      ))}
                            </Picker>
                        </View>
                    </View>
                )}

                {/* Quantity Selection for Declaração */}
                {['Declaração com Notas', 'Declaração sem Notas'].includes(parsedServico.nome) && (
                    <View style={styles.inputContainer(isDarkMode)}>
                        <Text style={styles.label(isDarkMode)}>Quantidade de Documentos</Text>
                        <View style={styles.quantityContainer(isDarkMode)}>
                            <TouchableOpacity
                                style={styles.quantityButton(isDarkMode)}
                                onPress={() => adjustQuantity(false)}
                                disabled={quantity <= 1}
                            >
                                <Text style={styles.quantityButtonText(isDarkMode)}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityText(isDarkMode)}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton(isDarkMode)}
                                onPress={() => adjustQuantity(true)}
                            >
                                <Text style={styles.quantityButtonText(isDarkMode)}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Month Selection for Propina */}
                {parsedServico.nome === 'Propina' && selectedAno && (
                    <View style={styles.inputContainer(isDarkMode)}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.label(isDarkMode)}>
                                Por Pagar ({owedMonths.length} meses)
                            </Text>
                            {owedMonths.length > 0 && (
                                <TouchableOpacity onPress={handleSelectAllMonths}>
                                    <Text style={styles.selectAllText(isDarkMode)}>Selecionar Todos</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <FlatList
                            data={owedMonths}
                            renderItem={renderMonthItem}
                            keyExtractor={(item) => item}
                            numColumns={2}
                            columnWrapperStyle={styles.monthList}
                            ListEmptyComponent={<Text style={styles.error(isDarkMode)}>Nenhum mês pendente.</Text>}
                        />
                    </View>
                )}

                {/* Total */}
                <Text style={styles.totalText(isDarkMode)}>
                    Total: {formatCurrency(getSubtotal())}
                </Text>

                {/* Error Message */}
                {error && (
                    <Text style={styles.error(isDarkMode)}>
                        {error}
                    </Text>
                )}

                {/* Pay Button */}
                <TouchableOpacity
                    style={[
                        styles.payButton,
                        (!numeroEstudante || getSubtotal() === 0) && styles.payButtonDisabled,
                    ]}
                    onPress={handlePagar}
                    disabled={!numeroEstudante || getSubtotal() === 0}
                    accessibilityLabel="Continuar para pagamento"
                >
                    <Text style={styles.payButtonText}>
                        Continuar para Pagamento{' '}
                        <FontAwesome name="arrow-right" size={16} color={COLORS.white} />
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
