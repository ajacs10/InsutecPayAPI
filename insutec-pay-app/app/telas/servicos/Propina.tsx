// app/telas/financeiro/PropinaScreen.tsx
import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';
import {
  createPropinaStyles,
  sharedFinanceStyles,
  getMonthItemStyle,
  getMonthTextStyle,
  getMonthPriceStyle,
  COLORS,
  GRADIENT,
} from '../../../styles/_Propina.styles';

const { width } = Dimensions.get('window');

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 2 });

const MONTHLY_FEE = 45550.0;
const FINE_WEEK = 5000.0;
const FINE_MONTH = 10000.0;

const MONTHS_MAP: { [key: string]: number } = {
  Novembro: 11, Dezembro: 12, Janeiro: 1, Fevereiro: 2, Março: 3,
  Abril: 4, Maio: 5, Junho: 6, Julho: 7,
};

const MESES_JA_PAGOS: string[] = [];
const MESES_ACADEMICOS = [
  'Novembro', 'Dezembro', 'Janeiro', 'Fevereiro', 'Março',
  'Abril', 'Maio', 'Junho', 'Julho',
];

const INITIAL_VISIBLE = 3;

export default function PropinaScreen() {
  const router = useRouter();
  const { aluno } = useAuth();
  const { isDarkMode } = useTheme();

  const [loading, setLoading] = useState(false);
  const [targetStudentId] = useState(aluno?.nr_estudante || 'A-12345');
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const styles = useMemo(() => createPropinaStyles(isDarkMode), [isDarkMode]);
  const sharedStyles = useMemo(() => sharedFinanceStyles(isDarkMode), [isDarkMode]);

  const visibleMonths = useMemo(() => {
    return showAll ? MESES_ACADEMICOS : MESES_ACADEMICOS.slice(0, INITIAL_VISIBLE);
  }, [showAll]);

  const getMonthFineInfo = useCallback((month: string) => {
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const targetMonth = MONTHS_MAP[month];

    let academicYear = currentYear;
    if (targetMonth >= 11) academicYear = currentYear;
    else academicYear = currentYear + 1;

    if (academicYear > currentYear || (academicYear === currentYear && targetMonth > currentMonth)) {
      return { hasFine: false, isFuture: true, fineAmount: 0 };
    }

    if (academicYear === currentYear && targetMonth <= currentMonth) {
      if (currentDay >= 11) {
        const weeksLate = Math.ceil((currentDay - 10) / 7);
        return { hasFine: true, isFuture: false, fineAmount: weeksLate * FINE_WEEK };
      }
      return { hasFine: false, isFuture: false, fineAmount: 0 };
    }

    return { hasFine: true, isFuture: false, fineAmount: FINE_MONTH };
  }, []);

  const isMonthPaid = useCallback((month: string) => MESES_JA_PAGOS.includes(month), []);

  const getTotalWithFines = useMemo(() => {
    return selectedMonths.reduce((total, month) => {
      const { fineAmount } = getMonthFineInfo(month);
      return total + MONTHLY_FEE + fineAmount;
    }, 0);
  }, [selectedMonths, getMonthFineInfo]);

  const getTotalFines = useMemo(() => {
    return selectedMonths.reduce((total, month) => {
      const { fineAmount } = getMonthFineInfo(month);
      return total + fineAmount;
    }, 0);
  }, [selectedMonths, getMonthFineInfo]);

  const toggleMonth = useCallback((month: string) => {
    if (isMonthPaid(month)) {
      Alert.alert('Mês Já Pago', `O mês de ${month} já foi pago.`);
      return;
    }
    setSelectedMonths(prev =>
      prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]
    );
  }, [isMonthPaid]);

  const handlePagarComCartao = useCallback(async () => {
    if (selectedMonths.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um mês para pagar.');
      return;
    }

    const paidSelected = selectedMonths.filter(isMonthPaid);
    if (paidSelected.length > 0) {
      Alert.alert('Erro', `Os meses já pagos: ${paidSelected.join(', ')}`);
      return;
    }

    setLoading(true);
    try {
      const transacaoId = `PROPINA-${targetStudentId}-${Date.now()}`;
      const descricao = `Propina: ${selectedMonths.join(', ')} (2025/2026)`;

      router.push({
        pathname: '/telas/financeiro/CarteiraScreen',
        params: {
          id_transacao_unica: transacaoId,
          valor_total: getTotalWithFines.toFixed(2),
          descricao,
          tipo_servico: 'MENSALIDADE',
          estudante_alvo_id: targetStudentId,
          meses_selecionados: selectedMonths.join(','),
          ano_academico: '2025/2026',
          valor_propina: (MONTHLY_FEE * selectedMonths.length).toFixed(2),
          valor_multas: getTotalFines.toFixed(2),
        },
      });
    } catch {
      Alert.alert('Erro', 'Falha ao iniciar pagamento.');
    } finally {
      setLoading(false);
    }
  }, [selectedMonths, targetStudentId, getTotalWithFines, getTotalFines, isMonthPaid, router]);

  const renderMonthItem = ({ item }: { item: string }) => {
    const isSelected = selectedMonths.includes(item);
    const { hasFine, isFuture, fineAmount } = getMonthFineInfo(item);
    const isPaid = isMonthPaid(item);

    return (
      <TouchableOpacity
        style={getMonthItemStyle(styles, isSelected, hasFine, isFuture, isPaid)}
        onPress={() => toggleMonth(item)}
        disabled={isPaid}
        activeOpacity={0.8}
      >
        <Text style={getMonthTextStyle(styles, isSelected, isPaid)}>{item}</Text>
        <Text style={getMonthPriceStyle(styles, isSelected, isPaid)}>
          {formatCurrency(MONTHLY_FEE)}
        </Text>
        {hasFine && !isPaid && <Text style={styles.fineText}>+ {formatCurrency(fineAmount)}</Text>}
        {isFuture && !isPaid && !isSelected && <Text style={styles.futureText}>Sem multa</Text>}
        {isPaid && <Text style={styles.paidText}>PAGO</Text>}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={sharedStyles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Processando pagamento...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={sharedStyles.safeArea}>
      <Stack.Screen options={{ title: 'Pagamento de Propina 2025/2026' }} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ position: 'relative', marginBottom: 20 }}>
          <LinearGradient colors={GRADIENT.header(isDarkMode)} style={styles.headerGradient} />
          <Text style={styles.header}>Pagamento de Propina</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aluno</Text>
          <Text style={styles.normalText}>ID: {targetStudentId}</Text>
          <Text style={styles.normalText}>Nome: {aluno?.nome || 'Você'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ano Acadêmico 2025/2026</Text>
          <Text style={styles.normalText}>Período: Nov 2025 → Jul 2026</Text>
          <Text style={styles.infoText}>Valor mensal: {formatCurrency(MONTHLY_FEE)}</Text>
          {MESES_JA_PAGOS.length === 0 && (
            <View style={styles.successMessage}>
              <Text style={styles.successText}>Todos os meses disponíveis para pagamento</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecione os Meses</Text>
          <Text style={styles.infoText}>Nov 2025 → Jul 2026</Text>

          <FlatList
            data={visibleMonths}
            renderItem={renderMonthItem}
            keyExtractor={item => item}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={styles.monthsGrid}
          />

          {/* BOTÃO VER MAIS — FUNCIONA 100% */}
          {MESES_ACADEMICOS.length > INITIAL_VISIBLE && (
            <TouchableOpacity
              onPress={() => setShowAll(prev => !prev)}
              style={styles.showToggleButton}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={GRADIENT.showMore(isDarkMode)}
                style={StyleSheet.absoluteFillObject}
              />
              <Text style={styles.showToggleText}>
                {showAll ? 'Ver menos' : `Ver mais ${MESES_ACADEMICOS.length - INITIAL_VISIBLE} meses`}
              </Text>
              <Feather
                name={showAll ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#fff"
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          )}

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

          <Text style={styles.infoText}>Multas aplicadas a partir do dia 11 de cada mês</Text>
        </View>

        {selectedMonths.length > 0 && (
          <LinearGradient colors={GRADIENT.summaryCard(isDarkMode)} style={[styles.section, styles.summaryCard]}>
            <Text style={styles.sectionTitle}>Resumo</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>
                Propina ({selectedMonths.length} {selectedMonths.length === 1 ? 'mês' : 'meses'}):
              </Text>
              <Text style={styles.summaryText}>{formatCurrency(MONTHLY_FEE * selectedMonths.length)}</Text>
            </View>
            {getTotalFines > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>Multas:</Text>
                <Text style={{ color: COLORS.danger, fontWeight: '600' }}>
                  + {formatCurrency(getTotalFines)}
                </Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>TOTAL:</Text>
              <Text style={styles.totalAmount}>{formatCurrency(getTotalWithFines)}</Text>
            </View>
          </LinearGradient>
        )}

        <LinearGradient
          colors={selectedMonths.length === 0 || loading ? GRADIENT.payButtonDisabled : GRADIENT.payButton(isDarkMode)}
          style={[styles.payButton, (selectedMonths.length === 0 || loading) && styles.payButtonDisabled]}
        >
          <TouchableOpacity
            onPress={handlePagarComCartao}
            disabled={selectedMonths.length === 0 || loading}
            style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center' }}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Feather name="credit-card" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.payButtonText}>Pagar {formatCurrency(getTotalWithFines)}</Text>
              </>
            )}
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}
