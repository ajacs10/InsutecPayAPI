// app/telas/comprovativo/ComprovativoScreen.tsx
import React, { useRef, useState } from 'react';
import { useTheme } from '../ThemeContext/ThemeContext';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

// Cores fixas
const COLORS = {
    primary: '#39FF14',
    success: '#00C853',
    white: '#FFFFFF',
    dark: '#000000',
    darkBackground: '#0F0F0F',
    lightBackground: '#F0F2F5',
    cardDark: '#1F1F1F',
    cardLight: '#FFFFFF',
    textDark: '#1C1C1C',
    textLight: '#E0E0E0',
    subText: '#888888',
};

export default function ComprovativoScreen() {
    const { isDarkMode } = useTheme();
    const params = useLocalSearchParams();
    const [isSharing, setIsSharing] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Dados da transação
    const comprovativo = {
        id: String(params.id || '0000'),
        id_transacao_unica: String(params.id_transacao_unica || 'N/A'),
        valor_total: String(params.valor_total || '0.00'),
        metodo_pagamento: String(params.metodo_pagamento || 'N/A'),
        descricao: String(params.descricao || 'Nenhuma Transação Encontrada'),
        status: (params.status as 'SUCESSO') || 'SUCESSO',
        data: String(params.data || new Date().toISOString()),
        saldo_anterior: String(params.saldo_anterior || '0.00'),
        saldo_atual: String(params.saldo_atual || '0.00'),
    };

    const valorTotal = parseFloat(comprovativo.valor_total);
    const saldoAtual = parseFloat(comprovativo.saldo_atual);
    const saldoAnterior = parseFloat(comprovativo.saldo_anterior);

    const formatCurrency = (value: number) => {
        return `${value.toFixed(2)} AOA`;
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString('pt-AO');
        } catch {
            return 'Data inválida';
        }
    };

    const formatDateForPDF = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('pt-AO', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Data inválida';
        }
    };

    // Gerar HTML para o PDF
    const generatePDFHTML = () => {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Comprovativo de Pagamento</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    color: #333;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 3px solid #00C853;
                    padding-bottom: 20px;
                }
                .logo {
                    font-size: 24px;
                    font-weight: bold;
                    color: #39FF14;
                    margin-bottom: 10px;
                }
                .title {
                    font-size: 20px;
                    font-weight: bold;
                    color: #00C853;
                    margin-bottom: 5px;
                }
                .amount {
                    font-size: 28px;
                    font-weight: bold;
                    color: #39FF14;
                    margin: 10px 0;
                }
                .section {
                    margin-bottom: 25px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 15px;
                }
                .section-title {
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 15px;
                    color: #333;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 5px;
                }
                .row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #f0f0f0;
                }
                .label {
                    font-weight: 600;
                    color: #666;
                    flex: 1;
                }
                .value {
                    font-weight: 600;
                    text-align: right;
                    flex: 1.5;
                }
                .highlight {
                    font-size: 16px;
                    font-weight: 900;
                    color: #39FF14;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    color: #666;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">INSU TEC PAY</div>
                <div class="title">COMPROVATIVO DE PAGAMENTO</div>
                <div class="amount">${formatCurrency(valorTotal)}</div>
                <div style="color: #00C853; font-weight: bold;">✓ Pagamento Concluído com Sucesso</div>
            </div>

            <div class="section">
                <div class="section-title">DETALHES DA TRANSAÇÃO</div>
                <div class="row">
                    <div class="label">ID da Transação:</div>
                    <div class="value">${comprovativo.id_transacao_unica}</div>
                </div>
                <div class="row">
                    <div class="label">Data e Hora:</div>
                    <div class="value">${formatDateForPDF(comprovativo.data)}</div>
                </div>
                <div class="row">
                    <div class="label">Descrição:</div>
                    <div class="value">${comprovativo.descricao}</div>
                </div>
                <div class="row">
                    <div class="label">Método de Pagamento:</div>
                    <div class="value">${comprovativo.metodo_pagamento}</div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">RESUMO FINANCEIRO</div>
                <div class="row">
                    <div class="label">VALOR PAGO</div>
                    <div class="value highlight">${formatCurrency(valorTotal)}</div>
                </div>
                <div class="row">
                    <div class="label">Saldo Anterior</div>
                    <div class="value">${formatCurrency(saldoAnterior)}</div>
                </div>
                <div class="row">
                    <div class="label">Saldo Atual</div>
                    <div class="value">${formatCurrency(saldoAtual)}</div>
                </div>
            </div>

            <div class="footer">
                <p>Comprovativo gerado automaticamente pelo sistema Insu Tec Pay</p>
                <p>Este é um comprovativo válido para todos os efeitos</p>
                <p>Data de emissão: ${new Date().toLocaleDateString('pt-AO')}</p>
            </div>
        </body>
        </html>
        `;
    };

    // Download do PDF
    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        try {
            // Gerar o PDF
            const { uri } = await Print.printToFileAsync({
                html: generatePDFHTML(),
                base64: false,
            });

            // Mover para diretório de documentos
            const fileName = `Comprovativo_${comprovativo.id_transacao_unica}_${Date.now()}.pdf`;
            const directory = `${FileSystem.documentDirectory}comprovativos/`;
            
            // Criar diretório se não existir
            await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
            
            const newUri = `${directory}${fileName}`;
            await FileSystem.moveAsync({
                from: uri,
                to: newUri,
            });

            // Verificar se pode compartilhar
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(newUri, {
                    mimeType: 'application/pdf',
                    dialogTitle: 'Partilhar Comprovativo em PDF',
                });
            } else {
                Alert.alert(
                    'PDF Gerado com Sucesso!',
                    `O comprovativo foi guardado em: ${newUri}`,
                    [{ text: 'OK' }]
                );
            }

            Alert.alert('Sucesso', 'Comprovativo em PDF gerado e guardado com sucesso!');
            
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            Alert.alert('Erro', 'Não foi possível gerar o comprovativo em PDF.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShareComprovativo = async () => {
        setIsSharing(true);
        try {
            // Simular compartilhamento
            await new Promise(resolve => setTimeout(resolve, 1000));
            Alert.alert('Sucesso', 'Comprovativo preparado para partilha!');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível partilhar o comprovativo.');
        } finally {
            setIsSharing(false);
        }
    };

    const handleGoHome = () => {
        router.replace('/telas/home/HomeScreen');
    };

    return (
        <View style={{ 
            flex: 1, 
            backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground 
        }}>
            <Stack.Screen
                options={{
                    title: 'Comprovativo',
                    headerShown: true,
                }}
            />
            
            <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
                {/* Cabeçalho */}
                <View style={{
                    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
                    borderRadius: 15,
                    padding: 30,
                    alignItems: 'center',
                    marginBottom: 20,
                    borderBottomWidth: 5,
                    borderBottomColor: COLORS.success,
                    shadowColor: isDarkMode ? COLORS.white : COLORS.dark,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 5,
                    elevation: 4,
                }}>
                    <MaterialCommunityIcons name="check-circle" size={48} color={COLORS.success} />
                    <Text style={{ fontSize: 18, fontWeight: '700', marginTop: 15, color: COLORS.success }}>
                        Pagamento Concluído
                    </Text>
                    <Text style={{ fontSize: 32, fontWeight: '900', marginTop: 10, color: COLORS.primary }}>
                        {formatCurrency(valorTotal)}
                    </Text>
                </View>

                {/* Detalhes da Transação */}
                <View style={{
                    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
                    borderRadius: 15,
                    padding: 20,
                    marginBottom: 15,
                    shadowColor: isDarkMode ? COLORS.white : COLORS.dark,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 3,
                    elevation: 2,
                }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 15, color: isDarkMode ? COLORS.textLight : COLORS.textDark }}>
                        Detalhes da Transação
                    </Text>
                    
                    {[
                        { label: 'ID Transação:', value: comprovativo.id_transacao_unica },
                        { label: 'Data e Hora:', value: formatDate(comprovativo.data) },
                        { label: 'Descrição:', value: comprovativo.descricao },
                        { label: 'Método de Pagamento:', value: comprovativo.metodo_pagamento },
                    ].map((item, index) => (
                        <View key={index} style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingVertical: 10,
                            borderBottomWidth: index < 3 ? 1 : 0,
                            borderBottomColor: 'rgba(136, 136, 136, 0.1)',
                        }}>
                            <Text style={{ fontSize: 14, color: isDarkMode ? COLORS.subText : COLORS.textDark, flex: 1 }}>
                                {item.label}
                            </Text>
                            <Text style={{ 
                                fontSize: 14, 
                                fontWeight: '600', 
                                color: isDarkMode ? COLORS.textLight : COLORS.textDark, 
                                textAlign: 'right', 
                                flex: 1.5 
                            }}>
                                {item.value}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Resumo Financeiro */}
                <View style={{
                    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
                    borderRadius: 15,
                    padding: 20,
                    marginBottom: 15,
                    shadowColor: isDarkMode ? COLORS.white : COLORS.dark,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 3,
                    elevation: 2,
                }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 15, color: isDarkMode ? COLORS.textLight : COLORS.textDark }}>
                        Resumo Financeiro
                    </Text>
                    
                    {[
                        { label: 'VALOR PAGO', value: formatCurrency(valorTotal), highlight: true },
                        { label: 'Saldo Anterior', value: formatCurrency(saldoAnterior), highlight: false },
                        { label: 'Saldo Atual', value: formatCurrency(saldoAtual), highlight: false },
                    ].map((item, index) => (
                        <View key={index} style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingVertical: 10,
                            borderBottomWidth: index < 2 ? 1 : 0,
                            borderBottomColor: 'rgba(136, 136, 136, 0.1)',
                        }}>
                            <Text style={{ 
                                fontSize: 14, 
                                color: isDarkMode ? COLORS.subText : COLORS.textDark, 
                                flex: 1,
                                fontWeight: item.highlight ? '700' : '400'
                            }}>
                                {item.label}
                            </Text>
                            <Text style={{ 
                                fontSize: item.highlight ? 16 : 14, 
                                fontWeight: item.highlight ? '900' : '600', 
                                color: item.highlight ? COLORS.primary : (isDarkMode ? COLORS.textLight : COLORS.textDark), 
                                textAlign: 'right', 
                                flex: 1.5 
                            }}>
                                {item.value}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Botões de Ação */}
            <View style={{
                padding: 20,
                paddingBottom: 30,
                backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
                borderTopWidth: 1,
                borderTopColor: isDarkMode ? '#2D2D2D' : 'rgba(0, 0, 0, 0.1)',
                shadowColor: isDarkMode ? COLORS.white : COLORS.dark,
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 8,
            }}>
                {/* Botão de Download PDF */}
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#2196F3',
                        padding: 15,
                        borderRadius: 8,
                        marginBottom: 10,
                    }}
                    onPress={handleDownloadPDF}
                    disabled={isDownloading}
                >
                    {isDownloading ? (
                        <ActivityIndicator color={COLORS.white} style={{ marginRight: 10 }} />
                    ) : (
                        <Ionicons name="download" size={20} color={COLORS.white} style={{ marginRight: 10 }} />
                    )}
                    <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 16 }}>
                        {isDownloading ? 'A gerar PDF...' : 'Baixar PDF'}
                    </Text>
                </TouchableOpacity>

                {/* Botão de Partilhar */}
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.primary,
                        padding: 15,
                        borderRadius: 8,
                        marginBottom: 10,
                    }}
                    onPress={handleShareComprovativo}
                    disabled={isSharing}
                >
                    {isSharing ? (
                        <ActivityIndicator color={COLORS.dark} style={{ marginRight: 10 }} />
                    ) : (
                        <FontAwesome name="share-alt" size={20} color={COLORS.dark} style={{ marginRight: 10 }} />
                    )}
                    <Text style={{ color: COLORS.dark, fontWeight: '700', fontSize: 16 }}>
                        {isSharing ? 'A preparar...' : 'Partilhar Comprovativo'}
                    </Text>
                </TouchableOpacity>
                
                {/* Botão Concluir */}
                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 15,
                        borderRadius: 8,
                        backgroundColor: isDarkMode ? '#282828' : COLORS.dark,
                        borderWidth: 1,
                        borderColor: isDarkMode ? '#282828' : COLORS.dark,
                    }}
                    onPress={handleGoHome}
                >
                    <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 16 }}>
                        Concluir
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
