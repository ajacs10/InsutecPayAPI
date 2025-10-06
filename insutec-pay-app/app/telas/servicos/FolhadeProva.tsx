import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';
import { styles, COLORS } from '../../../styles/_ServicoStyles.style.ts';
import { formatCurrency } from '../../../src/utils/formatters';

// Constantes
const SERVICE_TITLE = 'Solicitação de Folha de Prova';
const BASE_PRICE = 200; // Kwanza por item

// Mock de Tipos de Prova/Contexto
const EXAM_OPTIONS = [
  { nome: 'Selecione o Contexto (Ex: Recurso)', id: '', data_vencimento: '', valor: 0 },
  { nome: 'Cópia de Folha de Exame (Normal)', valor: BASE_PRICE, id: 'FOLHA_NORMAL', data_vencimento: '2025-12-31' },
  { nome: 'Cópia de Folha de Exame (Recurso)', valor: BASE_PRICE, id: 'FOLHA_RECURSO', data_vencimento: '2025-11-30' },
  { nome: 'Revisão de Prova (Extra)', valor: BASE_PRICE + 500, id: 'FOLHA_EXTRA', data_vencimento: '2025-10-31' },
];

// Interface para os itens do pedido
interface PedidoItem {
  id: string;
  descricao: string;
  valor: number;
  data_vencimento: string;
}

export default function FolhaDeProvaScreen() {
  const { aluno } = useAuth();
  const { isDarkMode } = useTheme();

  // Estados
  const [numeroEstudante, setNumeroEstudante] = useState(aluno?.nr_estudante || '');
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [disciplinaNome, setDisciplinaNome] = useState('');
  const [currentPedidoItems, setCurrentPedidoItems] = useState<PedidoItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Memoização
  const targetStudentId = useMemo(() => numeroEstudante || aluno?.nr_estudante || '', [numeroEstudante, aluno]);
  const selectedExam = useMemo(() => EXAM_OPTIONS.find((opt) => opt.id === selectedExamId) || EXAM_OPTIONS[0], [selectedExamId]);
  const totalPedido = useMemo(() => currentPedidoItems.reduce((sum, item) => sum + item.valor, 0), [currentPedidoItems]);

  // Adicionar item ao pedido
  const handleAddItem = () => {
    console.log('[FolhaDeProva] Tentando adicionar item:', { targetStudentId, selectedExamId, disciplinaNome });
    if (!targetStudentId) {
      setError('Por favor, insira o número do estudante.');
      return;
    }
    if (!selectedExamId) {
      setError('Selecione o tipo de prova.');
      return;
    }
    if (!disciplinaNome.trim()) {
      setError('Por favor, insira o nome da disciplina.');
      return;
    }

    const novoItem: PedidoItem = {
      id: `FOLHA-${selectedExamId}-${disciplinaNome.toUpperCase()}-${Date.now()}`,
      descricao: `${selectedExam.nome}: ${disciplinaNome.trim()}`,
      valor: selectedExam.valor,
      data_vencimento: selectedExam.data_vencimento,
    };

    setCurrentPedidoItems((prev) => [...prev, novoItem]);
    console.log('[FolhaDeProva] Item adicionado:', novoItem);

    // Resetar formulário
    setSelectedExamId('');
    setDisciplinaNome('');
    setError(null);
  };

  // Remover item do pedido
  const handleRemoveItem = (id: string) => {
    console.log('[FolhaDeProva] Removendo item:', id);
    setCurrentPedidoItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Enviar para DividasScreen
  const handleSendToDividas = () => {
    if (currentPedidoItems.length === 0) {
      setError('Adicione pelo menos um item à sua lista de pedidos.');
      return;
    }

    setIsLoading(true);
    console.log('[FolhaDeProva] Enviando para DividasScreen:', { items: currentPedidoItems, alunoId: targetStudentId });

    // Mapear os itens para o formato Divida
    const dividasDoPedido = currentPedidoItems.map((item) => ({
      id: item.id,
      descricao: item.descricao,
      valor_base: item.valor,
      valor_total: item.valor,
      data_vencimento: item.data_vencimento,
    }));

    // Simula um atraso para processamento
    setTimeout(() => {
      setIsLoading(false);
      router.push({
        pathname: '/telas/dividas/DividasScreen',
        params: {
          servicosAdicionais: JSON.stringify(dividasDoPedido),
          alunoId: targetStudentId,
        },
      });
      console.log('[FolhaDeProva] Redirecionado para DividasScreen');
    }, 1000);
  };

  return (
    <ScrollView style={styles.container(isDarkMode)} contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.sectionTitle(isDarkMode)}>{SERVICE_TITLE}</Text>

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

      {/* Seção de Adicionar Item */}
      <View style={styles.sectionContainer(isDarkMode)}>
        <Text style={styles.label(isDarkMode)}>1. Detalhes da Folha ({formatCurrency(selectedExam.valor)})</Text>

        {/* Tipo de Prova Picker */}
        <View style={styles.inputContainer(isDarkMode)}>
          <Text style={styles.label(isDarkMode)}>Tipo de Serviço/Contexto</Text>
          <View style={styles.picker(isDarkMode)}>
            <Picker
              selectedValue={selectedExamId}
              onValueChange={(itemValue) => {
                console.log('[FolhaDeProva] Tipo de prova selecionado:', itemValue);
                setSelectedExamId(itemValue as string);
              }}
              style={{ color: isDarkMode ? COLORS.white : COLORS.textDark }}
            >
              {EXAM_OPTIONS.map((opt) => (
                <Picker.Item
                  key={opt.id}
                  label={`${opt.nome} ${opt.valor > 0 ? `(${formatCurrency(opt.valor)})` : ''}`}
                  value={opt.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Nome da Disciplina */}
        {selectedExamId !== '' && (
          <View style={styles.inputContainer(isDarkMode)}>
            <Text style={styles.label(isDarkMode)}>Nome da Disciplina</Text>
            <TextInput
              style={styles.input(isDarkMode)}
              value={disciplinaNome}
              onChangeText={setDisciplinaNome}
              placeholder="Ex: Matemática Aplicada"
              placeholderTextColor={isDarkMode ? COLORS.gray : COLORS.lightGray}
            />
          </View>
        )}

        {/* Botão Adicionar Item */}
        <TouchableOpacity
          style={[
            styles.payButton,
            styles.secondaryButton,
            (!selectedExamId || !disciplinaNome.trim()) && styles.payButtonDisabled,
          ]}
          onPress={handleAddItem}
          disabled={!selectedExamId || !disciplinaNome.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.payButtonText}>
            Adicionar ao Pedido <FontAwesome name="plus-circle" size={16} color={COLORS.white} />
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Itens Adicionados */}
      {currentPedidoItems.length > 0 && (
        <View style={[styles.sectionContainer(isDarkMode), { marginTop: 20 }]}>
          <Text style={styles.sectionTitle(isDarkMode)}>2. Resumo do Pedido ({currentPedidoItems.length} Itens)</Text>
          <FlatList
            data={currentPedidoItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemSummaryCard(isDarkMode)}>
                <Text style={styles.itemSummaryText(isDarkMode)}>{item.descricao}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.itemSummaryValue(isDarkMode)}>{formatCurrency(item.valor)}</Text>
                  <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={{ marginLeft: 10 }}>
                    <FontAwesome name="trash" size={18} color={COLORS.warning} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <Text style={[styles.totalText(isDarkMode), { marginTop: 15 }]}>
            TOTAL GERAL: {formatCurrency(totalPedido)}
          </Text>
        </View>
      )}

      {/* Mensagem de Erro */}
      {error && (
        <Text style={styles.error(isDarkMode)}>{error}</Text>
      )}

      {/* Botão Continuar para Pagamento */}
      <TouchableOpacity
        style={[styles.payButton, currentPedidoItems.length === 0 && styles.payButtonDisabled]}
        onPress={handleSendToDividas}
        disabled={currentPedidoItems.length === 0 || isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color={COLORS.white} size="small" />
        ) : (
          <Text style={styles.payButtonText}>
            Continuar para Pagamento ({currentPedidoItems.length} Itens){' '}
            <FontAwesome name="arrow-right" size={16} color={COLORS.white} />
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
