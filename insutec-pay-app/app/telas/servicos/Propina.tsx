import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, FlatList, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

// --- IMPORTS DO SEU PROJETO ---
import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';
import { 
    createPropinaStyles, 
    sharedFinanceStyles,
    getMonthItemStyle,
    getMonthTextStyle,
    getMonthPriceStyle,
    COLORS 
} from '../../../styles/_Propina.styles';

// DUMMY DATA/FUNCTIONS
const formatCurrency = (value: number) => value.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 2 });
const MONTHLY_FEE = 45550.00;
const FINE_WEEK = 5000.00;
const FINE_MONTH = 10000.00;

// Mapeamento de meses para números
const MONTHS_MAP: { [key: string]: number } = {
    'Novembro': 11, 'Dezembro': 12,
    'Janeiro': 1, 'Fevereiro': 2, 'Março': 3, 'Abril': 4, 'Maio': 5, 'Junho': 6, 'Julho': 7
};

// Meses já pagos pelo usuário (vazio - usuário ainda não pagou nenhum mês)
const MESES_JA_PAGOS: string[] = [];

export default function PropinaScreen() {
    const router = useRouter();
    const { aluno } = useAuth();
    const { isDarkMode } = useTheme();

    const [loading, setLoading] = useState(false);
    const [targetStudentId] = useState(aluno?.nr_estudante || 'A-12345'); 
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

    // Criar estilos dinâmicos baseados no tema
    const styles = useMemo(() => createPropinaStyles(isDarkMode), [isDarkMode]);
    const sharedStyles = useMemo(() => sharedFinanceStyles(isDarkMode), [isDarkMode]);

    // Todos os meses do ano acadêmico 2025/2026 (começa em Novembro)
    const MESES_ACADEMICOS = ['Novembro', 'Dezembro', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'];

    // Função para verificar se um mês tem multa
    const getMonthFineInfo = useCallback((month: string) => {
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        
        const targetMonth = MONTHS_MAP[month];
        
        // Determinar o ano do mês acadêmico
        let academicYear = currentYear;
        if (targetMonth >= 11) {
            academicYear = currentYear;
        } else {
            academicYear = currentYear + 1;
        }
        
        // Se for mês futuro, não tem multa
        if (academicYear > currentYear || (academicYear === currentYear && targetMonth > currentMonth)) {
            return { hasFine: false, isFuture: true, fineAmount: 0 };
        }
        
        // Se for mês atual ou passado
        if (academicYear === currentYear && targetMonth <= currentMonth) {
            if (currentDay >= 11) {
                const weeksLate = Math.ceil((currentDay - 10) / 7);
                const fineAmount = weeksLate * FINE_WEEK;
                return { hasFine: true, isFuture: false, fineAmount };
            } else {
                return { hasFine: false, isFuture: false, fineAmount: 0 };
            }
        }
        
        // Mês passado - multa fixa
        return { hasFine: true, isFuture: false, fineAmount: FINE_MONTH };
    }, []);

    // Verificar se mês já foi pago
    const isMonthPaid = useCallback((month: string) => {
        return MESES_JA_PAGOS.includes(month);
    }, []);

    // Calcular total com multas
    const getTotalWithFines = useMemo(() => {
        let total = 0;
        selectedMonths.forEach(month => {
            const fineInfo = getMonthFineInfo(month);
            total += MONTHLY_FEE + fineInfo.fineAmount;
        });
        return total;
    }, [selectedMonths, getMonthFineInfo]);

    // Calcular total de multas
    const getTotalFines = useMemo(() => {
        let fines = 0;
        selectedMonths.forEach(month => {
            const fineInfo = getMonthFineInfo(month);
            fines += fineInfo.fineAmount;
        });
        return fines;
    }, [selectedMonths, getMonthFineInfo]);

    const toggleMonth = useCallback((month: string) => {
        if (isMonthPaid(month)) {
            Alert.alert('Mês Já Pago', `O mês de ${month} já foi pago. Não é possível pagar novamente.`);
            return;
        }
        
        setSelectedMonths(prev => 
            prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]
        );
    }, [isMonthPaid]);

    const handlePagarComCartao = useCallback(async () => {
        if (!targetStudentId || selectedMonths.length === 0) {
            Alert.alert('Atenção', 'Por favor, selecione os meses que deseja pagar.');
            return;
        }

        const mesesJaPagosSelecionados = selectedMonths.filter(month => isMonthPaid(month));
        if (mesesJaPagosSelecionados.length > 0) {
            Alert.alert('Erro', `Os seguintes meses já foram pagos: ${mesesJaPagosSelecionados.join(', ')}`);
            return;
        }

        setLoading(true);
        
        try {
            const transacaoId = `PROPINA-${targetStudentId}-${Date.now()}`;
            const mesesDescricao = selectedMonths.join(', ');

            router.push({
                pathname: '/telas/financeiro/CarteiraScreen',
                params: {
                    id_transacao_unica: transacaoId,
                    valor_total: getTotalWithFines.toFixed(2),
                    descricao: `Propina: ${mesesDescricao} (Ano Acadêmico 2025/2026)`,
                    tipo_servico: 'MENSALIDADE', 
                    estudante_alvo_id: targetStudentId,
                    meses_selecionados: selectedMonths.join(','),
                    ano_academico: '2025/2026',
                    valor_propina: (MONTHLY_FEE * selectedMonths.length).toFixed(2),
                    valor_multas: getTotalFines.toFixed(2)
                },
            });
            
        } catch (e) {
            Alert.alert('Erro', 'Não foi possível iniciar a transação.');
        } finally {
            setLoading(false);
        }
    }, [targetStudentId, selectedMonths, getTotalWithFines, getTotalFines, isMonthPaid]);

    const renderMonthItem = ({ item }: { item: string }) => {
        const isSelected = selectedMonths.includes(item);
        const fineInfo = getMonthFineInfo(item);
        const isPaid = isMonthPaid(item);
        
        return (
            <TouchableOpacity 
                style={getMonthItemStyle(styles, isSelected, fineInfo.hasFine, fineInfo.isFuture, isPaid)}
                onPress={() => toggleMonth(item)}
                disabled={isPaid}
            >
                <Text style={getMonthTextStyle(styles, isSelected, isPaid)}>{item}</Text>
                <Text style={getMonthPriceStyle(styles, isSelected, isPaid)}>{formatCurrency(MONTHLY_FEE)}</Text>
                
                {fineInfo.hasFine && !isPaid && (
                    <Text style={styles.fineText}>+ {formatCurrency(fineInfo.fineAmount)}</Text>
                )}
                
                {fineInfo.isFuture && !isPaid && (
                    <Text style={styles.futureText}>Sem multa</Text>
                )}
                
                {isPaid && (
                    <Text style={styles.paidText}>JÁ PAGO</Text>
                )}
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Processando pagamento...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={sharedStyles.safeArea}>
            <Stack.Screen options={{ title: 'Pagamento de Propina 2025/2026' }} />

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Pagamento de Propina 2025/2026</Text>
                
                {/* 1. SELEÇÃO DE ALUNO ALVO */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Aluno : {targetStudentId}</Text>
                    <Text style={styles.normalText}>Nome: {aluno?.nome || 'Você'}</Text>
                </View>

                {/* 2. INFORMAÇÕES DO ANO ACADÊMICO */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ano Acadêmico 2025/2026</Text>
                    <Text style={styles.normalText}>Período: Novembro 2025 a Julho 2026</Text>
                    <Text style={styles.infoText}>Valor mensal: {formatCurrency(MONTHLY_FEE)}</Text>
                    
                    {MESES_JA_PAGOS.length === 0 && (
                        <View style={styles.successMessage}>
                            <Text style={styles.successText}>✅ Você pode pagar todos os meses disponíveis</Text>
                        </View>
                    )}
                </View>

                {/* 3. SELEÇÃO DE MESES DISPONÍVEIS */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Meses Disponíveis</Text>
                    <Text style={styles.infoText}>Nov 2025 - Jul 2026</Text>
                    
                    <View style={styles.monthsContainer}>
                        <FlatList
                            data={MESES_ACADEMICOS}
                            renderItem={renderMonthItem}
                            keyExtractor={item => item}
                            numColumns={3}
                            scrollEnabled={false}
                            contentContainerStyle={styles.monthsGrid}
                        />
                    </View>
                    
                    {/* Legenda */}
                    <View style={styles.legendContainer}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: COLORS.success }]} />
                            <Text style={styles.legendText}>Sem multa</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: COLORS.warning }]} />
                            <Text style={styles.legendText}>Com multa</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: COLORS.disabled }]} />
                            <Text style={styles.legendText}>Já pago</Text>
                        </View>
                    </View>

                    <Text style={styles.infoText}>
                        💡 Multas aplicadas a partir do dia 11 de cada mês
                    </Text>
                </View>
                
                {/* 4. RESUMO DA COBRANÇA */}
                {selectedMonths.length > 0 && (
                    <View style={[styles.section, styles.summaryCard]}>
                        <Text style={styles.sectionTitle}>Resumo da Transação</Text>
                        
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>Propina ({selectedMonths.length} meses):</Text>
                            <Text style={styles.summaryText}>{formatCurrency(MONTHLY_FEE * selectedMonths.length)}</Text>
                        </View>
                        
                        {getTotalFines > 0 && (
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryText}>Multas:</Text>
                                <Text style={{ color: COLORS.danger, fontSize: 14 }}>+ {formatCurrency(getTotalFines)}</Text>
                            </View>
                        )}
                        
                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>TOTAL A PAGAR:</Text>
                            <Text style={styles.totalAmount}>{formatCurrency(getTotalWithFines)}</Text>
                        </View>
                    </View>
                )}
                
                {/* BOTÃO DE PAGAMENTO */}
                <TouchableOpacity
                    style={[
                        styles.payButton, 
                        (selectedMonths.length === 0 || loading) && styles.payButtonDisabled
                    ]}
                    onPress={handlePagarComCartao}
                    disabled={selectedMonths.length === 0 || loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.white} size="small" />
                    ) : (
                        <>
                            <Feather name="credit-card" size={20} color={COLORS.white} style={{ marginRight: 10 }} />
                            <Text style={styles.payButtonText}>
                                Pagar {formatCurrency(getTotalWithFines)}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
