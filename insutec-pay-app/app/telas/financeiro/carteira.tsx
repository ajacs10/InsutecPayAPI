import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, sharedStyles } from '../../../styles/_SharedFinance.styles';
import { carteiraStyles } from '../../../styles/_Carteira.styles';
import { useFinance } from '../../../components/FinanceContext';
import { useAuth } from '../../../components/AuthContext';
import { formatCurrency } from '../../../src/utils/formatters';

const { width } = Dimensions.get('window');

const AtlanticoCard = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const { aluno } = useAuth();
  const rotateAnim = useState(new Animated.Value(0))[0];
  const [isFlipped, setIsFlipped] = useState(false);

  const getUserName = () => {
    if (aluno?.nome) {
      const names = aluno.nome.split(' ');
      return names.length >= 2
        ? `${names[0]} ${names[names.length - 1]}`.toUpperCase()
        : aluno.nome.toUpperCase();
    }
    return 'ESTUDANTE';
  };

  const handleFlip = () => {
    Animated.spring(rotateAnim, {
      toValue: isFlipped ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backInterpolate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const frontOpacity = rotateAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] });
  const backOpacity = rotateAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handleFlip}>
      <Animated.View style={[
        carteiraStyles.atlanticoCard(isDarkMode),
        { transform: [{ rotateY: frontInterpolate }], opacity: frontOpacity, zIndex: isFlipped ? 0 : 1 }
      ]}>
        <View style={carteiraStyles.headerCard}>
          <View style={carteiraStyles.bankLogoContainer}>
            <Text style={carteiraStyles.bankName}>INSUTEC PAY</Text>
            <View style={carteiraStyles.cardTypeBadge}>
              <Text style={carteiraStyles.cardTypeText}>UNIVERSITÁRIO+</Text>
            </View>
          </View>
        </View>
        <View style={carteiraStyles.cardNumberWithChipContainer}>
          <View style={carteiraStyles.chipContainerHorizontal}>
            <MaterialIcons name="sim-card" size={32} color={COLORS.white} />
          </View>
          <Text style={carteiraStyles.cardNumber}>0000 0000 0000 2002</Text>
        </View>
        <View style={carteiraStyles.footerCard}>
          <View style={carteiraStyles.cardInfo}>
            <Text style={carteiraStyles.footerLabel}>Titular</Text>
            <Text style={carteiraStyles.footerValue}>{getUserName()}</Text>
          </View>
          <View style={carteiraStyles.cardInfo}>
            <Text style={carteiraStyles.footerLabel}>Válido até</Text>
            <Text style={carteiraStyles.footerValue}>05/30</Text>
          </View>
          <View style={carteiraStyles.cardLogoContainer}>
            <MaterialIcons name="contactless" size={28} color={COLORS.white} />
          </View>
        </View>
      </Animated.View>
      <Animated.View style={[
        carteiraStyles.atlanticoCardBack(isDarkMode),
        { transform: [{ rotateY: backInterpolate }], position: 'absolute', width: '100%', opacity: backOpacity, zIndex: isFlipped ? 1 : 0 }
      ]}>
        <View style={carteiraStyles.magneticStrip} />
        <View style={carteiraStyles.cvvContainer}>
          <Text style={carteiraStyles.cvvLabel}>CVV</Text>
          <Text style={carteiraStyles.cvvValue}>123</Text>
        </View>
        <Text style={carteiraStyles.cardBackText}>Cartão Universitário - Insutec Pay</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const SaldoSection = ({
  isDarkMode,
  saldo,
  onNavigateToRecibos,
  onNavigateToComprovativos
}: {
  isDarkMode: boolean;
  saldo: number;
  onNavigateToRecibos: () => void;
  onNavigateToComprovativos: () => void;
}) => {
  const fadeAnim = useState(new Animated.Value(0))[0];
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[carteiraStyles.saldoCard(isDarkMode), { opacity: fadeAnim }]}>
      <View style={carteiraStyles.saldoHeader}>
        <Ionicons name="wallet-outline" size={24} color={COLORS.primary} />
        <Text style={[carteiraStyles.saldoTitle, isDarkMode && { color: COLORS.textLight }]}>
          Saldo Disponível
        </Text>
      </View>
      <Text style={carteiraStyles.saldoValue(isDarkMode)}>{formatCurrency(saldo)}</Text>
      <View style={carteiraStyles.saldoActions}>
        <TouchableOpacity style={carteiraStyles.recargaButton} onPress={() => Alert.alert('Recarga', 'Em breve')}>
          <Feather name="plus-circle" size={20} color={COLORS.white} />
          <Text style={carteiraStyles.recargaButtonText}>Recarregar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={carteiraStyles.retirarButton} onPress={() => Alert.alert('Retirar', 'Em desenvolvimento')}>
          <Feather name="minus-circle" size={20} color={COLORS.dark} />
          <Text style={carteiraStyles.retirarButtonText}>Retirar</Text>
        </TouchableOpacity>
      </View>
      <View style={carteiraStyles.historyButtonsContainer}>
        <TouchableOpacity style={carteiraStyles.historyButton(isDarkMode)} onPress={onNavigateToRecibos}>
          <Ionicons name="receipt-outline" size={18} color={isDarkMode ? COLORS.textLight : COLORS.textDark} />
          <Text style={[carteiraStyles.historyButtonText(isDarkMode), { marginLeft: 10 }]}>Recibos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={carteiraStyles.historyButton(isDarkMode)} onPress={onNavigateToComprovativos}>
          <MaterialIcons name="assignment" size={18} color={isDarkMode ? COLORS.textLight : COLORS.textDark} />
          <Text style={[carteiraStyles.historyButtonText(isDarkMode), { marginLeft: 10 }]}>Comprovativos</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default function CarteiraScreen() {
  const { saldo, processarPagamento, isLoading } = useFinance();
  const { aluno } = useAuth();
  const params = useLocalSearchParams();
  const {
    id_transacao_unica,
    valor_total,
    descricao,
    tipo_servico,
    estudante_alvo_id,
    meses_selecionados,
    valor_propina,
    valor_multas,
  } = params as any;

  const [isProcessing, setIsProcessing] = useState(false);
  const valorTotalNum = parseFloat((valor_total || '0').toString().replace(',', '.')) || 0;
  const isDarkMode = false;

  const handlePagar = async () => {
    if (!id_transacao_unica || !valor_total || !descricao) {
      Alert.alert('Erro', 'Dados do pagamento incompletos.');
      return;
    }
    if (valorTotalNum > saldo) {
      Alert.alert('Saldo Insuficiente', `Você tem ${formatCurrency(saldo)}`);
      return;
    }
    setIsProcessing(true);
    try {
      const sucesso = await processarPagamento(
        valorTotalNum,
        descricao,
        id_transacao_unica,
        'Carteira Digital',
        tipo_servico || 'OUTRO',
        estudante_alvo_id || '',
        meses_selecionados,
        valor_propina,
        valor_multas
      );
      if (sucesso) {
        router.replace({
          pathname: '/telas/Success/SuccessScreen',
          params: { comprovativoId: id_transacao_unica }
        });
      } else {
        Alert.alert('Erro', 'Falha ao processar pagamento.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro inesperado.');
    } finally {
      setIsProcessing(false);
    }
  };

  const navigateTo = (path: string) => () => router.push(path);

  if (isLoading) {
    return (
      <SafeAreaView style={sharedStyles.container(isDarkMode)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 10, color: COLORS.subText }}>Carregando carteira...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={sharedStyles.container(isDarkMode)}>
      <Stack.Screen options={{ title: 'Carteira', headerShown: true }} />
      <ScrollView contentContainerStyle={carteiraStyles.scrollContent}>
        <View style={carteiraStyles.header}>
          <View>
            <Text style={sharedStyles.title(isDarkMode)}>Minha Carteira</Text>
            <Text style={carteiraStyles.welcomeText(isDarkMode)}>
              Olá, {aluno?.nome?.split(' ')[0] || 'Estudante'}!
            </Text>
          </View>
        </View>
        <AtlanticoCard isDarkMode={isDarkMode} />
        <View style={carteiraStyles.cardSpacer} />
        <SaldoSection
          isDarkMode={isDarkMode}
          saldo={saldo}
          onNavigateToRecibos={navigateTo('/telas/financeiro/RecibosScreen')}
          onNavigateToComprovativos={navigateTo('/telas/comprovativo/ComprovativoScreen')}
        />
        {valorTotalNum > 0 && (
          <View style={carteiraStyles.paymentSection(isDarkMode)}>
            <View style={carteiraStyles.paymentHeader}>
              <Ionicons name="card-outline" size={30} color={COLORS.primary} />
              <Text style={sharedStyles.sectionTitle(isDarkMode)}>Confirmar Pagamento</Text>
            </View>
            <View style={carteiraStyles.paymentDetails}>
              <Text style={carteiraStyles.paymentLabel}>Descrição</Text>
              <Text style={carteiraStyles.paymentValue}>{descricao}</Text>
              {estudante_alvo_id && (
                <>
                  <View style={carteiraStyles.paymentDivider} />
                  <Text style={carteiraStyles.paymentLabel}>Estudante</Text>
                  <Text style={carteiraStyles.paymentValue}>{estudante_alvo_id}</Text>
                </>
              )}
              <View style={carteiraStyles.paymentDivider} />
              <Text style={carteiraStyles.paymentLabel}>Total</Text>
              <Text style={carteiraStyles.paymentAmount}>{formatCurrency(valorTotalNum)}</Text>
            </View>
            <TouchableOpacity
              style={[
                carteiraStyles.payButton,
                (isProcessing || valorTotalNum > saldo) && sharedStyles.payButtonDisabled
              ]}
              onPress={handlePagar}
              disabled={isProcessing || valorTotalNum > saldo}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Feather name="wallet" size={18} color="#fff" />
                  <Text style={carteiraStyles.payButtonText}>
                    {valorTotalNum > saldo ? 'SALDO INSUFICIENTE' : `PAGAR ${formatCurrency(valorTotalNum)}`}
                  </Text>
                </>
              )}
            </TouchableOpacity>
            {valorTotalNum > saldo && (
              <Text style={[sharedStyles.errorText, { textAlign: 'center', marginTop: 10 }]}>
                Recarregue sua carteira para continuar.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
