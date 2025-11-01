// app/telas/servicos/FolhaDeProva.tsx
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
import {
  createFolhaDeProvaStyles,
  sharedFinanceStyles,
  COLORS,
  GRADIENT,
} from '../../../styles/_FolhadeProva.styles';
import { formatCurrency } from '../../../src/utils/formatters';

const { width } = Dimensions.get('window');
const SERVICE_TITLE = 'Pagamento de Folha de Prova';
const UNIT_PRICE = 200.0;

export default function FolhaDeProvaScreen() {
  const router = useRouter();
  const { aluno } = useAuth();
  const { isDarkMode } = useTheme();

  const [quantidade, setQuantidade] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const styles = useMemo(() => createFolhaDeProvaStyles(isDarkMode), [isDarkMode]);
  const sharedStyles = useMemo(() => sharedFinanceStyles(isDarkMode), [isDarkMode]);

  const targetStudentId = aluno?.nr_estudante || '—';

  const subtotal = useMemo(() => UNIT_PRICE * quantidade, [quantidade]);
  const isButtonDisabled = quantidade === 0 || isLoading;

  const animatePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  }, [scaleAnim]);

  const increaseQuantity = () => {
    animatePress();
    setQuantidade(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantidade > 0) {
      animatePress();
      setQuantidade(prev => prev - 1);
    }
  };

  const handleFinalizarPagamento = () => {
    if (quantidade === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos 1 folha de prova.', [{ text: 'OK' }]);
      return;
    }

    setIsLoading(true);
    animatePress();

    const item = {
      id: `FOLHA-${Date.now()}`,
      descricao: `Folha de Prova (${quantidade} unidade${quantidade > 1 ? 's' : ''})`,
      valor: subtotal,
      data_vencimento: '2025-12-31',
      quantidade,
    };

    setTimeout(() => {
      setIsLoading(false);
      router.push({
        pathname: '/telas/Success/SuccessScreen',
        params: {
          service: 'Folha de Prova',
          amount: subtotal.toString(),
          quantity: quantidade.toString(),
        },
      });
    }, 1800);
  };

  return (
    <SafeAreaView style={sharedStyles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com gradiente */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={GRADIENT.header(isDarkMode)}
            style={styles.headerGradient}
          />
          <Text style={styles.header}>{SERVICE_TITLE}</Text>
          <Text style={styles.subHeader}>
            Selecione a quantidade e finalize com segurança
          </Text>
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

            {/* Quantidade com animação */}
            <View style={styles.quantityContainer}>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    quantidade === 0 && styles.quantityButtonDisabled,
                  ]}
                  onPress={decreaseQuantity}
                  disabled={quantidade === 0 || isLoading}
                  activeOpacity={0.8}
                >
                  <AntDesign
                    name="minus"
                    size={18}
                    color={quantidade === 0 ? '#888' : COLORS.primary}
                  />
                </TouchableOpacity>
              </Animated.View>

              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{quantidade}</Text>
              </View>

              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={increaseQuantity}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <AntDesign name="plus" size={18} color={COLORS.primary} />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>

          {/* Subtotal */}
          <View style={styles.subtotalRow}>
            <Text style={styles.subtotalLabel}>Subtotal:</Text>
            <Text style={styles.subtotalValue}>{formatCurrency(subtotal)}</Text>
          </View>

          {quantidade === 0 && (
            <Text style={styles.warningText}>
              Selecione pelo menos 1 folha para continuar
            </Text>
          )}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Detalhes do Pedido</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estudante:</Text>
            <Text style={styles.infoValue}>{targetStudentId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Serviço:</Text>
            <Text style={styles.infoValue}>Folha de Prova</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Fixo com Gradiente */}
      <View style={styles.footer}>
        <LinearGradient
          colors={
            isButtonDisabled
              ? GRADIENT.payButtonDisabled
              : GRADIENT.payButton(isDarkMode)
          }
          style={[
            styles.payButton,
            isButtonDisabled && styles.payButtonDisabled,
          ]}
        >
          <TouchableOpacity
            onPress={handleFinalizarPagamento}
            disabled={isButtonDisabled}
            style={styles.payButtonInner}
            activeOpacity={0.9}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <MaterialIcons name="payment" size={22} color="#fff" />
                <Text style={styles.payButtonText}>
                  {quantidade === 0
                    ? 'SELECIONE A QUANTIDADE'
                    : `PAGAR ${formatCurrency(subtotal)}`}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.paymentMethods}>
          <Text style={styles.paymentIcon}>Cartão</Text>
          <Text style={styles.paymentIcon}>Multicaixa</Text>
          <Text style={styles.paymentIcon}>Transferência</Text>
          <Text style={styles.paymentIcon}>Seguro</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
