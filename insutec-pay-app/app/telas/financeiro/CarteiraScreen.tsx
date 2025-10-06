// /telas/financeiro/CarteiraScreen.tsx (FINAL)

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Platform, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams, Stack } from 'expo-router'; 
import { useTheme } from '../ThemeContext/ThemeContext';
// Importação dos estilos do ficheiro de estilos
import { styles, COLORS } from '../../../styles/_Carteira.styles'; 
import { formatCurrency } from '../../../src/utils/formatters';

// Interface para cartão
interface Cartao {
    id: string;
    numero: string;
    nomeTitular: string;
    validade: string;
}

// 🎯 COMPONENTE AUXILIAR: Card Atlântico Universitário
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

            <Text style={styles.cardNumber}>
                {maskedNumber} 
            </Text>

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

// =========================================================================
// COMPONENTE PRINCIPAL: CarteiraScreen
// =========================================================================
export default function CarteiraScreen() {
    const { isDarkMode } = useTheme();
    const params = useLocalSearchParams();
    
    // Parâmetros recebidos da tela anterior (Carrinho/Checkout)
    const idTransacaoUnica = params.id_transacao_unica as string;
    const valorTotal = parseFloat(params.valor_total as string) || 0;
    const descricao = params.descricao as string || 'Serviços Institucionais Selecionados';

    // ESTADOS PRINCIPAIS
    const [saldoCarteira, setSaldoCarteira] = useState(0); 
    const [cartaoPrincipal, setCartaoPrincipal] = useState<Cartao | null>(null); 
    const [isLoading, setIsLoading] = useState(false); 

    const [novoCartao, setNovoCartao] = useState({
        numero: '',
        nomeTitular: '',
        validade: '',
    });
    const [isAdding, setIsAdding] = useState(false);

    // Efeito para carregar dados iniciais (simulação)
    useEffect(() => {
        const mockCartao: Cartao = { 
            id: '3', 
            numero: '0000000000008652', 
            nomeTitular: 'ANA SOBRINHO', 
            validade: '12/27' 
        };
        setCartaoPrincipal(mockCartao);
        
        // Saldo inicial
        const mockSaldo = 5000000.00; 
        setSaldoCarteira(mockSaldo);
    }, []);

    // Lógica para adicionar novo cartão
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
        Alert.alert("Sucesso", `Novo cartão de ${novo.nomeTitular} registado como principal.`);
    }, [novoCartao]);


    // 🎯 LÓGICA PRINCIPAL: Pagamento e Navegação para Comprovativo
    const handlePagarComCartao = useCallback(() => {
        if (!cartaoPrincipal || valorTotal === 0) {
            Alert.alert("Erro", "Nenhum cartão ou transação válida selecionada.");
            return;
        }
        
        if (saldoCarteira < valorTotal) {
            Alert.alert("Saldo Insuficiente", "O seu saldo disponível na conta virtual não é suficiente para esta transação.");
            return;
        }

        Alert.alert(
            'Confirmar Pagamento',
            `Usar o cartão (Atlântico Universitário+) de ${cartaoPrincipal.nomeTitular} para pagar ${formatCurrency(valorTotal)}?`,
            [
                { text: 'Cancelar' },
                {
                    text: 'Confirmar',
                    onPress: () => {
                        setIsLoading(true); 
                        const saldoAnterior = saldoCarteira;

                        // SIMULAÇÃO DE TRANSAÇÃO E ATUALIZAÇÃO DO SALDO
                        setTimeout(() => {
                            const novoSaldo = saldoCarteira - valorTotal;
                            setSaldoCarteira(novoSaldo);
                            setIsLoading(false); 
                            
                            // 🚀 NAVEGAÇÃO CORRIGIDA PARA O COMPROVATIVO SCREEN (Rota Estática/File Name)
                            router.push({
                                pathname: '/telas/comprovativo/ComprovativoScreen', 
                                params: {
                                    // Passa o ID também para a rota estática, apenas como parâmetro de busca
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
                        }, 1500); 
                    },
                },
            ]
        );
    }, [cartaoPrincipal, saldoCarteira, valorTotal, idTransacaoUnica, descricao]);
    
    const handleRecarregar = () => {
        Alert.alert("Recarregar Carteira", "Inicia o fluxo para adicionar fundos (via Referência ou API).");
    };
        
    const isPaymentDisabled = isLoading || !cartaoPrincipal || valorTotal === 0 || saldoCarteira < valorTotal;

    // Renderiza Loading enquanto processa
    if (isLoading) {
        return (
            <View style={styles.loadingContainer(isDarkMode)}>
                <ActivityIndicator size="large" color={COLORS.primary} /> 
                <Text style={styles.loadingText(isDarkMode)}>A processar pagamento e gerar comprovativo...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView style={styles.container(isDarkMode)} contentContainerStyle={{ paddingBottom: 50 }}>
                <Stack.Screen options={{ title: 'Minha Carteira' }} />
                
                <Text style={styles.title(isDarkMode)}>Gestão Financeira</Text>
                
                {/* 1. Cartão em Destaque (Topo) */}
                {cartaoPrincipal ? (
                    <CardAtlantico cartao={cartaoPrincipal} isDarkMode={isDarkMode} /> 
                ) : (
                    <Text style={styles.emptyText(isDarkMode)}>Nenhum cartão registado. Adicione um para pagar.</Text>
                )}
                
                {/* 2. Bloco de Saldo Disponível */}
                <View style={styles.saldoCard(isDarkMode)}>
                    <Text style={styles.saldoLabel}>SALDO DISPONÍVEL (Conta Virtual)</Text>
                    <Text style={styles.saldoValue(isDarkMode)}>{formatCurrency(saldoCarteira)}</Text>
                    
                    <View style={styles.saldoActions}>
                        <TouchableOpacity style={styles.recargaButton} onPress={handleRecarregar}>
                            <MaterialCommunityIcons name="wallet-plus" size={20} color={COLORS.dark} />
                            <Text style={styles.recargaButtonText}>Recarregar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.retirarButton} onPress={() => Alert.alert("Funcionalidade", "Levantamentos serão implementados após a integração bancária.")}>
                            <MaterialCommunityIcons name="bank-transfer-out" size={20} color={COLORS.dark} />
                            <Text style={styles.retirarButtonText}>Levantar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 3. Detalhes da Transação e Botão de Pagamento */}
                {idTransacaoUnica ? (
                    <View style={styles.detailCard(isDarkMode)}>
                        <Text style={styles.sectionTitle(isDarkMode)}>Resumo da Transação</Text>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel(isDarkMode)}>Serviço(s):</Text>
                            <Text style={styles.detailValue(isDarkMode)}>{descricao}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel(isDarkMode)}>Total a Pagar:</Text>
                            <Text style={styles.detailValue(isDarkMode)}>{formatCurrency(valorTotal)}</Text>
                        </View>
                        
                        <TouchableOpacity 
                            style={[styles.payButton, isPaymentDisabled ? styles.payButtonDisabled : {}]} 
                            onPress={handlePagarComCartao} 
                            disabled={isPaymentDisabled}
                        >
                            <Text style={styles.payButtonText}>PAGAR COM O CARTÃO {cartaoPrincipal ? cartaoPrincipal.numero.slice(-4) : ''}</Text>
                        </TouchableOpacity>
                        {saldoCarteira < valorTotal && (
                            <Text style={{ color: COLORS.danger, textAlign: 'center', marginTop: 10 }}>
                                Saldo insuficiente para completar esta transação.
                            </Text>
                        )}
                    </View>
                ) : (
                        <Text style={styles.emptyText(isDarkMode)}>Nenhuma transação pendente para pagamento na carteira.</Text>
                )}
                
                {/* 4. Formulário para Adicionar Cartão */}
                <View style={styles.section(isDarkMode)}>
                    <Text style={styles.sectionTitle(isDarkMode)}>
                        {isAdding ? 'Registar Novo Cartão Multicaixa' : 'Gerenciar Cartões'}
                    </Text>
                    {isAdding ? (
                        <>
                            <TextInput style={styles.input(isDarkMode)} placeholder="Número do Cartão (16 dígitos)" placeholderTextColor={COLORS.subText} value={novoCartao.numero} onChangeText={(text) => setNovoCartao({ ...novoCartao, numero: text })} keyboardType="numeric" maxLength={16} />
                            <TextInput style={styles.input(isDarkMode)} placeholder="Nome do Titular" placeholderTextColor={COLORS.subText} value={novoCartao.nomeTitular} onChangeText={(text) => setNovoCartao({ ...novoCartao, nomeTitular: text })} />
                            <TextInput style={styles.input(isDarkMode)} placeholder="Validade (MM/AA)" placeholderTextColor={COLORS.subText} value={novoCartao.validade} onChangeText={(text) => setNovoCartao({ ...novoCartao, validade: text })} maxLength={5} />
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
