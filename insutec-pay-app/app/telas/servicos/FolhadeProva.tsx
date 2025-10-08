import React, { useState, useMemo } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons'; 
import { router } from 'expo-router';
import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';

// CORRIGIDO: O caminho de importação para a pasta 'styles' (três níveis acima)
import { COLORS } from '../../../styles/_ServicoStyles.style.ts';
// CORREÇÃO: Utilizando o nome de arquivo de estilos que existe em seu disco
import { paymentStyles } from '../../../styles/_FolhadeProva.styles.ts'; 

// Constantes
const SERVICE_TITLE = 'PAGAMENTO DE FOLHA DE PROVA';
const UNIT_PRICE = 200.00; 

// Função de formatação de moeda (adaptada)
const formatCurrencyBR = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

// ----------------------------------------------------
// Componente: Tela de Pagamento
// ----------------------------------------------------
export default function FolhaDeProvaScreen() {
    const { aluno } = useAuth();
    const { isDarkMode } = useTheme();

    // Estados
    const [quantidade, setQuantidade] = useState(2); 
    const [isLoading, setIsLoading] = useState(false);
    
    // Memoização
    const subtotal = useMemo(() => UNIT_PRICE * quantidade, [quantidade]);
    const targetStudentId = aluno?.nr_estudante || 'UNKNOWN';
    
    // Carrega os estilos dinamicamente
    // ATENÇÃO: Se o seu arquivo de estilos exportar um nome diferente de 'paymentStyles', ajuste aqui.
    const styles = paymentStyles(isDarkMode); 

    // Ir para pagamento (Função simplificada)
    const handleFinalizarPagamento = () => {
        setIsLoading(true);
        
        const pedidoItem = {
            id: `FOLHA-${Date.now()}`,
            descricao: `Folha de Prova (${quantidade} unidade${quantidade > 1 ? 's' : ''})`,
            valor: subtotal,
            data_vencimento: '2025-12-31',
            quantidade: quantidade
        };

        setTimeout(() => {
            setIsLoading(false);
            
            // CORREÇÃO ESSENCIAL: Uso do caminho completo do arquivo no Expo Router.
            // A rota deve ser '/app/telas/Success/SuccessScreen.tsx' (sem o 'app' e a extensão)
            router.push('/telas/Success/SuccessScreen'); 
        }, 1500);
    };

    // Aumentar quantidade
    const increaseQuantity = () => {
        setQuantidade(prev => prev + 1);
    };

    // Diminuir quantidade
    const decreaseQuantity = () => {
        if (quantidade > 1) {
            setQuantidade(prev => prev - 1);
        }
    };

    // ----------------------------------------------------
    // RENDERIZAÇÃO
    // ----------------------------------------------------
    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {/* Título Principal */}
                <Text style={styles.headerText}>{SERVICE_TITLE}</Text>
                <Text style={styles.subHeaderText}>
                    Selecione a quantidade e finalize o pagamento.
                </Text>

                {/* Card do Item de Pagamento (Folha de Prova) */}
                <View style={styles.itemCard}>
                    <View style={styles.itemRow}>
                        
                        {/* Detalhes do Item (Esquerda) */}
                        <View style={styles.itemDetails}>
                            <View style={styles.itemIconContainer}>
                                <MaterialIcons name="school" size={24} color={COLORS.primary} />
                            </View>
                            <View>
                                <Text style={styles.itemName}>Folha de Prova (Unidade)</Text>
                                <Text style={styles.itemPrice}>{formatCurrencyBR(UNIT_PRICE)}</Text>
                            </View>
                        </View>

                        {/* Seletor de Quantidade (Direita) */}
                        <View style={styles.quantitySelector}>
                            <TouchableOpacity 
                                style={styles.quantityButton}
                                onPress={decreaseQuantity}
                                disabled={quantidade <= 1 || isLoading}
                            >
                                <AntDesign name="minus" size={16} color={quantidade <= 1 ? COLORS.gray : COLORS.textDark} />
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
                    
                    {/* Linha do Subtotal dentro do Card (Conforme a Imagem) */}
                    <View style={{ marginTop: 5 }}>
                        <Text style={{ fontSize: 14, color: COLORS.subText }}>
                            Subtotal: {formatCurrencyBR(subtotal)}
                        </Text>
                    </View>
                </View>

                {/* Área vazia para preenchimento */}
                <View style={{ flex: 1 }} />

            </ScrollView>

            {/* Rodapé Fixo (Botão e Ícones de Pagamento) */}
            <View style={styles.fixedFooter}>
                <TouchableOpacity
                    style={styles.finalizarButton}
                    onPress={handleFinalizarPagamento}
                    disabled={isLoading}
                    activeOpacity={0.8}
                >
                    {isLoading ? (
                        <ActivityIndicator color={COLORS.white} size="small" />
                    ) : (
                        <Text style={styles.finalizarButtonText}>
                            FINALIZAR PAGAMENTO
                        </Text>
                    )}
                </TouchableOpacity>
                
                {/* Ícones de Pagamento (Simulação da Imagem) */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                    <Text style={{ fontSize: 20, color: COLORS.gray, marginHorizontal: 5 }}>P</Text>
                    <Text style={{ fontSize: 20, color: COLORS.gray, marginHorizontal: 5 }}>+</Text>
                    <Text style={{ fontSize: 20, color: COLORS.gray, marginHorizontal: 5 }}>M</Text>
                    <Text style={{ fontSize: 20, color: COLORS.gray, marginHorizontal: 5 }}>i</Text>
                </View>
            </View>
        </View>
    );
}
