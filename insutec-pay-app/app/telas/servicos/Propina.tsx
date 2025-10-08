// telas/servicos/PropinaScreen.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, TextInput, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';
import { propinaStyles as styles } from '../../../styles/_Propina.styles';
import { COLORS } from '../../../styles/_ServicoStyles.style';
import { formatCurrency } from '../../../src/utils/formatters';

const checkPaymentStatus = async (studentId: string, months: string[]): Promise<{ [key: string]: boolean }> => {
  console.log('[PropinaScreen] Verificando status de pagamento para:', studentId, months);
  const paidMonths = ['Novembro', 'Dezembro'];
  const status: { [key: string]: boolean } = {};
  months.forEach((month) => {
    status[month] = paidMonths.includes(month);
  });
  return Promise.resolve(status);
};

const fetchOwedMonths = async (studentId: string, isPaid: boolean): Promise<string[]> => {
  console.log('[PropinaScreen] Buscando meses pendentes para:', studentId, { isPaid });
  const ACADEMIC_MONTHS = ['Novembro', 'Dezembro', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'];
  return Promise.resolve(ACADEMIC_MONTHS);
};

const MONTHLY_FEE = 42550;

export default function PropinaScreen() {
  const { aluno } = useAuth();
  const { isDarkMode } = useTheme();
  const [numeroEstudante, setNumeroEstudante] = useState(aluno?.nr_estudante || '1234');
  const [selectedAno, setSelectedAno] = useState<number | null>(2025);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [owedMonths, setOwedMonths] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetStudentId = useMemo(() => numeroEstudante || aluno?.nr_estudante, [numeroEstudante, aluno]);

  useEffect(() => {
    const fetchData = async () => {
      if (!targetStudentId) {
        setError('Nenhum estudante selecionado.');
        return;
      }
      setLoading(true);
      try {
        const unpaidMonths = await fetchOwedMonths(targetStudentId, false);
        setOwedMonths(unpaidMonths);
        setSelectedMonths([]);
      } catch (e) {
        setError('Erro ao carregar dados de propina.');
        console.error('[PropinaScreen] Erro ao buscar meses:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [targetStudentId]);

  const toggleMonth = useCallback((month: string) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
    setError(null);
  }, []);

  const handleSelectAllMonths = useCallback(() => {
    if (selectedMonths.length === owedMonths.length) {
      setSelectedMonths([]);
    } else {
      setSelectedMonths(owedMonths);
    }
    setError(null);
  }, [selectedMonths, owedMonths]);

  const getSubtotal = useMemo(() => MONTHLY_FEE * selectedMonths.length, [selectedMonths]);

  const handlePagarComCartao = useCallback(async () => {
    if (!targetStudentId || !selectedAno || selectedMonths.length === 0 || getSubtotal === 0) {
      setError('Por favor, verifique se selecionou o estudante, o ano e pelo menos um mês.');
      Alert.alert('Erro', 'Por favor, verifique se selecionou o estudante, o ano e pelo menos um mês.');
      return;
    }

    setLoading(true);
    try {
      const paymentStatus = await checkPaymentStatus(targetStudentId, selectedMonths);
      const paidMonths = selectedMonths.filter((month) => paymentStatus[month]);
      const unpaidMonths = selectedMonths.filter((month) => !paymentStatus[month]);
      const transacaoId = `PROPINA-${targetStudentId}-${Date.now()}`;
      const mesesDescricao = selectedMonths.join(', ');

      if (paidMonths.length > 0) {
        const message =
          paidMonths.length === selectedMonths.length
            ? `Os meses ${paidMonths.join(', ')} já foram pagos. Deseja visualizar o comprovativo?`
            : `Os meses ${paidMonths.join(', ')} já foram pagos. Deseja visualizar o comprovativo ou continuar com o pagamento de ${unpaidMonths.join(', ')}?`;

        const buttons = [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Ver Comprovativo',
            onPress: () => {
              router.push({
                pathname: '/telas/transacao/[id]',
                params: {
                  id: transacaoId,
                  id_transacao_unica: transacaoId,
                  valor_total: (MONTHLY_FEE * paidMonths.length).toFixed(2),
                  descricao: `Pagamento de Propina: ${paidMonths.join(', ')} (${selectedAno}º Ano)`,
                  metodo_pagamento: 'Cartão Atlântico Universitário+',
                  status: 'SUCESSO',
                  data: new Date().toISOString(),
                },
              });
            },
          },
        ];

        if (unpaidMonths.length > 0) {
          buttons.push({
            text: 'Pagar Restantes',
            onPress: () => {
              router.push({
                pathname: '/telas/financeiro/CarteiraScreen',
                params: {
                  id_transacao_unica: transacaoId,
                  valor_total: (MONTHLY_FEE * unpaidMonths.length).toFixed(2),
                  descricao: `Pagamento de Propina: ${unpaidMonths.join(', ')} (${selectedAno}º Ano)`,
                },
              });
            },
          });
        }

        Alert.alert('Status do Pagamento', message, buttons);
      } else {
        router.push({
          pathname: '/telas/financeiro/CarteiraScreen',
          params: {
            id_transacao_unica: transacaoId,
            valor_total: getSubtotal.toFixed(2),
            descricao: `Pagamento de Propina: ${mesesDescricao} (${selectedAno}º Ano)`,
          },
        });
      }
    } catch (e) {
      setError('Erro ao processar o pagamento.');
      Alert.alert('Erro', 'Não foi possível verificar o status do pagamento.');
    } finally {
      setLoading(false);
    }
  }, [targetStudentId, selectedAno, selectedMonths, getSubtotal]);

  const renderMonthItem = useCallback(
    ({ item }: { item: string }) => {
      const isSelected = selectedMonths.includes(item);
      return (
        <TouchableOpacity
          style={[styles.monthButton(isDarkMode), isSelected && styles.monthButtonSelected(isDarkMode)]}
          onPress={() => toggleMonth(item)}
        >
          <Text style={[styles.monthButtonText(isDarkMode), isSelected && styles.monthButtonTextSelected(isDarkMode)]}>
            {item}
          </Text>
        </TouchableOpacity>
      );
    },
    [isDarkMode, selectedMonths, toggleMonth]
  );

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
        <Text style={styles.priceText(isDarkMode)}>Valor por mês: {formatCurrency(MONTHLY_FEE)}</Text>

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

        <View style={styles.inputContainer(isDarkMode)}>
          <Text style={styles.label(isDarkMode)}>Selecionar Ano</Text>
          <View style={styles.picker(isDarkMode)}>
            <Picker
              selectedValue={selectedAno}
              onValueChange={(value) => setSelectedAno(value)}
              dropdownIconColor={isDarkMode ? COLORS.primary : COLORS.textDark}
              style={{ color: isDarkMode ? COLORS.textLight : COLORS.textDark, fontFamily: 'SpaceMono' }}
            >
              <Picker.Item label="Selecione o ano" value={null} />
              {[2025, 2026].map((ano) => (
                <Picker.Item key={ano} label={`${ano}º Ano`} value={ano} />
              ))}
            </Picker>
          </View>
        </View>

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

        {getSubtotal > 0 && (
          <View style={styles.summaryContainer(isDarkMode)}>
            <Text style={styles.totalText(isDarkMode)}>Total a Pagar:</Text>
            <Text style={styles.totalValue(isDarkMode)}>{formatCurrency(getSubtotal)}</Text>
          </View>
        )}

        {error && <Text style={styles.error(isDarkMode)}>{error}</Text>}

        <TouchableOpacity
          style={[styles.payButton, (getSubtotal === 0 || loading) && styles.payButtonDisabled]}
          onPress={handlePagarComCartao}
          disabled={getSubtotal === 0 || loading}
        >
          <Text style={styles.payButtonText}>
            PAGAR COM CARTÃO ({formatCurrency(getSubtotal)}) <FontAwesome name="credit-card" size={16} color={COLORS.dark} />
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
