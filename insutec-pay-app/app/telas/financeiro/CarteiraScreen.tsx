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
// Substitua estes imports pelos seus caminhos reais
import { COLORS, sharedStyles } from '../../../styles/_SharedFinance.styles';
import { carteiraStyles } from '../../../styles/_Carteira.styles';
import { useFinance } from '../../../components/FinanceContext'; 
import { useAuth } from '../../../components/AuthContext';
import { formatCurrency } from '../../../src/utils/formatters';

const { width } = Dimensions.get('window');

// ====================================================================
// COMPONENTES AUXILIARES (ATLANTIOCARD e SALDOSECTION) - MANTIDOS
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
        return 'ajacs dacosta';
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
                {/* ... Conteúdo da Frente do Cartão ... */}
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
                {/* ... Conteúdo do Verso do Cartão ... */}
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
// TELA PRINCIPAL (CARTEIRASCREEN) - FLUXO DE NAVEGAÇÃO APÓS PAGAMENTO AJUSTADO
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

    // 🛑 CORREÇÃO PRINCIPAL: Garante que o valor total é um número válido (float)
    // O 'valor_total' deve vir formatado sem separadores de milhar (apenas ponto decimal)
    // Ex: "75000.00" e não "75.000,00"
    const valorTotalNum = parseFloat(valor_total || '0') || 0; 
    
    // Verificação para debug (opcional, ajuda a confirmar o valor)
    useEffect(() => {
        if (id_transacao_unica && valor_total && descricao) {
            console.log('--- Debug de Pagamento Recebido ---');
            console.log('Valor STRING (param):', valor_total);
            console.log('Valor FLOAT (uso):', valorTotalNum);
            console.log('Saldo Atual:', saldo);
            console.log('Resultado da Comparação (Saldo < Valor):', saldo < valorTotalNum);
            console.log('------------------------------------');
        }
    }, [id_transacao_unica, valor_total, descricao, valorTotalNum, saldo]);

    // ✅ FUNÇÃO ATUALIZADA - Com fluxo de navegação simplificado
    const handlePagar = async () => {
        if (!id_transacao_unica || !valor_total || !descricao) {
            Alert.alert('Erro', 'Informações de pagamento incompletas.');
            return;
        }

        // Verifica o Saldo com o valor CORRIGIDO (float)
        if (valorTotalNum > saldo) {
            Alert.alert('Erro', 'Saldo insuficiente para realizar esta transação. Por favor, recarregue sua carteira.');
            return;
        }

        setIsProcessing(true);
        
        try {
            const success = await processarPagamento(
                valorTotalNum, // Passando o valor como NUMBER
                descricao,
                id_transacao_unica,
                'Cartão Atlântico Universitário+',
                tipo_servico as any,
                estudante_alvo_id
            );

            if (success) {
                // ✅ FLUXO LIMPO: Redireciona diretamente para a tela de Sucesso.
                // A SuccessScreen deve ter o botão "Ver Comprovativo" que usa o id_transacao_unica
                router.replace({
                    pathname: '/telas/Success/SuccessScreen',
                    params: {
                        tipo_servico: tipo_servico || 'OUTRO',
                        descricao: descricao,
                        valor_total: valor_total,
                        id_transacao_unica: id_transacao_unica
                    }
                });
            } else {
                // O `processarPagamento` deve tratar erros internos e mostrar um Alert
                // Mas garantimos aqui que o usuário seja notificado caso o context retorne false
                Alert.alert('❌ Falha', 'O pagamento não pôde ser concluído. Verifique o saldo ou tente novamente.');
            }
        } catch (error) {
            console.error('❌ Erro no pagamento:', error);
            Alert.alert('❌ Erro', 'Ocorreu um erro inesperado. Tente novamente.');
        } finally {
            setIsProcessing(false);
        }
    };

    // ✅ ROTAS CORRIGIDAS - Baseadas na sua estrutura de pastas
    const handleNavigateToRecibos = () => {
        router.push('/telas/financeiro/RecibosScreen');
    };

    const handleNavigateToComprovativos = () => {
        router.push('/telas/historico/HistoricoScreen');
    };

    return (
        <View style={sharedStyles.container(isDarkMode)}> 
            {/* Configuração do Header */}
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
                    onNavigateToComprovativos={handleNavigateToComprovativos}
                />

                {/* Seção de Confirmação de Pagamento: Só aparece se houver valor_total válido */}
                {valorTotalNum > 0 && (
                    <View style={carteiraStyles.paymentSection(isDarkMode)}>
                        <View style={carteiraStyles.paymentHeader}>
                            <Ionicons name="card-outline" size={20} color={COLORS.primary} />
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
                            // 🛑 Desabilita se estiver processando OU se o saldo for insuficiente
                            disabled={isProcessing || valorTotalNum > saldo} 
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

                        {/* Mensagem de Saldo Insuficiente */}
                        {valorTotalNum > saldo && (
                            <Text style={[carteiraStyles.errorText, { textAlign: 'center', marginTop: 10 }]}>
                                ❌ Saldo insuficiente! Por favor, recarregue para prosseguir.
                            </Text>
                        )}
                    </View>
                )}

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
        </View>
    );
}

