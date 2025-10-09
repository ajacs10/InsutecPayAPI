// /insutec-pay-app/components/FolhaDeProvaScreen.tsx
import React, { useState, useMemo } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    ActivityIndicator,
    Alert,
} from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons'; 
import { router } from 'expo-router';
import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';
import { paymentStyles } from '../../../styles/_FolhaDeProvaScreen.styles.ts';

// Constantes
const SERVICE_TITLE = 'PAGAMENTO DE FOLHA DE PROVA';
const UNIT_PRICE = 200.00;

// Função de formatação de moeda
const formatCurrencyBR = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

// Componente Principal
export default function FolhaDeProvaScreen() {
    const { aluno } = useAuth();
    const { isDarkMode } = useTheme();

    // Estados
    const [quantidade, setQuantidade] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    
    // Memoização
    const subtotal = useMemo(() => UNIT_PRICE * quantidade, [quantidade]);
    const targetStudentId = aluno?.nr_estudante || 'UNKNOWN';
    const isButtonDisabled = quantidade === 0 || isLoading;
    
    // Estilos
    const styles = paymentStyles(isDarkMode);

    // Handlers
    const handleFinalizarPagamento = () => {
        if (quantidade === 0) {
            Alert.alert(
                'Quantidade Inválida',
                'Selecione pelo menos 1 folha de prova para continuar.',
                [{ text: 'OK' }]
            );
            return;
        }

        setIsLoading(true);
        
        const pedidoItem = {
            id: `FOLHA-${Date.now()}`,
            descricao: `Folha de Prova (${quantidade} unidade${quantidade > 1 ? 's' : ''})`,
            valor: subtotal,
            data_vencimento: '2025-12-31',
            quantidade: quantidade
        };

        console.log('Processando pagamento:', pedidoItem);

        // Simulação de processamento
        setTimeout(() => {
            setIsLoading(false);
            router.push({
                pathname: '/telas/Success/SuccessScreen',
                params: {
                    service: 'Folha de Prova',
                    amount: subtotal.toString(),
                    quantity: quantidade.toString()
                }
            });
        }, 1500);
    };

    const increaseQuantity = () => {
        setQuantidade(prev => prev + 1);
    };

    const decreaseQuantity = () => {
        if (quantidade > 0) {
            setQuantidade(prev => prev - 1);
        }
    };

    // Render
    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            >
                {/* Cabeçalho */}
                <Text style={styles.headerText}>{SERVICE_TITLE}</Text>
                <Text style={styles.subHeaderText}>
                    Selecione a quantidade desejada de folhas de prova e finalize o pagamento de forma segura.
                </Text>

                {/* Card do Item */}
                <View style={styles.itemCard}>
                    <View style={styles.itemRow}>
                        <View style={styles.itemDetails}>
                            <View style={styles.itemIconContainer}>
                                <MaterialIcons 
                                    name="description" 
                                    size={24} 
                                    color={COLORS.primary} 
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.itemName}>Folha de Prova (Unidade)</Text>
                                <Text style={styles.itemPrice}>{formatCurrencyBR(UNIT_PRICE)} cada</Text>
                            </View>
                        </View>

                        {/* Seletor de Quantidade */}
                        <View style={styles.quantitySelector}>
                            <TouchableOpacity 
                                style={[
                                    styles.quantityButton,
                                    quantidade === 0 && styles.quantityButtonDisabled
                                ]}
                                onPress={decreaseQuantity}
                                disabled={quantidade === 0 || isLoading}
                            >
                                <AntDesign 
                                    name="minus" 
                                    size={16} 
                                    color={quantidade === 0 ? COLORS.gray : COLORS.textDark} 
                                />
                            </TouchableOpacity>
                            
                            <View style={styles.quantityDisplay}>
                                <Text style={styles.quantityText}>{quantidade}</Text>
                            </View>
                            
                            <TouchableOpacity 
                                style={styles.quantityButton}
                                onPress={increaseQuantity}
                                disabled={isLoading}
                            >
                                <AntDesign name="plus" size={16} color={COLORS.textDark} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    {/* Subtotal */}
                    <View style={styles.subtotalContainer}>
                        <Text style={styles.subtotalText}>Subtotal:</Text>
                        <Text style={styles.subtotalValue}>{formatCurrencyBR(subtotal)}</Text>
                    </View>

                    {/* Aviso quando quantidade for 0 */}
                    {quantidade === 0 && (
                        <Text style={styles.warningText}>
                            Selecione pelo menos 1 folha para continuar
                        </Text>
                    )}
                </View>

                {/* Informações Adicionais */}
                <View style={styles.infoCard}>
                    <Text style={[styles.itemName, { marginBottom: 10 }]}>
                        Informações do Pedido
                    </Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.subtotalText}>Nº de Estudante:</Text>
                        <Text style={styles.subtotalValue}>{targetStudentId}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.subtotalText}>Tipo de Serviço:</Text>
                        <Text style={styles.subtotalValue}>Folha de Prova</Text>
                    </View>
                </View>

                {/* Espaço flexível */}
                <View style={{ flex: 1 }} />
            </ScrollView>

            {/* Rodapé Fixo */}
            <View style={styles.fixedFooter}>
                <TouchableOpacity
                    style={[
                        styles.finalizarButton,
                        isButtonDisabled && styles.finalizarButtonDisabled
                    ]}
                    onPress={handleFinalizarPagamento}
                    disabled={isButtonDisabled}
                    activeOpacity={0.8}
                >
                    {isLoading ? (
                        <ActivityIndicator color={COLORS.white} size="small" />
                    ) : (
                        <Text style={[
                            styles.finalizarButtonText,
                            isButtonDisabled && styles.finalizarButtonTextDisabled
                        ]}>
                            {quantidade === 0 ? 'SELECIONE A QUANTIDADE' : `PAGAR ${formatCurrencyBR(subtotal)}`}
                        </Text>
                    )}
                </TouchableOpacity>
                
                {/* Ícones de Métodos de Pagamento */}
                <View style={styles.paymentIconsContainer}>
                    <Text style={styles.paymentIcon}>💳</Text>
                    <Text style={styles.paymentIcon}>📱</Text>
                    <Text style={styles.paymentIcon}>🏦</Text>
                    <Text style={styles.paymentIcon}>🔒</Text>
                </View>
            </View>
        </View>
    );
}
