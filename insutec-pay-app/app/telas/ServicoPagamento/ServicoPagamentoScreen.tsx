import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Pressable, Switch, Alert, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext'; 
import { formatCurrency } from '../../../src/utils/formatters';
import { styles, COLORS } from '../../../styles/_ServicoStyles.style.ts';
import { Servico, Aluno } from '../../../src/types/index';

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
  ]; // 9 months starting from November
  // Se for pago, começa a contar os meses em dívida a partir de Março (apenas para o mock)
  const months = paymentStatus ? ACADEMIC_MONTHS.slice(4) : ACADEMIC_MONTHS; 
  console.log('Owed months for student', studentId, ':', months);
  return months;
};

export default function ServicoPagamentoScreen() {
  const { aluno } = useAuth();
  // 💥 CORREÇÃO: Usar o tema global. 
  const { isDarkMode, toggleTheme } = useTheme(); 
  
  const { servico } = useLocalSearchParams();
  
  let parsedServicos: Servico[] = [];
  if (servico) {
    try {
      const parsed = JSON.parse(servico as string);
      parsedServicos = Array.isArray(parsed) ? parsed : [parsed];
      parsedServicos = parsedServicos.filter(s => s.nome !== 'Reconfirmação de Matrícula');
      console.log('Parsed Servicos (excluding Matrícula):', parsedServicos);
    } catch (e) {
      console.error('Error parsing servico:', e);
    }
  }
  
  const [numeroEstudante, setNumeroEstudante] = useState(aluno?.nr_estudante || '');
  const [selections, setSelections] = useState<Record<string, {
    selectedAno: number | null;
    selectedMonths: string[];
    quantity: number;
  }>>({});
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<boolean>(false);
  const [owedMonths, setOwedMonths] = useState<string[]>([]);
  // ⚠️ REMOVIDO: const [isDarkMode, setIsDarkMode] = useState(true); 

  // Initialize selections for all services
  useEffect(() => {
    const initialSelections: typeof selections = {};
    parsedServicos.forEach((s) => {
      if (s.nome && !initialSelections[s.nome]) {
        initialSelections[s.nome] = {
          selectedAno: null,
          selectedMonths: [],
          quantity: 1,
        };
      }
    });
    setSelections(initialSelections);
    console.log('Initial Selections:', initialSelections);
  }, [servico]);

  // Fetch global data
  useEffect(() => {
    const fetchData = async () => {
      if (numeroEstudante && aluno) {
        const isPaid = await checkPaymentStatus(numeroEstudante);
        setPaymentStatus(isPaid);

        if (parsedServicos.some((s) => s.nome === 'Propina')) {
          const unpaidMonths = await fetchOwedMonths(numeroEstudante, isPaid);
          setOwedMonths(unpaidMonths);
        }
      }
    };
    fetchData();
  }, [numeroEstudante, aluno, parsedServicos]);

  // Update selection field
  const setSelectionField = (nome: string, field: string, value: any) => {
    setSelections((prev) => ({
      ...prev,
      [nome]: { ...prev[nome], [field]: value },
    }));
  };

  // Handle month selection
  const toggleMonth = (nome: string, month: string) => {
    setSelections((prev) => {
      const currentMonths = prev[nome]?.selectedMonths || [];
      const newMonths = currentMonths.includes(month)
        ? currentMonths.filter((m) => m !== month)
        : [...currentMonths, month];
      console.log('Toggling month:', month, 'for', nome, 'New months:', newMonths);
      return {
        ...prev,
        [nome]: { ...prev[nome], selectedMonths: newMonths },
      };
    });
  };

  // Handle quantity adjustment
  const adjustQuantity = (nome: string, increment: boolean) => {
    setSelections((prev) => ({
      ...prev,
      [nome]: {
        ...prev[nome],
        quantity: Math.max(1, prev[nome].quantity + (increment ? 1 : -1)),
      },
    }));
  };

  // Calculate subtotal for a service
  const getSubtotal = (s: Servico, sel: any) => {
    if (!sel) return 0;
    if (s.nome === 'Propina' && sel.selectedAno) {
      const monthlyFee = 45550; // Fixed to 45,550.00 Kwanza
      return monthlyFee * sel.selectedMonths.length;
    }
    if (['Declaração com nota', 'Declaração sem nota'].includes(s.nome)) {
      return (s.valor || 0) * sel.quantity;
    }
    return s.valor || 0;
  };

  // Calculate grand total
  const calculateTotal = () => {
    let total = 0;
    parsedServicos.forEach((s) => {
      const sel = selections[s.nome];
      total += getSubtotal(s, sel);
    });
    return total;
  };

  // 💥 MELHORIA: Usa o Alert para a Confirmação Final (Ideia 3)
  const handlePagar = () => {
    if (!numeroEstudante) {
      setError('Por favor, insira o número do estudante.');
      return;
    }
    // ... Lógica de validação ... (mantida do teu código)
    let errorMsg = '';
    parsedServicos.forEach((s) => {
      const sel = selections[s.nome];
      if (!sel) {
        errorMsg += `Configuração não encontrada para ${s.nome}. `;
        return;
      }
      if (s.nome === 'Propina') {
        if (!sel.selectedAno) errorMsg += 'Selecione o ano para Propina. ';
        if (!sel.selectedMonths.length) errorMsg += 'Selecione pelo menos um mês para Propina. ';
      } else if (['Declaração com nota', 'Declaração sem nota'].includes(s.nome)) {
        if (sel.quantity < 1) errorMsg += `Selecione uma quantidade válida para ${s.nome}. `;
      }
    });
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    
    const total = calculateTotal();
    const servicosData = parsedServicos.map((s) => ({
      ...s,
      valor: getSubtotal(s, selections[s.nome]),
      selectedMonths: s.nome === 'Propina' ? selections[s.nome].selectedMonths : undefined,
      quantity: ['Declaração com nota', 'Declaração sem nota'].includes(s.nome) ? selections[s.nome].quantity : undefined,
    }));

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
                servicos: JSON.stringify(servicosData),
                alunoId: numeroEstudante,
              },
            });
          },
        },
      ]
    );
  };

  // Render month item
  const renderMonthItem = (nome: string, { item }: { item: string }) => (
    <Pressable
      style={[
        styles.monthButton(isDarkMode), // 💥 REATIVIDADE AQUI
        selections[nome]?.selectedMonths.includes(item) && styles.monthButtonSelected(isDarkMode), // 💥 REATIVIDADE AQUI
      ]}
      onPress={() => toggleMonth(nome, item)}
    >
      <Text
        style={[
          styles.monthButtonText(isDarkMode), // 💥 REATIVIDADE AQUI
          selections[nome]?.selectedMonths.includes(item) && styles.monthButtonTextSelected(isDarkMode), // 💥 REATIVIDADE AQUI
        ]}
      >
        {item}
      </Text>
    </Pressable>
  );
  
  // 💥 MELHORIA: Botão para selecionar todos os meses (Ideia 1)
  const handleSelectAllMonths = (nome: string) => {
    setSelections((prev) => ({
      ...prev,
      [nome]: { ...prev[nome], selectedMonths: owedMonths },
    }));
  };


  return (
    <ScrollView style={styles.container(isDarkMode)}>
      <Animated.View entering={FadeIn} exiting={FadeOut}>
        
        {/* ⚠️ REMOVIDO: Toggle Dark Mode - a gestão deve ser no Perfil/Menu */}
        {/* <View style={styles.toggleContainer}>
          <Text style={styles.label(isDarkMode)}>Modo Escuro</Text>
          <Switch
            onValueChange={toggleTheme} // Usar o toggle global
            value={isDarkMode}
            trackColor={{ false: COLORS.gray, true: COLORS.primaryDark }}
            thumbColor={isDarkMode ? COLORS.primary : COLORS.white}
          />
        </View> */}

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

        {/* Service Sections */}
        {parsedServicos.map((s, index) => {
          const sel = selections[s.nome];
          if (!sel) return null;
          return (
            <View key={index} style={styles.sectionContainer(isDarkMode)}>
              <Text style={styles.sectionTitle(isDarkMode)}>{s.nome}</Text>
              <Text style={styles.priceText(isDarkMode)}>
                Valor:{' '}
                {s.nome === 'Propina'
                  ? formatCurrency(sel.selectedAno ? 45550 : 0) // Fixed to 45,550.00 Kwanza
                  : ['Declaração com nota', 'Declaração sem nota'].includes(s.nome)
                  ? formatCurrency(s.valor || 0)
                  : formatCurrency(s.valor || 0)}
              </Text>

              {/* Year Picker for Propina */}
              {s.nome === 'Propina' && (
                <View style={styles.inputContainer(isDarkMode)}>
                  <Text style={styles.label(isDarkMode)}>Selecionar Ano</Text>
                  <View style={styles.picker(isDarkMode)}>
                    <Picker
                      selectedValue={sel.selectedAno}
                      onValueChange={(value) => setSelectionField(s.nome, 'selectedAno', value)}
                      itemStyle={{ color: isDarkMode ? COLORS.white : COLORS.black }} // Reatividade
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
              {['Declaração com nota', 'Declaração sem nota'].includes(s.nome) && (
                <View style={styles.inputContainer(isDarkMode)}>
                  <Text style={styles.label(isDarkMode)}>Quantidade de Documentos</Text>
                  <View style={styles.quantityContainer(isDarkMode)}>
                    <TouchableOpacity
                      style={styles.quantityButton(isDarkMode)}
                      onPress={() => adjustQuantity(s.nome, false)}
                      disabled={sel.quantity <= 1}
                    >
                      <Text style={styles.quantityButtonText(isDarkMode)}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText(isDarkMode)}>{sel.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton(isDarkMode)}
                      onPress={() => adjustQuantity(s.nome, true)}
                    >
                      <Text style={styles.quantityButtonText(isDarkMode)}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Month Selection for Propina */}
              {s.nome === 'Propina' && sel.selectedAno && (
                <View style={styles.inputContainer(isDarkMode)}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.label(isDarkMode)}>
                      Por Pagar ({owedMonths.length} meses)
                    </Text>
                    {/* Botão Selecionar Todos */}
                    {owedMonths.length > 0 && (
                      <TouchableOpacity onPress={() => handleSelectAllMonths(s.nome)}>
                        <Text style={styles.selectAllText}>Selecionar Todos</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <FlatList
                    data={owedMonths}
                    renderItem={(props) => renderMonthItem(s.nome, props)}
                    keyExtractor={(item) => item}
                    numColumns={2}
                    columnWrapperStyle={styles.monthList}
                    ListEmptyComponent={<Text style={styles.error(isDarkMode)}>Nenhum mês pendente.</Text>}
                  />
                </View>
              )}
            </View>
          );
        })}

        {/* Grand Total */}
        <Text style={styles.totalText(isDarkMode)}>
          Total: {formatCurrency(calculateTotal())}
        </Text>

        {/* Error Message */}
        {error && (
          <Animated.Text entering={FadeIn} exiting={FadeOut} style={styles.error(isDarkMode)}>
            {error}
          </Animated.Text>
        )}

        {/* Pay Button */}
        <TouchableOpacity
          style={[
            styles.payButton,
            (!numeroEstudante || calculateTotal() === 0) && styles.payButtonDisabled,
          ]}
          onPress={handlePagar}
          disabled={!numeroEstudante || calculateTotal() === 0}
        >
          <Text style={styles.payButtonText}>
            Continuar para Pagamento{' '}
            <FontAwesome name="arrow-right" size={16} color={COLORS.white} />
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}
