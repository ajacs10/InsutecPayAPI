// app/telas/servicos/FolhadeProva.tsx
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';
import { useFinance } from '../../../components/FinanceContext';
import {
  createFolhaDeProvaStyles,
  sharedFinanceStyles,
  COLORS,
  GRADIENT,
} from '../../../styles/_FolhadeProva.styles';
import { formatCurrency } from '../../../src/utils/formatters';

const { width } = Dimensions.get('window');
const isSmall = width < 380;
const SERVICE_TITLE = 'Pagamento de Folha de Prova';
const UNIT_PRICE = 200.0;

export default function FolhaDeProvaScreen() {
  const router = useRouter();
  const { aluno } = useAuth();
  const { isDarkMode } = useTheme();
  const { saldo, processarPagamento } = useFinance();

  const [quantidade, setQuantidade] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const styles = useMemo(() => createFolhaDeProvaStyles(isDarkMode), [isDarkMode]);
  const sharedStyles = useMemo(() => sharedFinanceStyles(isDarkMode), [isDarkMode]);

  const targetStudentId = aluno?.nr_estudante || '—';
  const subtotal = useMemo(() => UNIT_PRICE * quantidade, [quantidade]);
  const isButtonDisabled = quantidade === 0 || isLoading || subtotal > saldo;

  const animatePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  }, [scaleAnim]);

  const increaseQuantity = useCallback(() => {
    animatePress();
    setQuantidade(prev => prev + 1);
  }, [animatePress]);

  const decreaseQuantity = useCallback(() => {
    if (quantidade > 0) {
      animatePress();
      setQuantidade(prev => prev - 1);
    }
  }, [quantidade, animatePress]);

  const handlePagarComCarteira = useCallback(async () => {
    if (quantidade === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos 1 folha de prova.');
      return;
    }
    if (subtotal > saldo) {
      Alert.alert(
        'Saldo Insuficiente',
        `Você precisa de ${formatCurrency(subtotal)}.\nSaldo atual: ${formatCurrency(saldo)}`
      );
      return;
    }

    setIsLoading(true);
    animatePress();

    try {
      const transacaoId = `FOLHA-${targetStudentId}-${Date.now()}`;
      const descricao = `Folha de Prova (${quantidade} unidade${quantidade > 1 ? 's' : ''})`;

      const sucesso = await processarPagamento(
        subtotal,
        descricao,
        transacaoId,
        'Carteira Digital',
        'FOLHA_DE_PROVA',
        targetStudentId
      );

      if (sucesso) {
        router.replace({
          pathname: '/telas/Success/SuccessScreen',
          params: { comprovativoId: transacaoId }
        });
      } else {
        Alert.alert('Erro', 'Falha ao processar pagamento.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro inesperado.');
    } finally {
      setIsLoading(false);
    }
  }, [quantidade, subtotal, saldo, targetStudentId, processarPagamento, router]);

  return (
    <SafeAreaView style={sharedStyles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <LinearGradient colors={GRADIENT.header(isDarkMode)} style={styles.headerGradient} />
          <Text style={styles.header}>{SERVICE_TITLE}</Text>
          <Text style={styles.subHeader}>Selecione a quantidade e pague com carteira</Text>
        </View>

        {/* Card Principal */}
        <View style={styles.itemCard}>
          <View style={styles.itemRow}>
            <View style={styles.itemDetails}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="description" size={28} color={COLORS.primary} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.itemName}>Folha de Prova</Text>
                <Text style={styles.itemPrice}>{formatCurrency(UNIT_PRICE)} / unid.</Text>
              </View>
            </View>
          </View>

          <View style={styles.subtotalRow}>
            <Text style={styles.subtotalLabel}>Subtotal:</Text>
            <Text style={styles.subtotalValue}>{formatCurrency(subtotal)}</Text>
          </View>
          <Text style={styles.normalText}>Saldo: {formatCurrency(saldo)}</Text>
          {subtotal > saldo && (
            <Text style={styles.warningText}>Saldo insuficiente</Text>
          )}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Detalhes</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estudante:</Text>
            <Text style={styles.infoValue}>{targetStudentId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Serviço:</Text>
            <Text style={styles.infoValue}>Folha de Prova</Text>
          </View>
        </View>

        {/* Quantidade */}
        <View style={styles.bottomQuantityWrapper}>
          <Text style={styles.infoTitle}>Quantidade</Text>
          <View style={styles.quantityContainerAdjusted}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={[styles.quantityButton, quantidade === 0 && styles.quantityButtonDisabled]}
                onPress={decreaseQuantity}
                disabled={quantidade === 0 || isLoading}
                activeOpacity={0.8}
              >
                <AntDesign name="minus" size={24} color={quantidade === 0 ? '#888' : COLORS.primary} />
              </TouchableOpacity>
            </Animated.View>
            <View style={styles.quantityDisplayAdjusted}>
              <Text style={styles.quantityTextAdjusted}>{quantidade}</Text>
              <Text style={styles.itemPriceAdjusted}>unidades</Text>
            </View>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={increaseQuantity}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <AntDesign name="plus" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Botão Fixo */}
      <View style={styles.footer}>
        <LinearGradient
          colors={isButtonDisabled ? GRADIENT.payButtonDisabled : GRADIENT.payButton(isDarkMode)}
          style={[styles.payButton, isButtonDisabled && styles.payButtonDisabled]}
        >
          <TouchableOpacity
            onPress={handlePagarComCarteira}
            disabled={isButtonDisabled}
            style={styles.payButtonInner}
            activeOpacity={0.9}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <MaterialIcons name="wallet" size={24} color="#fff" />
                <Text style={styles.payButtonText}>
                  {subtotal > saldo
                    ? 'SALDO INSUFICIENTE'
                    : `PAGAR ${formatCurrency(subtotal)}`}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}
