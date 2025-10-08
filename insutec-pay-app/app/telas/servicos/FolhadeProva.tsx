import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  ActivityIndicator,
  Dimensions,
  StyleSheet 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';
import { COLORS } from '../../../styles/_ServicoStyles.style.ts';
import { formatCurrency } from '../../../src/utils/formatters';

// Constantes
const SERVICE_TITLE = 'Solicitação de Folha de Prova';
const PRICE = 200;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FolhaDeProvaScreen() {
  const { aluno } = useAuth();
  const { isDarkMode } = useTheme();

  // Estados
  const [numeroEstudante, setNumeroEstudante] = useState(aluno?.nr_estudante || '');
  const [disciplinaNome, setDisciplinaNome] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Memoização
  const targetStudentId = useMemo(() => numeroEstudante || aluno?.nr_estudante || '', [numeroEstudante, aluno]);
  const total = useMemo(() => PRICE * quantidade, [quantidade]);

  // Adicionar ao pedido
  const handleAddToOrder = () => {
    if (!targetStudentId) {
      setError('Por favor, insira o número do estudante.');
      return;
    }
    if (!disciplinaNome.trim()) {
      setError('Por favor, insira o nome da disciplina.');
      return;
    }

    // Criar item único do pedido
    const pedidoItem = {
      id: `FOLHA-${Date.now()}`,
      descricao: `Folha de Prova: ${disciplinaNome.trim()} (${quantidade} unidade${quantidade > 1 ? 's' : ''})`,
      valor: total,
      data_vencimento: '2025-12-31',
      quantidade: quantidade
    };

    // Ir direto para pagamento com o item único
    handleProceedToPayment(pedidoItem);
  };

  // Ir para pagamento
  const handleProceedToPayment = (item: any) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      router.push({
        pathname: '/telas/ServicoPagamento/ServicoPagamentoScreen',
        params: {
          servicos: JSON.stringify([item]),
          alunoId: targetStudentId,
          tipoServico: 'FOLHA_PROVA'
        },
      });
    }, 1000);
  };

  // Aumentar quantidade
  const increaseQuantity = () => {
    setQuantidade(prev => prev + 1);
  };

  // Diminuir quantidade
  const decreaseQuantity = () => {
    if (quantidade > 1) {
      setQuantidade(prev => prev - 1);
    }
  };

  // Estilos inline para evitar problemas de importação
  const styles = {
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    header: {
      alignItems: 'center',
      padding: 24,
      paddingTop: 40,
    },
    headerIcon: {
      width: 70,
      height: 70,
      borderRadius: 35,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      backgroundColor: COLORS.warning + '20',
    },
    mainTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      color: isDarkMode ? COLORS.textLight : COLORS.textDark,
      marginBottom: 8,
    },
    subTitle: {
      fontSize: 16,
      textAlign: 'center',
      color: isDarkMode ? COLORS.subText : COLORS.gray,
      lineHeight: 22,
    },
    infoCard: {
      backgroundColor: isDarkMode ? COLORS.cardBackground : COLORS.white,
      margin: 16,
      padding: 16,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    infoText: {
      fontSize: 14,
      marginLeft: 12,
      color: isDarkMode ? COLORS.textLight : COLORS.textDark,
      flex: 1,
    },
    section: {
      marginHorizontal: 16,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? COLORS.textLight : COLORS.textDark,
      marginBottom: 16,
    },
    studentInfoCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? COLORS.cardBackground : COLORS.white,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDarkMode ? COLORS.gray : '#E0E0E0',
    },
    studentInput: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    },
    disciplinaInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? COLORS.cardBackground : COLORS.white,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDarkMode ? COLORS.gray : '#E0E0E0',
      marginBottom: 20,
    },
    disciplinaInput: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    },
    quantitySection: {
      marginBottom: 20,
    },
    quantityLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? COLORS.textLight : COLORS.textDark,
      marginBottom: 12,
    },
    quantitySelector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantityButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? COLORS.cardBackground : '#f0f0f0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    quantityDisplay: {
      width: 60,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.primary,
      backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.white,
    },
    quantityText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    },
    orderSummaryCard: {
      backgroundColor: isDarkMode ? COLORS.cardBackground : COLORS.white,
      padding: 20,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    summaryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? COLORS.textLight : COLORS.textDark,
      marginBottom: 16,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    summaryLabel: {
      fontSize: 14,
      color: isDarkMode ? COLORS.subText : COLORS.gray,
    },
    summaryValue: {
      fontSize: 14,
      fontWeight: '600',
      color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    },
    divider: {
      height: 1,
      backgroundColor: COLORS.gray + '40',
      marginVertical: 12,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    },
    totalPrice: {
      fontSize: 20,
      fontWeight: 'bold',
      color: COLORS.primary,
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.danger + '20',
      padding: 12,
      borderRadius: 8,
      marginHorizontal: 16,
      marginBottom: 16,
    },
    errorText: {
      color: COLORS.danger,
      marginLeft: 8,
      fontSize: 14,
      flex: 1,
    },
    spacer: {
      height: 20,
    },
    fixedButtonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'transparent',
      padding: 16,
      paddingBottom: 24,
    },
    continueButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
      backgroundColor: (targetStudentId && disciplinaNome.trim()) ? COLORS.primary : COLORS.gray,
      opacity: (targetStudentId && disciplinaNome.trim()) ? 1 : 0.6,
    },
    continueButtonText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <MaterialIcons name="assignment" size={32} color={COLORS.warning} />
          </View>
          <Text style={styles.mainTitle}>{SERVICE_TITLE}</Text>
          <Text style={styles.subTitle}>
            Solicite sua folha de prova de forma rápida e segura
          </Text>
        </View>

        {/* Card de Informações */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialIcons name="info" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Preço fixo por folha: {formatCurrency(PRICE)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="schedule" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Processamento: 24-48 horas
            </Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="description" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Formato: Digital (PDF)
            </Text>
          </View>
        </View>

        {/* Informações do Estudante */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Estudante</Text>
          <View style={styles.studentInfoCard}>
            <MaterialIcons name="school" size={20} color={COLORS.primary} />
            <TextInput
              style={styles.studentInput}
              value={numeroEstudante}
              onChangeText={(text) => {
                setNumeroEstudante(text);
                setError(null);
              }}
              placeholder="Número do estudante"
              keyboardType="numeric"
              placeholderTextColor={isDarkMode ? COLORS.gray : '#999'}
            />
          </View>
        </View>

        {/* Detalhes da Disciplina */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalhes da Solicitação</Text>
          
          <View style={styles.disciplinaInputContainer}>
            <MaterialIcons name="menu-book" size={20} color={COLORS.primary} />
            <TextInput
              style={styles.disciplinaInput}
              value={disciplinaNome}
              onChangeText={(text) => {
                setDisciplinaNome(text);
                setError(null);
              }}
              placeholder="Nome da disciplina (ex: Matemática Aplicada)"
              placeholderTextColor={isDarkMode ? COLORS.gray : '#999'}
              autoCapitalize="words"
            />
          </View>

          {/* Seletor de Quantidade */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantidade de Folhas:</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={decreaseQuantity}
                disabled={quantidade <= 1}
              >
                <MaterialIcons 
                  name="remove" 
                  size={20} 
                  color={quantidade <= 1 ? COLORS.gray : COLORS.primary} 
                />
              </TouchableOpacity>
              
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>
                  {quantidade}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={increaseQuantity}
              >
                <MaterialIcons name="add" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Resumo do Pedido */}
          <View style={styles.orderSummaryCard}>
            <Text style={styles.summaryTitle}>Resumo do Pedido</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Folha de Prova:</Text>
              <Text style={styles.summaryValue}>
                {disciplinaNome || 'Nome da disciplina'}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Quantidade:</Text>
              <Text style={styles.summaryValue}>{quantidade}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Preço unitário:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(PRICE)}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalPrice}>{formatCurrency(total)}</Text>
            </View>
          </View>
        </View>

        {/* Mensagem de Erro */}
        {error && (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={20} color={COLORS.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Espaço para o botão fixo */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Botão Fixo de Continuar */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleAddToOrder}
          disabled={!targetStudentId || !disciplinaNome.trim() || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <>
              <MaterialIcons name="arrow-forward" size={20} color={COLORS.white} />
              <Text style={styles.continueButtonText}>
                Continuar para Pagamento - {formatCurrency(total)}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
