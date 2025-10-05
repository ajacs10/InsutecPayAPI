// /telas/transacao/TransactionScreen.tsx (Otimizado)

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';

// Imports da API e utilitários
import { verificarStatusPagamento, simularWebhook } from '../../../src/api/InsutecPayAPI';
import { formatCurrency } from '../../../src/utils/formatters';

// Imports de estilos (Assumidos)
import { styles, COLORS } from '../../../styles/_Transaction.styles';

// --- Constantes
type TransactionStatus = 'PENDENTE' | 'PAGO' | 'EXPIRADO' | 'ERRO';
const POLLING_INTERVAL = 5000; // 5 segundos
const MAX_WAIT_TIME = 300; // 5 minutos (300 segundos)

// ------------------------------------------------------------------
// Componente Auxiliar: Exibe o QR Code (Melhorado o data)
// ------------------------------------------------------------------
interface QRCodeProps {
    data: string; // Vai conter a string de dados do QR Code
    valor: number;
}
const QRCodeDisplay: React.FC<QRCodeProps> = ({ data, valor }) => (
    <View style={styles.qrCodeContainer}>
        <QRCode 
            value={data} 
            size={220} // Ligeiramente maior para melhor leitura
            color={COLORS.dark}
            backgroundColor={COLORS.white}
            quietZone={10}
        />
        <Text style={styles.qrCodeLabel}>Scanner M-Pesa / Express</Text>
        <Text style={styles.qrCodeValue}>{formatCurrency(valor)}</Text>
    </View>
);

// ------------------------------------------------------------------
// Ecrã Principal
// ------------------------------------------------------------------

export default function TransactionScreen() {
    // 1. Parâmetros recebidos
    const params = useLocalSearchParams();
    const idTransacaoUnica = params.id_transacao_unica as string;
    const valorTotal = parseFloat(params.valor_total as string) || 0; 
    const descricao = params.descricao as string || "Serviços Institucionais Selecionados"; 

    // 2. Estados
    const [status, setStatus] = useState<TransactionStatus>('PENDENTE');
    const [timeLeft, setTimeLeft] = useState(MAX_WAIT_TIME);
    const [caminhoRecibo, setCaminhoRecibo] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Referências para o Polling e Timer
    const pollingRef = useRef<NodeJS.Timeout | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // A string de dados do QR Code (Mais robusta)
    const qrCodeData = `INSUTECPAY|ID:${idTransacaoUnica}|V:${valorTotal}`;

    // 3. Funções de Verificação e Controlo
    const checkStatus = async (id: string) => { 
        if (!id) return;

        try {
            const result = await verificarStatusPagamento(id);
            const newStatus = result.status as TransactionStatus;
            
            // Se o status for final, limpa os intervalos
            if (newStatus === 'PAGO' || newStatus === 'EXPIRADO' || newStatus === 'ERRO') {
                if (pollingRef.current) clearInterval(pollingRef.current);
                if (timerRef.current) clearInterval(timerRef.current);
                pollingRef.current = null; // Reinicia a ref para evitar múltiplos inícios
                timerRef.current = null;
                
                setStatus(newStatus);
                if (newStatus === 'PAGO') {
                    setCaminhoRecibo(result.caminho_documento || null); 
                    Alert.alert("Sucesso!", "O seu pagamento foi confirmado.");
                }
            }
        } catch (err: any) {
            console.error("Erro no Polling:", err);
            if (pollingRef.current) clearInterval(pollingRef.current);
            if (timerRef.current) clearInterval(timerRef.current);
            setStatus('ERRO'); 
        }
    };

    // 4. Efeito de Polling e Timer
    useEffect(() => {
        if (!idTransacaoUnica || valorTotal <= 0) {
            setStatus('ERRO');
            return;
        }
        // Se o status já for final, não inicia nada.
        if (status !== 'PENDENTE') return; 

        // INICIALIZAÇÃO DE POLING E TIMER APENAS SE AINDA NÃO ESTIVEREM ATIVOS
        if (pollingRef.current === null) {
            console.log(`[Transaction] Iniciando Polling e Timer para ID: ${idTransacaoUnica}`);

            // 1. Inicia o Polling
            checkStatus(idTransacaoUnica); // Primeira verificação imediata
            pollingRef.current = setInterval(() => checkStatus(idTransacaoUnica), POLLING_INTERVAL);

            // 2. Inicia o Timer
            timerRef.current = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        // O checkStatus é chamado no próximo ciclo ou o status muda, limpando os timers.
                        setStatus('EXPIRADO'); 
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        // Cleanup: Limpa intervalos quando o componente é desmontado
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [idTransacaoUnica, valorTotal, status]); 

    // --- Funções Auxiliares de UI ---

    const handleSimularSucesso = async () => {
        if (idTransacaoUnica && status === 'PENDENTE' && !loading) {
            setLoading(true);
            Alert.alert("Simulação", "A simular a confirmação do pagamento (Webhook de Sucesso)...");
            
            try {
                // Simula o webhook, o próximo polling irá buscar o status atualizado
                await simularWebhook(idTransacaoUnica, 'PAGO'); 
            } catch (error) {
                Alert.alert("Erro na Simulação", "Falha ao simular webhook. Verifique a API.");
            }

            setLoading(false);
        }
    };
    
    const handleDownloadRecibo = () => {
        if (caminhoRecibo) {
            const fullUrl = `https://insutecpayapi.onrender.com${caminhoRecibo}`; 
            
            if (Platform.OS === 'web') {
                window.open(fullUrl, '_blank');
            } else {
                Alert.alert("Recibo", `Clique para baixar: ${fullUrl}`);
            }
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
                        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 10 }} />
                        <Text style={styles.statusTitle}>Aguardando Pagamento</Text>
                        <Text style={styles.timerText}>Tempo Restante: <Text style={{ fontWeight: 'bold' }}>{formatTime(timeLeft)}</Text></Text>
                        
                        <QRCodeDisplay 
                            data={qrCodeData} 
                            valor={valorTotal} 
                        />
                        
                        <Text style={styles.statusDescription}>
                            Use o seu serviço Multicaixa Express ou outra app de pagamento para ler o código acima.
                        </Text>
                        
                        {Platform.OS === 'web' && (
                             <TouchableOpacity style={styles.buttonSimulate} onPress={handleSimularSucesso} disabled={loading || status !== 'PENDENTE'}>
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
                const isExpired = status === 'EXPIRADO';
                return (
                    <View style={styles.transactionSection}>
                        <FontAwesome name="exclamation-triangle" size={80} color={COLORS.danger} />
                        <Text style={[styles.statusTitle, { color: COLORS.danger }]}>
                            {isExpired ? 'Tempo Esgotado' : 'Erro de Transação'}
                        </Text>
                        <Text style={styles.statusDescription}>
                            {isExpired ? 'O tempo para efetuar o pagamento expirou. Tente novamente iniciando uma nova transação.' : 'Ocorreu um erro. Tente novamente ou contacte o suporte.'}
                        </Text>
                        
                        <TouchableOpacity 
                            style={[styles.button, styles.buttonPrimary]} 
                            onPress={() => router.replace('/telas/dividas/DividasScreen')} // USAMOS REPLACE AQUI!
                        >
                            <Text style={styles.buttonText}>Tentar Novamente / Escolher Dívidas</Text>
                        </TouchableOpacity>
                    </View>
                );
        }
    };
    
    const isFinalStatus = status !== 'PENDENTE';

    // 5. Renderização Principal
    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
            <Stack.Screen 
                options={{ 
                    title: 'Processar Pagamento', 
                    // Se não for um estado final, usa um ícone de cadeado.
                    headerLeft: () => isFinalStatus 
                            ? null 
                            : () => (<FontAwesome name="lock" size={20} color={COLORS.white} style={{ marginLeft: 10 }} />),
                    // Garante que o usuário não pode arrastar para trás se o pagamento estiver pendente
                    gestureEnabled: isFinalStatus, 
                }}
            />
            
            <Text style={styles.title}>Confirmação de Transação</Text>

            {/* Cartão de Detalhes */}
            <View style={styles.detailCard}>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Serviço(s):</Text>
                    <Text style={styles.detailValue} numberOfLines={2}>{descricao}</Text>
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
