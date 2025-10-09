import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    ActivityIndicator, 
    useColorScheme,
    Animated,
    Dimensions,
    Alert 
} from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams, Stack } from 'expo-router'; 
import { COLORS, sharedStyles } from '../../../styles/_SharedFinance.styles';
import { carteiraStyles } from '../../../styles/_Carteira.styles';
import { useFinance } from '../../../components/FinanceContext'; 
import { useAuth } from '../../../components/AuthContext';
import { formatCurrency } from '../../../src/utils/formatters';

const { width } = Dimensions.get('window');

// ====================================================================
// COMPONENTES AUXILIARES (ATLANTIOCARD e SALDOSECTION)
// ====================================================================

// Componente de Card Atlântico
const AtlanticoCard = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const { aluno } = useAuth();
    const rotateAnim = useState(new Animated.Value(0))[0];
    const [isFlipped, setIsFlipped] = useState(false);

    const getUserName = () => {
        if (aluno?.nome) {
            const names = aluno.nome.split(' ');
            if (names.length >= 2) {
                return `${names[0]} ${names[names.length - 1]}`.toUpperCase();
            }
            return aluno.nome.toUpperCase();
        }
        return 'NOME DO ESTUDANTE';
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
    
    const frontOpacity = rotateAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0, 0],
    });
    const backOpacity = rotateAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
    });

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={handleFlip}>
            {/* Frente do Cartão */}
            <Animated.View style={[
                carteiraStyles.atlanticoCard(isDarkMode), 
                { 
                    transform: [{ rotateY: frontInterpolate }],
                    opacity: frontOpacity,
                    zIndex: isFlipped ? 0 : 1,
                }
            ]}>
                <View style={carteiraStyles.headerCard}>
                    <View style={carteiraStyles.bankLogoContainer}>
                        <Text style={carteiraStyles.bankName}>INSUTEC PAY</Text>
                        <View style={carteiraStyles.cardTypeBadge}>
                            <Text style={carteiraStyles.cardTypeText}>UNIVERSITARIO+</Text>
                        </View>
                    </View>
                    <View style={{ width: 24 }} />
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

            {/* Verso do Cartão */}
            <Animated.View style={[
                carteiraStyles.atlanticoCardBack(isDarkMode), 
                {
                    transform: [{ rotateY: backInterpolate }],
                    position: 'absolute',
                    width: '100%',
                    opacity: backOpacity,
                    zIndex: isFlipped ? 1 : 0,
                }
            ]}>
                <View style={carteiraStyles.magneticStrip} />
                <View style={carteiraStyles.cvvContainer}>
                    <Text style={carteiraStyles.cvvLabel}>CVV</Text>
                    <Text style={carteiraStyles.cvvValue}>123</Text>
                </View>
                <Text style={carteiraStyles.cardBackText}>
                    Cartão Universitário - Para uso no sistema Insutec Pay
                </Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

// Seção de Saldo
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
                <Text style={[carteiraStyles.saldoTitle, isDarkMode ? { color: COLORS.textLight } : null]}>
                    Saldo Disponível
                </Text>
            </View>
            
            <Text style={carteiraStyles.saldoValue(isDarkMode)}>{formatCurrency(saldo)}</Text>
            
            <View style={carteiraStyles.saldoActions}>
                <TouchableOpacity 
                    style={carteiraStyles.recargaButton} 
                    onPress={() => Alert.alert('Recarga', 'Função de recarga em desenvolvimento.')}
                >
                    <View style={carteiraStyles.buttonIconContainer}>
                        <Feather name="plus-circle" size={20} color={COLORS.white} />
                    </View>
                    <Text style={carteiraStyles.recargaButtonText}>Recarregar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={carteiraStyles.retirarButton} 
                    onPress={() => Alert.alert('Retirar', 'Função de retirada em desenvolvimento.')}
                >
                    <View style={carteiraStyles.buttonIconContainer}>
                        <Feather name="minus-circle" size={20} color={COLORS.dark} />
                    </View>
                    <Text style={carteiraStyles.retirarButtonText}>Retirar</Text>
                </TouchableOpacity>
            </View>
            
            <View style={carteiraStyles.historyButtonsContainer}>
                <TouchableOpacity 
                    style={carteiraStyles.historyButton(isDarkMode)} 
                    onPress={onNavigateToRecibos}
                >
                    <Ionicons name="receipt-outline" size={18} color={isDarkMode ? COLORS.textLight : COLORS.textDark} />
                    <Text style={[carteiraStyles.historyButtonText(isDarkMode), { marginLeft: 10 }]}>
                        Histórico de Recibos
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={carteiraStyles.historyButton(isDarkMode)} 
                    onPress={onNavigateToComprovativos}
                >
                    <MaterialIcons name="assignment" size={18} color={isDarkMode ? COLORS.textLight : COLORS.textDark} />
                    <Text style={[carteiraStyles.historyButtonText(isDarkMode), { marginLeft: 10 }]}>
                        Meus Comprovativos
                    </Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

// ====================================================================
// TELA PRINCIPAL (CARTEIRASCREEN)
// ====================================================================
export default function CarteiraScreen() {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const { saldo, processarPagamento } = useFinance();
    const { aluno } = useAuth();
    const params = useLocalSearchParams();
    const { 
        id_transacao_unica, 
        valor_total, 
        descricao,
        tipo_servico,
        estudante_alvo_id 
    } = params as {
        id_transacao_unica?: string;
        valor_total?: string;
        descricao?: string;
        tipo_servico?: string;
        estudante_alvo_id?: string;
    };
    
    const [isProcessing, setIsProcessing] = useState(false);

    // CORREÇÃO: Garante que o valor total é um número válido
    const valorTotalNum = parseFloat(valor_total?.replace(',', '.') || '0') || 0;
    
    // Debug para verificar valores
    useEffect(() => {
        if (id_transacao_unica && valor_total && descricao) {
            console.log('=== DEBUG PAGAMENTO ===');
            console.log('Valor recebido:', valor_total);
            console.log('Valor convertido:', valorTotalNum);
            console.log('Saldo atual:', saldo);
            console.log('Saldo suficiente:', saldo >= valorTotalNum);
            console.log('=======================');
        }
    }, [id_transacao_unica, valor_total, descricao, valorTotalNum, saldo]);

    // FUNÇÃO PRINCIPAL DE PAGAMENTO - CORRIGIDA
    const handlePagar = async () => {
        console.log('🔄 Iniciando processo de pagamento...');
        
        if (!id_transacao_unica || !valor_total || !descricao) {
            Alert.alert('Erro', 'Informações de pagamento incompletas.');
            return;
        }

        // Verificação de saldo
        if (valorTotalNum > saldo) {
            Alert.alert(
                'Saldo Insuficiente', 
                `Você tem ${formatCurrency(saldo)} mas precisa de ${formatCurrency(valorTotalNum)} para esta transação.`
            );
            return;
        }

        setIsProcessing(true);
        
        try {
            console.log('📤 Processando pagamento com os dados:', {
                valor: valorTotalNum,
                descricao,
                id_transacao_unica,
                tipo_servico,
                estudante_alvo_id
            });

            const success = await processarPagamento(
                valorTotalNum,
                descricao,
                id_transacao_unica,
                'Cartão Atlântico Universitário+',
                tipo_servico as any,
                estudante_alvo_id
            );

            if (success) {
                console.log('✅ Pagamento processado com sucesso! Navegando para tela de sucesso...');
                
                // Navega para a tela de sucesso
                router.replace({
                    pathname: '/telas/Success/SuccessScreen',
                    params: {
                        tipo_servico: tipo_servico || 'OUTRO',
                        descricao: descricao,
                        valor_total: valor_total,
                        id_transacao_unica: id_transacao_unica,
                        estudante_alvo_id: estudante_alvo_id || ''
                    }
                });
            } else {
                console.log('❌ Falha no processamento do pagamento');
                Alert.alert(
                    'Falha no Pagamento', 
                    'Não foi possível completar o pagamento. Verifique sua conexão e tente novamente.'
                );
            }
        } catch (error) {
            console.error('💥 Erro crítico no pagamento:', error);
            Alert.alert(
                'Erro', 
                'Ocorreu um erro inesperado durante o pagamento. Tente novamente.'
            );
        } finally {
            setIsProcessing(false);
        }
    };

    // Navegação para outras telas
    const handleNavigateToRecibos = () => {
        router.push('/telas/financeiro/RecibosScreen');
    };

    const handleNavigateToComprovativos = () => {
        router.push('/telas/historico/HistoricoScreen');
    };

    return (
        <View style={sharedStyles.container(isDarkMode)}> 
            {/* Header da tela */}
            <Stack.Screen options={{ 
                headerShown: true, 
                title: 'Carteira',
                headerStyle: { 
                    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground 
                },
                headerTintColor: isDarkMode ? COLORS.white : COLORS.dark,
                headerTitleStyle: { 
                    color: isDarkMode ? COLORS.white : COLORS.dark 
                }
            }} />

            <ScrollView 
                contentContainerStyle={carteiraStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header personalizado */}
                <View style={carteiraStyles.header}>
                    <View>
                        <Text style={sharedStyles.title(isDarkMode)}>Minha Carteira</Text>
                        <Text style={carteiraStyles.welcomeText(isDarkMode)}>
                            Olá, {aluno?.nome?.split(' ')[0] || 'Estudante'}!
                        </Text>
                    </View>
                    <TouchableOpacity 
                        style={carteiraStyles.settingsButton}
                        onPress={() => Alert.alert('Configurações', 'Configurações em desenvolvimento.')}
                    >
                        <Feather name="settings" size={20} color={isDarkMode ? COLORS.textLight : COLORS.textDark} />
                    </TouchableOpacity>
                </View>

                {/* Cartão Atlântico */}
                <AtlanticoCard isDarkMode={isDarkMode} />
                
                {/* Espaçador */}
                <View style={carteiraStyles.cardSpacer} />

                {/* Seção de Saldo */}
                <SaldoSection 
                    isDarkMode={isDarkMode} 
                    saldo={saldo} 
                    onNavigateToRecibos={handleNavigateToRecibos}
                    onNavigateToComprovativos={handleNavigateToComprovativos}
                />

                {/* Seção de Confirmação de Pagamento */}
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
                                    <Text style={carteiraStyles.paymentLabel}>Para Estudante</Text>
                                    <Text style={carteiraStyles.paymentValue}>{estudante_alvo_id}</Text>
                                </>
                            )}
                            
                            <View style={carteiraStyles.paymentDivider} />
                            
                            <Text style={carteiraStyles.paymentLabel}>Valor Total</Text>
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
                                <ActivityIndicator color={COLORS.white} size="small" />
                            ) : (
                                <>
                                    <Feather name="credit-card" size={18} color={COLORS.white} />
                                    <Text style={carteiraStyles.payButtonText}>
                                        {valorTotalNum > saldo ? 'Saldo Insuficiente' : `Pagar ${formatCurrency(valorTotalNum)}`}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>

                        {/* Mensagem de saldo insuficiente */}
                        {valorTotalNum > saldo && (
                            <Text style={[sharedStyles.errorText, { textAlign: 'center', marginTop: 10 }]}>
                                💳 Saldo insuficiente! Recarregue sua carteira para continuar.
                            </Text>
                        )}

                        {/* Informações de debug (opcional) */}
                        {__DEV__ && (
                            <View style={{ marginTop: 15, padding: 10, backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5', borderRadius: 8 }}>
                                <Text style={{ fontSize: 12, color: isDarkMode ? '#CCC' : '#666', textAlign: 'center' }}>
                                    🔍 Debug: Valor={valorTotalNum} | Saldo={saldo} | Suficiente={saldo >= valorTotalNum ? 'SIM' : 'NÃO'}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Grid de funcionalidades */}
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

                {/* Espaço extra no final */}
                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
}
