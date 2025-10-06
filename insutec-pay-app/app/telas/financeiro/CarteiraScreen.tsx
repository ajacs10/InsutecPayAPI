import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Platform, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { useTheme } from '../ThemeContext/ThemeContext';
// Assumindo que este ficheiro de estilos está correto
import { styles, COLORS } from '../../../styles/_Carteira.styles'; 
import { formatCurrency } from '../../../src/utils/formatters';

interface Cartao {
    id: string;
    numero: string;
    nomeTitular: string;
    validade: string;
}

const CardAtlantico: React.FC<{
    cartao: Cartao;
    isDarkMode: boolean;
}> = React.memo(({ cartao, isDarkMode }) => {
    const maskedNumber = '**** **** **** ' + cartao.numero.slice(-4);
    const titular = cartao.nomeTitular.toUpperCase();

    return (
        <View style={styles.atlanticoCard(isDarkMode)}>
            <View>
                <View style={styles.headerCard}>
                    <Text style={styles.cardLabel}>BANCO MILLENNIUM ATLANTICO</Text>
                </View>
                <View style={{ alignItems: 'center', marginTop: 5 }}>
                    <Text style={styles.cardType}>UNIVERSITÁRIO +</Text>
                </View>
            </View>
            <Text style={styles.cardNumber}>{maskedNumber}</Text>
            <View style={styles.footerCard}>
                <View>
                    <Text style={styles.footerLabel}>VÁLIDO ATÉ</Text>
                    <Text style={styles.footerValue}>{cartao.validade}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.footerLabel}>TITULAR</Text>
                    <Text style={styles.footerValue}>{titular}</Text>
                </View>
            </View>
        </View>
    );
});

export default function CarteiraScreen() {
    const { isDarkMode } = useTheme();
    const params = useLocalSearchParams();
    
    // Estado para gerir a transação pendente (pode ser null)
    const [transacaoPendente, setTransacaoPendente] = useState<{
        id: string;
        valor: number;
        descricao: string;
    } | null>(null);

    const [saldoCarteira, setSaldoCarteira] = useState(0);
    const [cartaoPrincipal, setCartaoPrincipal] = useState<Cartao | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [novoCartao, setNovoCartao] = useState({
        numero: '',
        nomeTitular: '',
        validade: '',
    });

    // Variáveis derivadas do estado/params
    const idTransacaoUnica = transacaoPendente?.id;
    const valorTotal = transacaoPendente?.valor || 0;
    const descricao = transacaoPendente?.descricao || 'Serviços Institucionais Selecionados';


    // 1. Efeito para carregar dados iniciais (saldo e cartão)
    useEffect(() => {
        // Mocking: Carregar saldo e cartão ao iniciar
        const mockCartao: Cartao = {
            id: '3',
            numero: '0000000000008652',
            nomeTitular: 'ANA SOBRINHO',
            validade: '12/27',
        };
        setCartaoPrincipal(mockCartao);
        const mockSaldo = 5000000.00; // Saldo alto para testes
        setSaldoCarteira(mockSaldo);
    }, []);
    
    // 2. Efeito CORRIGIDO para carregar a transação dos params (Prevenção de loop)
    useEffect(() => {
        const idTransacaoUnicaParam = params.id_transacao_unica as string;
        const valorTotalParam = parseFloat(params.valor_total as string) || 0; 
        const descricaoParam = params.descricao as string || 'Serviços Institucionais Selecionados';
        
        const novaTransacao = (idTransacaoUnicaParam && valorTotalParam > 0)
            ? {
                id: idTransacaoUnicaParam,
                valor: valorTotalParam,
                descricao: descricaoParam,
            }
            : null;
            
        // **PREVENÇÃO DO LOOP INFINITO:** Só atualize o estado se o ID for diferente
        const currentId = transacaoPendente?.id || null;
        const newId = novaTransacao?.id || null;
        
        if (currentId !== newId) {
            setTransacaoPendente(novaTransacao);
            setError(null);
            
            if (!novaTransacao) {
                // Se estiver a limpar a transação (por exemplo, após um pagamento), garante que
                // não há erro residual do ecrã anterior.
                setError(null);
            }
        }
        
        if (!idTransacaoUnicaParam && valorTotalParam > 0) {
             console.error('[CarteiraScreen] Parâmetros de transação incompletos (Valor sem ID).');
             setError('Parâmetros de transação incompletos. Por favor, tente novamente.');
             // setTransacaoPendente(null); // Isto já é coberto pela lógica acima
        }

    }, [params, transacaoPendente?.id]); // Depende do 'params' e do ID atual do estado


    const handleAddCartao = useCallback(() => {
        if (!novoCartao.numero || !novoCartao.nomeTitular || !novoCartao.validade) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos do cartão.');
            return;
        }
        if (!/^\d{2}\/\d{2}$/.test(novoCartao.validade)) {
            Alert.alert('Erro', 'Formato de validade inválido. Use MM/AA (ex: 12/27).');
            return;
        }

        const novo: Cartao = {
            id: `CARTAO-${Date.now()}`,
            numero: novoCartao.numero,
            nomeTitular: novoCartao.nomeTitular.toUpperCase(),
            validade: novoCartao.validade,
        };

        setCartaoPrincipal(novo);
        setNovoCartao({ numero: '', nomeTitular: '', validade: '' });
        setIsAdding(false);
        Alert.alert('Sucesso', `Novo cartão de ${novo.nomeTitular} registado como principal.`);
    }, [novoCartao]);

    const handlePagarComCartao = useCallback(() => {
        console.log('[CarteiraScreen] Pagamento iniciado (handlePagarComCartao chamado).'); 
        
        if (!cartaoPrincipal) {
            setError('Nenhum cartão registrado. Adicione um cartão para prosseguir.');
            Alert.alert('Erro', 'Nenhum cartão registrado. Adicione um cartão para prosseguir.');
            return;
        }

        if (valorTotal <= 0 || !idTransacaoUnica) {
            console.log('[CarteiraScreen] Validação falhou: Transação ou valor inválido.', { valorTotal, idTransacaoUnica });
            Alert.alert('Erro', 'Transação inválida ou sem valor a pagar.');
            return; 
        }

        if (saldoCarteira < valorTotal) {
            setError('Saldo insuficiente para completar esta transação.');
            Alert.alert('Saldo Insuficiente', 'O seu saldo disponível na conta virtual não é suficiente para esta transação.');
            return;
        }

        // --- INÍCIO DO FLUXO DE PAGAMENTO ---
        Alert.alert(
            'Confirmar Pagamento',
            `Usar o cartão (Atlântico Universitário+) de ${cartaoPrincipal.nomeTitular} para pagar ${formatCurrency(valorTotal)}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    onPress: () => {
                        setIsLoading(true);
                        const saldoAnterior = saldoCarteira;

                        // Simulação de transação
                        setTimeout(() => {
                            const novoSaldo = saldoCarteira - valorTotal;
                            
                            // 1. REDUÇÃO DO SALDO E FIM DO LOADING
                            setSaldoCarteira(novoSaldo);
                            setIsLoading(false);
                            
                            // 2. LIMPEZA DA TRANSAÇÃO PENDENTE para voltar ao estado "normal" da Carteira
                            setTransacaoPendente(null);
                            setError(null);
                            
                            // 3. ALERTA DE CONFIRMAÇÃO DO PAGAMENTO
                            Alert.alert(
                                '✅ Pagamento Concluído com Sucesso!',
                                `Pagamento de ${formatCurrency(valorTotal)} para ${descricao} realizado. O seu novo saldo é de ${formatCurrency(novoSaldo)}. Deseja visualizar o comprovativo?`,
                                [
                                    { 
                                        text: 'Voltar', 
                                        style: 'cancel', 
                                        onPress: () => {
                                            // Apenas fechar o alerta e ficar na tela (com saldo atualizado)
                                            console.log('[CarteiraScreen] Voltando ao estado normal da carteira.');
                                            // A navegação de volta para a PropinaScreen fica a cargo do utilizador,
                                            // já que a transação foi concluída.
                                        }
                                    },
                                    {
                                        text: 'Ver Comprovativo',
                                        onPress: () => {
                                            router.replace({ // Usar replace para sair do fluxo de pagamento
                                                pathname: '/telas/comprovativo/ComprovativoScreen',
                                                params: {
                                                    id: idTransacaoUnica,
                                                    id_transacao_unica: idTransacaoUnica,
                                                    valor_total: valorTotal.toFixed(2),
                                                    metodo_pagamento: `Atlântico Universitário+ **** ${cartaoPrincipal.numero.slice(-4)}`,
                                                    descricao,
                                                    status: 'SUCESSO',
                                                    data: new Date().toISOString(),
                                                    saldo_anterior: saldoAnterior.toFixed(2),
                                                    saldo_atual: novoSaldo.toFixed(2),
                                                },
                                            });
                                        },
                                    },
                                ]
                            );
                        }, 1500); // 1.5 segundos de simulação de processamento
                    },
                },
            ]
        );
    }, [cartaoPrincipal, saldoCarteira, valorTotal, idTransacaoUnica, descricao]);

    const handleRecarregar = useCallback(() => {
        Alert.alert('Recarregar Carteira', 'Inicia o fluxo para adicionar fundos (via Referência ou API).');
    }, []);

    const isPaymentDisabled = isLoading || !cartaoPrincipal || valorTotal <= 0 || saldoCarteira < valorTotal || !transacaoPendente;
    
    console.log('[CarteiraScreen] Estado do botão de pagamento:', { 
        isPaymentDisabled, 
        isLoading, 
        cartaoPrincipal: !!cartaoPrincipal,
        valorTotal, 
        saldoCarteira, 
        isSaldoSuficiente: saldoCarteira >= valorTotal,
        hasTransaction: !!transacaoPendente
    });

    if (isLoading) {
        return (
            <View style={styles.loadingContainer(isDarkMode)}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText(isDarkMode)}>A processar pagamento e gerar comprovativo...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView style={styles.container(isDarkMode)} contentContainerStyle={{ paddingBottom: 50 }}>
                <Stack.Screen options={{ title: 'Minha Carteira' }} />
                <Text style={styles.title(isDarkMode)}>Gestão Financeira</Text>

                {cartaoPrincipal ? (
                    <CardAtlantico cartao={cartaoPrincipal} isDarkMode={isDarkMode} />
                ) : (
                    <Text style={styles.emptyText(isDarkMode)}>Nenhum cartão registado. Adicione um para pagar.</Text>
                )}

                <View style={styles.saldoCard(isDarkMode)}>
                    <Text style={styles.saldoLabel}>SALDO DISPONÍVEL (Conta Virtual)</Text>
                    <Text style={styles.saldoValue(isDarkMode)}>{formatCurrency(saldoCarteira)}</Text>
                    <View style={styles.saldoActions}>
                        <TouchableOpacity style={styles.recargaButton} onPress={handleRecarregar}>
                            <MaterialCommunityIcons name="wallet-plus" size={20} color={COLORS.dark} />
                            <Text style={styles.recargaButtonText}>Recarregar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.retirarButton}
                            onPress={() => Alert.alert('Funcionalidade', 'Levantamentos serão implementados após a integração bancária.')}
                        >
                            <MaterialCommunityIcons name="bank-transfer-out" size={20} color={COLORS.dark} />
                            <Text style={styles.retirarButtonText}>Levantar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {transacaoPendente ? (
                    <View style={styles.detailCard(isDarkMode)}>
                        <Text style={styles.sectionTitle(isDarkMode)}>Resumo da Transação Pendente</Text>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel(isDarkMode)}>Serviço(s):</Text>
                            <Text style={styles.detailValue(isDarkMode)}>{descricao}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel(isDarkMode)}>Total a Pagar:</Text>
                            <Text style={styles.detailValue(isDarkMode)}>{formatCurrency(valorTotal)}</Text>
                        </View>
                        {error && <Text style={styles.error(isDarkMode)}>{error}</Text>}
                        <TouchableOpacity
                            style={[styles.payButton, isPaymentDisabled ? styles.payButtonDisabled : {}]}
                            onPress={handlePagarComCartao}
                            disabled={isPaymentDisabled}
                        >
                            <Text style={styles.payButtonText}>
                                PAGAR {cartaoPrincipal ? `**** ${cartaoPrincipal.numero.slice(-4)}` : ''}
                            </Text>
                        </TouchableOpacity>
                        {saldoCarteira < valorTotal && (
                            <Text style={{ color: COLORS.danger, textAlign: 'center', marginTop: 10 }}>
                                Saldo insuficiente para completar esta transação.
                            </Text>
                        )}
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => {
                                setTransacaoPendente(null);
                                setError(null);
                                router.back(); // Volta para a tela anterior (PropinaScreen ou Checkout)
                            }}
                        >
                             <Text style={styles.cancelButtonText}>Cancelar Transação e Voltar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.detailCard(isDarkMode)}>
                        <Text style={styles.sectionTitle(isDarkMode)}>Estado Operacional</Text>
                        <Text style={styles.emptyText(isDarkMode)}>
                            Não há transações pendentes para pagamento.
                        </Text>
                        <Text style={styles.emptyText(isDarkMode)}>
                            O seu saldo está disponível para uso ou levantamento.
                        </Text>
                    </View>
                )}

                <View style={styles.section(isDarkMode)}>
                    <Text style={styles.sectionTitle(isDarkMode)}>
                        {isAdding ? 'Registar Novo Cartão Multicaixa' : 'Gerenciar Cartões'}
                    </Text>
                    {isAdding ? (
                        <>
                            <TextInput
                                style={styles.input(isDarkMode)}
                                placeholder="Número do Cartão (16 dígitos)"
                                placeholderTextColor={COLORS.subText}
                                value={novoCartao.numero}
                                onChangeText={(text) => setNovoCartao({ ...novoCartao, numero: text })}
                                keyboardType="numeric"
                                maxLength={16}
                            />
                            <TextInput
                                style={styles.input(isDarkMode)}
                                placeholder="Nome do Titular"
                                placeholderTextColor={COLORS.subText}
                                value={novoCartao.nomeTitular}
                                onChangeText={(text) => setNovoCartao({ ...novoCartao, nomeTitular: text })}
                            />
                            <TextInput
                                style={styles.input(isDarkMode)}
                                placeholder="Validade (MM/AA)"
                                placeholderTextColor={COLORS.subText}
                                value={novoCartao.validade}
                                onChangeText={(text) => setNovoCartao({ ...novoCartao, validade: text })}
                                maxLength={5}
                            />
                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.button(isDarkMode)} onPress={handleAddCartao}>
                                    <Text style={styles.buttonText}>Registar Cartão</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button(isDarkMode), styles.buttonCancel]}
                                    onPress={() => setIsAdding(false)}
                                >
                                    <Text style={styles.buttonText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <TouchableOpacity style={styles.button(isDarkMode)} onPress={() => setIsAdding(true)}>
                            <FontAwesome name="credit-card" size={20} color={COLORS.white} style={{ marginRight: 10 }} />
                            <Text style={styles.buttonText}>Adicionar Novo Cartão</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
