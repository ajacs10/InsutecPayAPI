// app/telas/comprovativo/ComprovativoScreen.tsx
import React, { useCallback, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext/ThemeContext';
import { formatCurrency, formatDate } from '../../../src/utils/formatters';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

// CORES FIXAS para evitar qualquer problema de tema temporariamente
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

interface ComprovativoParams {
    id: string;
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
    status: 'SUCESSO',
    data: new Date().toISOString(),
    saldo_anterior: '0.00',
    saldo_atual: '0.00',
};

// ESTILOS INLINE - Sem arquivo de estilos externo
const getStyles = (isDarkMode: boolean) => ({
    fullContainer: {
        flex: 1,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    },
    scrollContentContainer: {
        padding: 20,
        alignItems: 'center' as const,
        paddingBottom: 120,
    },
    headerCard: {
        width: '100%',
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        borderRadius: 15,
        padding: 30,
        alignItems: 'center' as const,
        marginBottom: 20,
        borderBottomWidth: 5,
        borderBottomColor: COLORS.success,
        ...Platform.select({ 
            ios: { 
                shadowOpacity: 0.1, 
                shadowRadius: 5, 
                shadowColor: isDarkMode ? COLORS.white : COLORS.dark,
                shadowOffset: { width: 0, height: 2 }
            }, 
            android: { elevation: 4 } 
        }),
    },
    valueText: {
        fontSize: 32,
        fontWeight: '900',
        marginTop: 10,
        color: COLORS.primary,
    },
    statusText: { 
        fontSize: 18,
        fontWeight: '700',
        marginTop: 15,
        color: COLORS.success,
    },
    detailSection: {
        width: '100%',
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        ...Platform.select({
            ios: {
                shadowOpacity: 0.05,
                shadowRadius: 3,
                shadowColor: isDarkMode ? COLORS.white : COLORS.dark,
                shadowOffset: { width: 0, height: 1 }
            },
            android: {
                elevation: 2
            }
        }),
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 15,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    },
    detailRow: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(136, 136, 136, 0.1)', 
    },
    detailLabel: {
        fontSize: 14,
        color: isDarkMode ? COLORS.subText : COLORS.textDark,
        flex: 1,
    },
    detailValue: (isHighlight: boolean = false) => ({
        fontSize: isHighlight ? 16 : 14,
        fontWeight: isHighlight ? '900' : '600',
        color: isHighlight ? COLORS.primary : (isDarkMode ? COLORS.textLight : COLORS.textDark),
        textAlign: 'right' as const,
        flex: 1.5,
    }),
    actionContainer: {
        position: 'absolute' as const,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
        borderTopWidth: 1,
        borderTopColor: isDarkMode ? '#2D2D2D' : 'rgba(0, 0, 0, 0.1)',
        flexDirection: 'column' as const,
        ...Platform.select({
            ios: {
                shadowOpacity: 0.1,
                shadowRadius: 3,
                shadowColor: isDarkMode ? COLORS.white : COLORS.dark,
                shadowOffset: { width: 0, height: -2 }
            },
            android: {
                elevation: 8
            }
        }),
    },
    shareButton: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    homeButton: {
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        backgroundColor: isDarkMode ? '#282828' : COLORS.dark,
        borderColor: isDarkMode ? '#282828' : COLORS.dark,
    },
    buttonText: {
        color: COLORS.dark,
        fontWeight: '700',
        fontSize: 16,
    },
    homeButtonText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 16,
    }
});

export default function ComprovativoScreen() {
    // CORREÇÃO: useTheme com verificação de erro
    let isDarkMode = false;
    try {
        const theme = useTheme();
        isDarkMode = theme.isDarkMode;
    } catch (error) {
        console.warn('[ComprovativoScreen] Erro ao usar useTheme, usando light mode como fallback');
        isDarkMode = false;
    }

    const params = useLocalSearchParams();
    
    // CORREÇÃO: Criação direta sem hooks complexos
    const comprovativo: ComprovativoParams = {
        ...DEFAULT_PARAMS,
        id: String(params.id || DEFAULT_PARAMS.id),
        id_transacao_unica: String(params.id_transacao_unica || DEFAULT_PARAMS.id_transacao_unica),
        valor_total: String(params.valor_total || DEFAULT_PARAMS.valor_total),
        metodo_pagamento: String(params.metodo_pagamento || DEFAULT_PARAMS.metodo_pagamento),
        descricao: String(params.descricao || DEFAULT_PARAMS.descricao),
        status: (params.status as 'SUCESSO') || DEFAULT_PARAMS.status,
        data: String(params.data || DEFAULT_PARAMS.data),
        saldo_anterior: String(params.saldo_anterior || DEFAULT_PARAMS.saldo_anterior),
        saldo_atual: String(params.saldo_atual || DEFAULT_PARAMS.saldo_atual),
    };

    // Parse dos valores numéricos
    const valorTotal = parseFloat(comprovativo.valor_total);
    const saldoAtual = parseFloat(comprovativo.saldo_atual);
    const saldoAnterior = parseFloat(comprovativo.saldo_anterior);
    const formattedDate = formatDate(comprovativo.data);

    const viewShotRef = useRef<ViewShot>(null);
    const [isSharing, setIsSharing] = useState(false);

    // CORREÇÃO: Função simples sem dependências complexas
    const handleShareComprovativo = async () => {
        if (!viewShotRef.current || isSharing) return;
        
        setIsSharing(true);
        try {
            const uri = await viewShotRef.current.capture();
            const fileName = `Comprovativo_InsutecPay_${comprovativo.id_transacao_unica}.jpg`;
            const tempFilePath = `${FileSystem.cacheDirectory}${fileName}`;

            if (Platform.OS !== 'web') {
                await FileSystem.moveAsync({ from: uri, to: tempFilePath });
            }

            if (!(await Sharing.isAvailableAsync())) {
                Alert.alert('Erro', 'O compartilhamento de ficheiros não é suportado neste dispositivo.');
                return;
            }

            await Sharing.shareAsync(Platform.OS === 'web' ? uri : tempFilePath, {
                mimeType: 'image/jpeg',
                UTI: 'public.jpeg',
            });
        } catch (error) {
            console.error('[ComprovativoScreen] Erro ao compartilhar:', error);
            Alert.alert('Erro', 'Não foi possível gerar ou partilhar o comprovativo.');
        } finally {
            setIsSharing(false);
        }
    };

    const handleGoHome = () => {
        router.replace('/telas/home/HomeScreen');
    };

    // CORREÇÃO: Estilos calculados uma vez por render
    const styles = getStyles(isDarkMode);

    return (
        <View style={styles.fullContainer}>
            <Stack.Screen
                options={{
                    title: 'Comprovativo',
                    headerShown: false,
                    presentation: 'modal',
                }}
            />
            
            <ScrollView 
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
            >
                <ViewShot 
                    ref={viewShotRef} 
                    options={{ format: 'jpg', quality: 0.9 }} 
                    style={{ 
                        flex: 1, 
                        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground 
                    }}
                >
                    {/* Cartão do cabeçalho com status */}
                    <View style={styles.headerCard}> 
                        <MaterialCommunityIcons name="check-circle" size={48} color={COLORS.success} />
                        <Text style={styles.statusText}>Pagamento Concluído</Text> 
                        <Text style={styles.valueText}>{formatCurrency(valorTotal)}</Text>
                    </View>

                    {/* Detalhes da Transação */}
                    <View style={styles.detailSection}>
                        <Text style={styles.sectionTitle}>Detalhes da Transação</Text>
                        
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>ID Transação:</Text>
                            <Text style={styles.detailValue(false)}>
                                {comprovativo.id_transacao_unica}
                            </Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Data e Hora:</Text>
                            <Text style={styles.detailValue(false)}>
                                {formattedDate}
                            </Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Descrição:</Text>
                            <Text style={styles.detailValue(false)}>
                                {comprovativo.descricao}
                            </Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Método de Pagamento:</Text>
                            <Text style={styles.detailValue(false)}>
                                {comprovativo.metodo_pagamento}
                            </Text>
                        </View>
                    </View>

                    {/* Resumo Financeiro */}
                    <View style={styles.detailSection}>
                        <Text style={styles.sectionTitle}>Resumo Financeiro</Text>
                        
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>VALOR PAGO</Text>
                            <Text style={styles.detailValue(true)}>
                                {formatCurrency(valorTotal)}
                            </Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Saldo Anterior</Text>
                            <Text style={styles.detailValue(false)}>
                                {formatCurrency(saldoAnterior)}
                            </Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Saldo Atual</Text>
                            <Text style={styles.detailValue(false)}>
                                {formatCurrency(saldoAtual)}
                            </Text>
                        </View>
                    </View>
                </ViewShot>
            </ScrollView>

            {/* Botões de Ação */}
            <View style={styles.actionContainer}>
                <TouchableOpacity
                    style={styles.shareButton}
                    onPress={handleShareComprovativo}
                    disabled={isSharing}
                >
                    {isSharing ? (
                        <ActivityIndicator color={COLORS.dark} style={{ marginRight: 10 }} />
                    ) : (
                        <FontAwesome name="share-alt" size={20} color={COLORS.dark} style={{ marginRight: 10 }} />
                    )}
                    <Text style={styles.buttonText}>
                        {isSharing ? 'A preparar...' : 'Partilhar Comprovativo'}
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={styles.homeButton} 
                    onPress={handleGoHome}
                >
                    <Text style={styles.homeButtonText}>Concluir</Text> 
                </TouchableOpacity>
            </View>
        </View>
    );
}
