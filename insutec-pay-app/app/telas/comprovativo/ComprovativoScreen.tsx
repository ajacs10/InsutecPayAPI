// app/telas/comprovativo/ComprovativoScreen.tsx
// ou app/telas/comprovativo/[id].tsx

import React, { useCallback, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext/ThemeContext';
import { formatCurrency, formatDate } from '../../../src/utils/formatters';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
// Estilos de exemplo (Ajuste ou crie o seu próprio ficheiro de estilos se necessário)
import { styles, COLORS } from '../../../styles/_Comprovativo.styles';

// Tipagem dos parâmetros esperados
interface ComprovativoParams {
    id: string; // O ID de rota (para [id].tsx)
    id_transacao_unica: string;
    valor_total: string;
    metodo_pagamento: string;
    descricao: string;
    status: 'SUCESSO' | 'FALHA' | 'PENDENTE';
    data: string;
    saldo_anterior: string;
    saldo_atual: string;
}

const DEFAULT_PARAMS: ComprovativoParams = {
    id: '0000',
    id_transacao_unica: 'N/A',
    valor_total: '0.00',
    metodo_pagamento: 'N/A',
    descricao: 'Nenhuma Transação Encontrada',
    status: 'FALHA',
    data: new Date().toISOString(),
    saldo_anterior: '0.00',
    saldo_atual: '0.00',
};

// Componente Principal
export default function ComprovativoScreen() {
    const { isDarkMode } = useTheme();
    const params = useLocalSearchParams() as unknown as ComprovativoParams;

    // Mescla os parâmetros com os valores padrão para evitar erros
    const comprovativo = { ...DEFAULT_PARAMS, ...params };

    const valorTotal = parseFloat(comprovativo.valor_total);
    const saldoAtual = parseFloat(comprovativo.saldo_atual);
    
    // Referência para o ViewShot (para captura de tela)
    const viewShotRef = useRef<ViewShot>(null);
    const [isSharing, setIsSharing] = useState(false);

    // Mapeamento visual do Status
    const statusInfo = {
        SUCESSO: { color: COLORS.success, icon: 'check-circle', text: 'Pagamento Concluído' },
        PENDENTE: { color: COLORS.warning, icon: 'alert-circle', text: 'Em Processamento' },
        FALHA: { color: COLORS.danger, icon: 'close-circle', text: 'Falha na Transação' },
    };

    const currentStatus = statusInfo[comprovativo.status] || statusInfo.FALHA;
    const isSuccess = comprovativo.status === 'SUCESSO';
    
    // Função para compartilhar o comprovativo como imagem
    const handleShareComprovativo = useCallback(async () => {
        if (!viewShotRef.current || isSharing) return;

        setIsSharing(true);
        
        // 1. Capturar o ecrã
        try {
            const uri = await viewShotRef.current.capture();
            
            // 2. Mover para um local temporário (necessário para alguns SOs, como iOS)
            const fileName = `Comprovativo_InsutecPay_${comprovativo.id_transacao_unica}.jpg`;
            const tempFilePath = FileSystem.cacheDirectory + fileName;
            await FileSystem.moveAndRenameAsset(uri, tempFilePath, 'file');
            
            // 3. Verificar se o compartilhamento é suportado
            if (!(await Sharing.isAvailableAsync())) {
                Alert.alert('Erro', 'O compartilhamento de ficheiros não é suportado neste dispositivo.');
                return;
            }

            // 4. Compartilhar
            await Sharing.shareAsync(tempFilePath, {
                mimeType: 'image/jpeg',
                UTI: 'public.jpeg',
            });
            
        } catch (error) {
            console.error("Erro ao partilhar comprovativo:", error);
            Alert.alert('Erro', 'Não foi possível gerar ou partilhar o comprovativo.');
        } finally {
            setIsSharing(false);
        }
    }, [comprovativo.id_transacao_unica, isSharing]);

    // O layout do Expo Router deve ser configurado para esconder o cabeçalho.
    // Usamos Stack.Screen aqui para personalizar apenas este ecrã.
    return (
        <ScrollView style={styles.container(isDarkMode)} contentContainerStyle={{ flexGrow: 1, paddingTop: 20 }}>
            <Stack.Screen 
                options={{ 
                    title: 'Comprovativo',
                    headerShown: false, // Esconde o cabeçalho neste modal
                    presentation: 'modal',
                }} 
            />
            
            <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }} style={styles.viewShotContainer}>

                {/* Secção de Status (Top) */}
                <View style={styles.statusBox(isDarkMode, currentStatus.color)}>
                    <MaterialCommunityIcons 
                        name={currentStatus.icon as any} 
                        size={48} 
                        color={currentStatus.color} 
                    />
                    <Text style={styles.statusText(currentStatus.color)}>{currentStatus.text}</Text>
                </View>

                {/* 1. Detalhes da Transação */}
                <View style={styles.detailCard(isDarkMode)}>
                    <Text style={styles.sectionTitle(isDarkMode)}>Detalhes da Transação</Text>
                    
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel(isDarkMode)}>ID Transação:</Text>
                        <Text style={styles.detailValue(isDarkMode)}>{comprovativo.id_transacao_unica}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel(isDarkMode)}>Data e Hora:</Text>
                        <Text style={styles.detailValue(isDarkMode)}>{formatDate(comprovativo.data)}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel(isDarkMode)}>Descrição:</Text>
                        <Text style={styles.detailValue(isDarkMode)}>{comprovativo.descricao}</Text>
                    </View>

                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel(isDarkMode)}>Método de Pagamento:</Text>
                        <Text style={styles.detailValue(isDarkMode)}>{comprovativo.metodo_pagamento}</Text>
                    </View>
                </View>

                {/* 2. Resumo Financeiro */}
                <View style={styles.summaryCard(isDarkMode)}>
                    <Text style={styles.sectionTitle(isDarkMode)}>Resumo Financeiro</Text>
                    
                    {/* Linha de Valor Total */}
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel(isDarkMode)}>VALOR PAGO</Text>
                        <Text style={styles.summaryValue(isDarkMode)}>{formatCurrency(valorTotal)}</Text>
                    </View>

                    {/* Linha de Saldo Anterior */}
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel(isDarkMode)}>Saldo Anterior</Text>
                        <Text style={styles.summaryMinor(isDarkMode)}>{formatCurrency(parseFloat(comprovativo.saldo_anterior))}</Text>
                    </View>
                    
                    {/* Linha de Saldo Atual */}
                    {isSuccess && (
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel(isDarkMode)}>Saldo Atual</Text>
                            <Text style={styles.summaryMinor(isDarkMode)}>{formatCurrency(saldoAtual)}</Text>
                        </View>
                    )}
                </View>
            </ViewShot>

            {/* Ações: Partilhar e Concluir */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity 
                    style={styles.shareButton} 
                    onPress={handleShareComprovativo}
                    disabled={isSharing}
                >
                    <FontAwesome name="share-alt" size={20} color={COLORS.dark} style={{ marginRight: 10 }} />
                    <Text style={styles.shareButtonText}>{isSharing ? 'A preparar...' : 'Partilhar Comprovativo'}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.doneButton} 
                    onPress={() => router.replace('/telas/home/HomeScreen')} // Redireciona para o ecrã principal
                >
                    <Text style={styles.doneButtonText}>Concluir</Text>
                </TouchableOpacity>
            </View>
            
        </ScrollView>
    );
}
