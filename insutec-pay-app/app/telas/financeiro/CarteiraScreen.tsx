import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  ActivityIndicator, 
  useColorScheme,
  Animated,
  Dimensions 
} from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, sharedStyles } from '../../../styles/_SharedFinance.styles';
import { carteiraStyles } from '../../../styles/_Carteira.styles';
import { useFinance } from '../../../components/FinanceContext';
import { useAuth } from '../../../components/AuthContext';
import { formatCurrency } from '../../../src/utils/formatters';

const { width } = Dimensions.get('window');

// --- Componente de Card Atlântico Melhorado ---
const AtlanticoCard = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const { aluno } = useAuth();
  const rotateAnim = useState(new Animated.Value(0))[0];
  const [isFlipped, setIsFlipped] = useState(false);

  // Obter nome do usuário logado
  const getUserName = () => {
    if (aluno?.nome) {
      const names = aluno.nome.split(' ');
      if (names.length >= 2) {
        return `${names[0]} ${names[names.length - 1]}`.toUpperCase();
      }
      return aluno.nome.toUpperCase();
    }
    return 'JOÃO M. RAMOS'; // Fallback
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

  const frontInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handleFlip}>
      <Animated.View style={[carteiraStyles.atlanticoCard(isDarkMode), {
        transform: [{ rotateY: frontInterpolate }]
      }]}>
        {/* Frente do Cartão - Layout Correto baseado na imagem */}
        <View style={carteiraStyles.headerCard}>
          <View style={carteiraStyles.bankLogoContainer}>
            <Text style={carteiraStyles.bankName}>INSUTEC  PAY</Text>
            <View style={carteiraStyles.cardTypeBadge}>
              <Text style={carteiraStyles.cardTypeText}>UNIVERSITARIO+</Text>
            </View>
          </View>
          <View style={{ width: 24 }} />
        </View>
        
        {/* Número do cartão COM CHIP ao lado (chip à esquerda) */}
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

      {/* Verso do Cartão (apenas visual) */}
      <Animated.View style={[carteiraStyles.atlanticoCardBack(isDarkMode), {
        transform: [{ rotateY: backInterpolate }]
      }]}>
        <View style={carteiraStyles.magneticStrip} />
        <View style={carteiraStyles.cvvContainer}>
          <Text style={carteiraStyles.cvvLabel}>CVV</Text>
          <Text style={carteiraStyles.cvvValue}>123</Text>
        </View>
        <Text style={carteiraStyles.cardBackText}>
          Cartão Universitário Atlântico - Para uso no sistema Insutec Pay
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// --- Seção de Saldo Melhorada ---
const SaldoSection = ({ 
  isDarkMode, 
  saldo, 
  onNavigateToRecibos 
}: { 
  isDarkMode: boolean; 
  saldo: number; 
  onNavigateToRecibos: () => void 
}) => {
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[carteiraStyles.saldoCard(isDarkMode), { opacity: fadeAnim }]}>
      <View style={carteiraStyles.saldoHeader}>
        <Ionicons name="wallet-outline" size={24} color={COLORS.primary} />
        <Text style={carteiraStyles.saldoTitle}>Saldo Disponível</Text>
      </View>
      
      <Text style={carteiraStyles.saldoValue(isDarkMode)}>{formatCurrency(saldo)}</Text>
      
      <View style={carteiraStyles.saldoActions}>
        <TouchableOpacity 
          style={carteiraStyles.recargaButton} 
          onPress={() => Alert.alert('Recarga', 'Função de recarga acionada.')}
        >
          <View style={carteiraStyles.buttonIconContainer}>
            <Feather name="plus-circle" size={20} color={COLORS.white} />
          </View>
          <Text style={carteiraStyles.recargaButtonText}>Recarregar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={carteiraStyles.retirarButton} 
          onPress={() => Alert.alert('Retirar', 'Função de retirada acionada.')}
        >
          <View style={carteiraStyles.buttonIconContainer}>
            <Feather name="minus-circle" size={20} color={COLORS.white} />
          </View>
          <Text style={carteiraStyles.retirarButtonText}>Retirar</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={carteiraStyles.historyButton(isDarkMode)} 
        onPress={onNavigateToRecibos}
      >
        <Ionicons name="receipt-outline" size={18} color={isDarkMode ? COLORS.textLight : COLORS.textDark} />
        <Text style={[carteiraStyles.historyButtonText(isDarkMode), { marginLeft: 10 }]}>
          Ver Histórico de Recibos
        </Text>
        <Feather name="chevron-right" size={16} color={COLORS.subText} />
      </TouchableOpacity>
    </Animated.View>
  );
};

// --- Formulário de Adicionar Cartão Melhorado ---
const AddCardForm = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : '';
  };

  const handleAddCard = () => {
    if (!cardNumber || !cardHolder || !expiry || !cvv) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert('Erro', 'Número do cartão deve ter 16 dígitos.');
      return;
    }

    setIsAdding(true);
    setTimeout(() => {
      Alert.alert('Sucesso', `Cartão final ${cardNumber.slice(-4)} adicionado com sucesso!`);
      setCardNumber('');
      setCardHolder('');
      setExpiry('');
      setCvv('');
      setIsAdding(false);
      setIsExpanded(false);
    }, 1500);
  };

  if (!isExpanded) {
    return (
      <TouchableOpacity 
        style={carteiraStyles.addCardTrigger(isDarkMode)}
        onPress={() => setIsExpanded(true)}
      >
        <Feather name="plus-circle" size={24} color={COLORS.primary} />
        <Text style={carteiraStyles.addCardTriggerText(isDarkMode)}>
          Adicionar Novo Cartão
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={carteiraStyles.section(isDarkMode)}>
      <View style={carteiraStyles.sectionHeader}>
        <Text style={sharedStyles.sectionTitle(isDarkMode)}>Adicionar Novo Cartão</Text>
        <TouchableOpacity onPress={() => setIsExpanded(false)}>
          <Feather name="x" size={20} color={COLORS.subText} />
        </TouchableOpacity>
      </View>
      
      <TextInput
        placeholder="Número do Cartão"
        placeholderTextColor={COLORS.subText}
        keyboardType="numeric"
        maxLength={19}
        value={formatCardNumber(cardNumber)}
        onChangeText={(text) => setCardNumber(text.replace(/\s/g, ''))}
        style={carteiraStyles.input(isDarkMode)}
      />
      
      <TextInput
        placeholder="Nome no Cartão"
        placeholderTextColor={COLORS.subText}
        value={cardHolder}
        onChangeText={setCardHolder}
        style={carteiraStyles.input(isDarkMode)}
      />
      
      <View style={carteiraStyles.rowInputs}>
        <TextInput
          placeholder="MM/AA"
          placeholderTextColor={COLORS.subText}
          maxLength={5}
          value={expiry}
          onChangeText={setExpiry}
          style={[carteiraStyles.input(isDarkMode), { flex: 1, marginRight: 10 }]}
        />
        <TextInput
          placeholder="CVV"
          placeholderTextColor={COLORS.subText}
          maxLength={3}
          secureTextEntry
          value={cvv}
          onChangeText={setCvv}
          style={[carteiraStyles.input(isDarkMode), { flex: 1 }]}
        />
      </View>
      
      <View style={carteiraStyles.buttonRow}>
        <TouchableOpacity
          style={[carteiraStyles.button(isDarkMode), isAdding && sharedStyles.payButtonDisabled]}
          onPress={handleAddCard}
          disabled={isAdding}
        >
          {isAdding ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <>
              <Feather name="credit-card" size={18} color={COLORS.white} />
              <Text style={carteiraStyles.buttonText}>
                Adicionar Cartão
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- Tela Principal Melhorada ---
export const CarteiraScreen = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { saldo, processarPagamento } = useFinance();
  const { aluno } = useAuth();
  const params = useLocalSearchParams();
  const { id_transacao_unica, valor_total, descricao } = params as {
    id_transacao_unica?: string;
    valor_total?: string;
    descricao?: string;
  };
  const [isProcessing, setIsProcessing] = useState(false);

  const valorTotalNum = parseFloat(valor_total || '0');

  const handlePagar = async () => {
    if (!id_transacao_unica || !valor_total || !descricao) {
      Alert.alert('Erro', 'Informações de pagamento incompletas.');
      return;
    }

    setIsProcessing(true);
    const success = await processarPagamento(
      valorTotalNum,
      descricao,
      id_transacao_unica,
      'Cartão Atlântico Universitário+'
    );

    setTimeout(() => {
      setIsProcessing(false);
      if (success) {
        router.push({
          pathname: '/telas/transacao/[id]',
          params: {
            id: id_transacao_unica,
            id_transacao_unica,
            valor_total,
            descricao,
            metodo_pagamento: 'Cartão Atlântico Universitário+',
            status: 'SUCESSO',
            data: new Date().toISOString(),
          },
        });
      } else {
        Alert.alert('Erro', 'Não foi possível processar o pagamento.');
      }
    }, 1500);
  };

  const handleNavigateToRecibos = () => {
    router.push('/telas/financeiro/RecibosScreen');
  };

  return (
    <ScrollView 
      style={sharedStyles.container(isDarkMode)} 
      contentContainerStyle={carteiraStyles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={carteiraStyles.header}>
        <View>
          <Text style={sharedStyles.title(isDarkMode)}>Minha Carteira</Text>
          <Text style={carteiraStyles.welcomeText(isDarkMode)}>
            Olá, {aluno?.nome?.split(' ')[0] || 'Estudante'}!
          </Text>
        </View>
        <TouchableOpacity style={carteiraStyles.settingsButton}>
          <Feather name="settings" size={20} color={isDarkMode ? COLORS.textLight : COLORS.textDark} />
        </TouchableOpacity>
      </View>

      <AtlanticoCard isDarkMode={isDarkMode} />
      
      <SaldoSection 
        isDarkMode={isDarkMode} 
        saldo={saldo} 
        onNavigateToRecibos={handleNavigateToRecibos} 
      />

      {valor_total && (
        <View style={carteiraStyles.paymentSection(isDarkMode)}>
          <View style={carteiraStyles.paymentHeader}>
            <Ionicons name="card-outline" size={20} color={COLORS.primary} />
            <Text style={sharedStyles.sectionTitle(isDarkMode)}>Confirmar Pagamento</Text>
          </View>
          
          <View style={carteiraStyles.paymentDetails}>
            <Text style={carteiraStyles.paymentLabel}>Descrição</Text>
            <Text style={carteiraStyles.paymentValue}>{descricao}</Text>
            
            <View style={carteiraStyles.paymentDivider} />
            
            <Text style={carteiraStyles.paymentLabel}>Valor Total</Text>
            <Text style={carteiraStyles.paymentAmount}>{formatCurrency(valorTotalNum)}</Text>
          </View>
          
          <TouchableOpacity
            style={[carteiraStyles.payButton, isProcessing && sharedStyles.payButtonDisabled]}
            onPress={handlePagar}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <>
                <Feather name="credit-card" size={18} color={COLORS.white} />
                <Text style={carteiraStyles.payButtonText}>
                  Pagar {formatCurrency(valorTotalNum)}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      <AddCardForm isDarkMode={isDarkMode} />

      <View style={carteiraStyles.featuresGrid}>
        <TouchableOpacity 
          style={carteiraStyles.featureItem(isDarkMode)}
          onPress={() => Alert.alert('Segurança', 'Configurações de segurança do cartão.')}
        >
          <MaterialIcons name="security" size={24} color={COLORS.primary} />
          <Text style={carteiraStyles.featureText(isDarkMode)}>Segurança</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={carteiraStyles.featureItem(isDarkMode)}
          onPress={() => Alert.alert('Bloquear Cartão', 'Função para bloquear o cartão.')}
        >
          <Feather name="lock" size={24} color={COLORS.primary} />
          <Text style={carteiraStyles.featureText(isDarkMode)}>Bloquear Cartão</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={carteiraStyles.featureItem(isDarkMode)}
          onPress={() => Alert.alert('Alertas', 'Configurar notificações do cartão.')}
        >
          <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
          <Text style={carteiraStyles.featureText(isDarkMode)}>Alertas</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CarteiraScreen;
