// telas/transacao/TransactionScreen.tsx (Versão 2.0: Com QR Code e Polling)

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import QRCode from 'react-native-qrcode-svg'; // 💡 NOVO: Importa o componente QR Code

// Imports da API e utilitários
import { verificarStatusPagamento, simularWebhook } from '../../../src/api/InsutecPayAPI';
import { formatCurrency } from '../../../src/utils/formatters';

// Imports de estilos
import { styles, COLORS } from '../../../styles/_Transaction.styles';

// --- Constantes
type TransactionStatus = 'PENDENTE' | 'PAGO' | 'EXPIRADO' | 'ERRO'; // Simplificado
const POLLING_INTERVAL = 5000; // 5 segundos
const MAX_WAIT_TIME = 300; // 5 minutos (300 segundos)

// ------------------------------------------------------------------
// Componente Auxiliar: Exibe o QR Code
// ------------------------------------------------------------------
interface QRCodeProps {
    data: string;
    valor: number;
}
const QRCodeDisplay: React.FC<QRCodeProps> = ({ data, valor }) => (
    <View style={styles.qrCodeContainer}>
        <QRCode 
            value={data} // URL que o gateway M-Pesa/Express leria: insutecpay://txn/ID
            size={200}
            color={COLORS.dark}
            backgroundColor={COLORS.white}
        />
        <Text style={styles.qrCodeLabel}>Scanner M-Pesa / Express</Text>
        <Text style={styles.qrCodeValue}>{formatCurrency(valor)}</Text>
    </View>
);

// ------------------------------------------------------------------
// Ecrã Principal
// ------------------------------------------------------------------

export default function TransactionScreen() {
    // 1. Parâmetros recebidos (Assumindo que o Carrinho enviou o ID da transação)
    const params = useLocalSearchParams();
    const idTransacaoUnica = params.id_transacao_unica as string;
    const valorTotal = parseFloat(params.valor_total as string);
    // Descrição consolidada dos serviços, ex: "Propina, Taxa de Matrícula, Fardamento"
    const descricao = params.descricao as string || "Serviços Institucionais Selecionados"; 

    // 2. Estados
    const [status, setStatus] = useState<TransactionStatus>('PENDENTE'); // Já deve vir como PENDENTE
    const [timeLeft, setTimeLeft] = useState(MAX_WAIT_TIME);
    const [caminhoRecibo, setCaminhoRecibo] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Referência para o Polling (para o limpar)
    const pollingRef = useRef<NodeJS.Timeout | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // 3. Funções de Verificação e Controlo

    // Função para verificar o status do pagamento via Polling
    const checkStatus = useCallback(async (id: string) => {
        try {
            const result = await verificarStatusPagamento(id);
            const newStatus = result.status as TransactionStatus;
            
            console.log(`[Polling] ID: ${id} -> Status: ${newStatus}`);
            
            if (newStatus === 'PAGO' || newStatus === 'EXPIRADO') {
                if (pollingRef.current) clearInterval(pollingRef.current);
                if (timerRef.current) clearInterval(timerRef.current);
                
                setStatus(newStatus);
                if (newStatus === 'PAGO') {
                    // Assume que a API devolve o caminho do recibo se PAGO
                    setCaminhoRecibo(result.caminho_documento || null); 
                    Alert.alert("Sucesso!", "O seu pagamento foi confirmado.");
                }
            }
        } catch (err: any) {
            console.error("Erro no Polling:", err);
            // Se falhar o Polling, assume um ERRO de comunicação
            setStatus('ERRO'); 
        }
    }, []);

    // 4. Efeito de Polling e Timer
    useEffect(() => {
        if (!idTransacaoUnica) {
            setStatus('ERRO');
            return;
        }

        // Limpa tudo antes de iniciar
        if (pollingRef.current) clearInterval(pollingRef.current);
        if (timerRef.current) clearInterval(timerRef.current);

        if (status === 'PENDENTE') {
            // Inicia o Polling
            checkStatus(idTransacaoUnica); // Primeira verificação imediata
            pollingRef.current = setInterval(() => checkStatus(idTransacaoUnica), POLLING_INTERVAL);

            // Inicia o Timer
            timerRef.current = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        if (pollingRef.current) clearInterval(pollingRef.current);
                        if (timerRef.current) clearInterval(timerRef.current);
                        // Se o tempo esgotar e ainda estiver PENDENTE, muda para EXPIRADO
                        setStatus('EXPIRADO'); 
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        // Cleanup: Limpa intervalos quando o componente é desmontado ou o status muda
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [status, idTransacaoUnica, checkStatus]);
    
    // --- Funções Auxiliares de UI ---

    const handleSimularSucesso = async () => {
        if (idTransacaoUnica) {
            setLoading(true);
            Alert.alert("Simulação", "A simular a confirmação do pagamento (Webhook de Sucesso)...");
            await simularWebhook(idTransacaoUnica, 'PAGO');
            setLoading(false);
            // O próximo polling irá capturar o status 'PAGO'
        }
    };
    
    const handleDownloadRecibo = () => {
        if (caminhoRecibo) {
            const fullUrl = `http://localhost:3000${caminhoRecibo}`;
            Platform.OS === 'web' ? window.open(fullUrl, '_blank') : Alert.alert("Recibo", `Download de Recibo: ${fullUrl}`);
        } else {
            Alert.alert("Erro", "Recibo não disponível.");
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    const renderContent = () => {
        switch (status) {
            case 'PENDENTE':
                return (
                    <View style={styles.transactionSection}>
                        <Text style={styles.statusTitle}>Aguardando Pagamento</Text>
                        <Text style={styles.timerText}>Tempo Restante: <Text style={{ fontWeight: 'bold' }}>{formatTime(timeLeft)}</Text></Text>
                        
                        {/* 💡 INTEGRAÇÃO DO QR CODE */}
                        <QRCodeDisplay 
                            data={`insutecpay://txn/${idTransacaoUnica}`} 
                            valor={valorTotal} 
                        />
                        
                        <Text style={styles.statusDescription}>
                            Use o seu serviço Multicaixa Express ou outra app de pagamento para ler o código acima.
                        </Text>
                        
                        {Platform.OS === 'web' && (
                             <TouchableOpacity style={styles.buttonSimulate} onPress={handleSimularSucesso} disabled={loading}>
                                <Text style={styles.buttonSimulateText}>
                                    {loading ? 'A Simular...' : 'Simular Confirmação (Teste)'}
                                </Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={() => router.back()} disabled={loading}>
                            <Text style={styles.buttonText}>Cancelar Transação</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 'PAGO':
                return (
                    <View style={styles.transactionSection}>
                        <FontAwesome name="check-circle" size={80} color={COLORS.success} />
                        <Text style={[styles.statusTitle, { color: COLORS.success }]}>Pagamento Confirmado!</Text>
                        <Text style={styles.statusDescription}>O seu saldo foi atualizado. Obrigado.</Text>
                        
                        <TouchableOpacity 
                            style={[styles.button, styles.buttonPrimary]} 
                            onPress={handleDownloadRecibo}
                            disabled={!caminhoRecibo}
                        >
                            <FontAwesome name="file-pdf-o" size={20} color={COLORS.white} />
                            <Text style={styles.buttonText}> Baixar Recibo (PDF)</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.button, styles.buttonGoBack]} 
                            onPress={() => router.replace('/telas/dividas/DividasScreen')}
                        >
                            <Text style={styles.buttonGoBackText}>Voltar para Dívidas</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 'EXPIRADO':
            case 'ERRO':
                return (
                    <View style={styles.transactionSection}>
                        <FontAwesome name="exclamation-triangle" size={80} color={COLORS.error} />
                        <Text style={[styles.statusTitle, { color: COLORS.error }]}>
                            {status === 'EXPIRADO' ? 'Tempo Esgotado' : 'Erro de Transação'}
                        </Text>
                        <Text style={styles.statusDescription}>
                            {status === 'EXPIRADO' ? 'O tempo para efetuar o pagamento expirou.' : 'Ocorreu um erro. Tente novamente.'}
                        </Text>
                        
                        <TouchableOpacity 
                            style={[styles.button, styles.buttonPrimary]} 
                            onPress={() => router.replace('/telas/dividas/DividasScreen')}
                        >
                            <Text style={styles.buttonText}>Tentar Novamente / Escolher Dívidas</Text>
                        </TouchableOpacity>
                    </View>
                );
        }
    };
    
    const isFinalStatus = status === 'PAGO' || status === 'EXPIRADO' || status === 'ERRO';

    // 5. Renderização Principal
    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
            <Stack.Screen 
                options={{ 
                    title: 'Processar Pagamento', 
                    // Se não for um estado final, impede de voltar para trás
                    headerLeft: () => isFinalStatus ? null : <Text style={styles.headerTitle}>🔒 A Processar...</Text>,
                    gestureEnabled: isFinalStatus, 
                }}
            />
            
            <Text style={styles.title}>Confirmação de Transação</Text>

            {/* Cartão de Detalhes */}
            <View style={styles.detailCard}>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Serviço(s):</Text>
                    <Text style={styles.detailValue}>{descricao}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>ID Transação Única:</Text>
                    <Text style={styles.detailValue} selectable>{idTransacaoUnica || 'Aguardando...'}</Text>
                </View>
                <View style={[styles.detailItem, styles.totalRow]}>
                    <Text style={styles.totalLabel}>TOTAL A PAGAR:</Text>
                    <Text style={styles.totalValue}>{formatCurrency(valorTotal)}</Text>
                </View>
            </View>

            {/* Secção de Status Principal */}
            {renderContent()}
            
        </ScrollView>
    );
}
