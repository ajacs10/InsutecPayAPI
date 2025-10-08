// app/telas/servicos/PropinaScreen.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, FlatList, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';

// --- IMPORTS DO SEU PROJETO ---
import { useAuth } from '../../../components/AuthContext';
// Simule estes imports se necessário
// import { COLORS, sharedStyles } from '../../../styles/_SharedFinance.styles'; 
// import { propinaStyles } from '../../../styles/_Propina.styles'; 
// import { formatCurrency } from '../../../src/utils/formatters';

// DUMMY DATA/FUNCTIONS para compilação e estilos
const formatCurrency = (value: number) => value.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 2 });
const MONTHLY_FEE = 75000.00; // Propina Mensal
const DUMMY_ANOS = [2024, 2025];
const DUMMY_MESES_PENDENTES: { [key: number]: string[] } = {
    '2024': ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
    '2025': ['Setembro', 'Outubro', 'Novembro', 'Dezembro']
};
const COLORS: any = { primary: '#1a4a6d', white: '#fff', textDark: '#333', darkBackground: '#1c1c1c', lightBackground: '#f5f5f5' };
const sharedStyles: any = { 
    container: (isDark: boolean) => ({ flex: 1, backgroundColor: isDark ? COLORS.darkBackground : COLORS.lightBackground }), 
    sectionTitle: (isDark: boolean) => ({ fontSize: 18, fontWeight: '600', color: isDark ? COLORS.white : COLORS.textDark, marginBottom: 10 })
};
const propinaStyles: any = {
    container: { flexGrow: 1, padding: 20, backgroundColor: COLORS.lightBackground },
    header: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: 20 },
    section: { marginBottom: 20, padding: 15, backgroundColor: COLORS.white, borderRadius: 10, elevation: 2 },
    selectorContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
    pill: (selected: boolean) => ({ paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 10, marginBottom: 10, backgroundColor: selected ? COLORS.primary : '#e0e0e0' }),
    pillText: (selected: boolean) => ({ color: selected ? COLORS.white : COLORS.textDark, fontWeight: 'bold', fontSize: 14 }),
    monthItem: (selected: boolean) => ({ flex: 1, margin: 5, padding: 15, borderRadius: 8, backgroundColor: selected ? '#2ecc71' : '#f0f0f0', alignItems: 'center', borderWidth: 1, borderColor: selected ? '#2ecc71' : '#ccc' }),
    monthText: (selected: boolean) => ({ color: selected ? COLORS.white : COLORS.textDark, fontWeight: '500' }),
    summaryCard: { padding: 15, backgroundColor: '#e6f7ff', borderRadius: 10, borderWidth: 1, borderColor: '#a0d9ff', marginTop: 15 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    totalLabel: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginTop: 10 },
    totalAmount: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
    payButton: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 8, marginTop: 30, flexDirection: 'row', justifyContent: 'center' },
    payButtonDisabled: { backgroundColor: '#a0a8b3' },
    payButtonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' }
};
const useColorScheme = () => ({ colorScheme: 'light' });


export default function PropinaScreen() {
    const router = useRouter();
    const { aluno } = useAuth();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const [loading, setLoading] = useState(false);
    const [targetStudentId] = useState(aluno?.nr_estudante || 'A-12345'); 
    
    const [selectedAno, setSelectedAno] = useState<number | null>(DUMMY_ANOS[0]);
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

    const mesesPendentes = useMemo(() => {
        if (!selectedAno) return [];
        return DUMMY_MESES_PENDENTES[selectedAno] || [];
    }, [selectedAno]);

    const getSubtotal = useMemo(() => {
        return selectedMonths.length * MONTHLY_FEE;
    }, [selectedMonths]);

    const toggleMonth = useCallback((month: string) => {
        setSelectedMonths(prev => 
            prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]
        );
    }, []);

    const handlePagarComCartao = useCallback(async () => {
        if (!targetStudentId || !selectedAno || getSubtotal === 0) {
            Alert.alert('Atenção', 'Por favor, selecione o ano e os meses que deseja pagar.');
            return;
        }

        setLoading(true);
        
        try {
            const transacaoId = `PROPINA-${targetStudentId}-${Date.now()}`;
            const mesesDescricao = selectedMonths.join(', ');

            // 🛑 ENVIANDO PARA CARTEIRASCREEN
            router.push({
                pathname: '/telas/financeiro/CarteiraScreen',
                params: {
                    id_transacao_unica: transacaoId,
                    // Garante que o valor é uma string com ponto decimal (75000.00)
                    valor_total: getSubtotal.toFixed(2), 
                    descricao: `Propina: ${mesesDescricao} (${selectedAno})`,
                    tipo_servico: 'MENSALIDADE', 
                    estudante_alvo_id: targetStudentId,
                },
            });
            
        } catch (e) {
            Alert.alert('Erro', 'Não foi possível iniciar a transação.');
        } finally {
            setLoading(false);
        }
    }, [targetStudentId, selectedAno, selectedMonths, getSubtotal]);


    const renderMonthItem = ({ item }: { item: string }) => {
        const isSelected = selectedMonths.includes(item);
        return (
            <TouchableOpacity 
                style={propinaStyles.monthItem(isSelected)}
                onPress={() => toggleMonth(item)}
            >
                <Text style={propinaStyles.monthText(isSelected)}>{item}</Text>
                <Text style={propinaStyles.monthText(isSelected)}>{formatCurrency(MONTHLY_FEE)}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={sharedStyles.container(isDarkMode)}>
            <Stack.Screen options={{ title: 'Pagamento de Propina' }} />

            <ScrollView contentContainerStyle={propinaStyles.container}>
                <Text style={propinaStyles.header}>Efetuar Pagamento</Text>
                
                {/* 1. SELEÇÃO DE ALUNO ALVO */}
                <View style={propinaStyles.section}>
                    <Text style={sharedStyles.sectionTitle(isDarkMode)}>Aluno Alvo (ID: {targetStudentId})</Text>
                    <Text>Pagar propinas para: **{aluno?.nome || 'Você'}**</Text>
                </View>

                {/* 2. SELEÇÃO DE ANO LETIVO */}
                <View style={propinaStyles.section}>
                    <Text style={sharedStyles.sectionTitle(isDarkMode)}>Ano Letivo</Text>
                    <View style={propinaStyles.selectorContainer}>
                        {DUMMY_ANOS.map(ano => (
                            <TouchableOpacity
                                key={ano}
                                style={propinaStyles.pill(selectedAno === ano)}
                                onPress={() => { setSelectedAno(ano); setSelectedMonths([]); }}
                            >
                                <Text style={propinaStyles.pillText(selectedAno === ano)}>{ano}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* 3. SELEÇÃO DE MESES PENDENTES */}
                {selectedAno && (
                    <View style={propinaStyles.section}>
                        <Text style={sharedStyles.sectionTitle(isDarkMode)}>Meses Pendentes ({mesesPendentes.length})</Text>
                        
                        {mesesPendentes.length > 0 ? (
                            <FlatList
                                data={mesesPendentes}
                                renderItem={renderMonthItem}
                                keyExtractor={item => item}
                                numColumns={2}
                                scrollEnabled={false}
                            />
                        ) : (
                            <Text style={{ color: '#007bff' }}>Não há propinas pendentes para este ano.</Text>
                        )}
                        
                    </View>
                )}
                
                {/* 4. RESUMO DA COBRANÇA */}
                {getSubtotal > 0 && (
                    <View style={[propinaStyles.section, propinaStyles.summaryCard]}>
                        <Text style={sharedStyles.sectionTitle(isDarkMode)}>Resumo da Transação</Text>
                        <View style={propinaStyles.summaryRow}>
                            <Text style={propinaStyles.totalLabel}>TOTAL A PAGAR:</Text>
                            <Text style={propinaStyles.totalAmount}>{formatCurrency(getSubtotal)}</Text>
                        </View>
                    </View>
                )}
                
                {/* BOTÃO DE PAGAMENTO */}
                <TouchableOpacity
                    style={[
                        propinaStyles.payButton, 
                        (getSubtotal === 0 || loading) && propinaStyles.payButtonDisabled
                    ]}
                    onPress={handlePagarComCartao}
                    disabled={getSubtotal === 0 || loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.white} size="small" />
                    ) : (
                        <>
                            <Feather name="credit-card" size={20} color={COLORS.white} style={{ marginRight: 10 }} />
                            <Text style={propinaStyles.payButtonText}>
                                Pagar {formatCurrency(getSubtotal)}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}
