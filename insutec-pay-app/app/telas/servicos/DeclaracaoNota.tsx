import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

// 💡 CORREÇÃO: Importa estilos de declaração e CORES do ficheiro de estilos específico.
import { declaracaoStyles as styles } from '../../../styles/_DeclaracaoNota.styles.ts';
import { COLORS } from '../../../styles/_ServicoStyles.style.ts'; 

// Contextos
import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';
// Utilitários
import { formatCurrency } from '../../../src/utils/formatters';

const SERVICE_NAME = 'Declaração com Notas';
const BASE_VALUE = 2500; // Valor de exemplo

// =========================================================================
// Componente Mock para Simular o Upload do BI (Movido para dentro ou para um ficheiro partilhado)
// Nota: Os estilos 'uploadButton' e 'uploadButtonText' são importados de _DeclaracaoNota.styles.ts
// =========================================================================
const BIUploadComponent = ({ isDarkMode, onUpload }: { isDarkMode: boolean, onUpload: (success: boolean) => void }) => {
    const [uploaded, setUploaded] = useState(false);
    
    // O estilo uploadButtonSuccess não foi definido anteriormente, aqui fica um mock simples
    const uploadSuccessStyle = {
        backgroundColor: COLORS.success,
        borderColor: COLORS.success,
    };

    return (
        <View style={styles.inputContainer(isDarkMode)}>
            <Text style={styles.label(isDarkMode)}>Documento de Identificação (B.I.)</Text>
            <TouchableOpacity
                // Usando os estilos de upload definidos em _DeclaracaoNota.styles.ts (ou herdados)
                style={[
                    styles.uploadButton(isDarkMode),
                    uploaded ? uploadSuccessStyle : styles.uploadButton(isDarkMode)
                ]}
                onPress={() => {
                    // Simula a seleção e upload bem-sucedido
                    Alert.alert("Anexo Concluído", "O ficheiro do B.I. foi anexado com sucesso para validação.");
                    setUploaded(true);
                    onUpload(true);
                }}
            >
                <FontAwesome name={uploaded ? "check-circle" : "upload"} size={20} color={COLORS.dark} />
                <Text style={styles.uploadButtonText(isDarkMode)}>
                    {uploaded ? "B.I. Anexado (Verificado)" : "Anexar Foto / PDF do B.I."}
                </Text>
            </TouchableOpacity>
        </View>
    );
};
// =========================================================================

export default function DeclaracaoNotaScreen() {
    const { aluno } = useAuth();
    const { isDarkMode } = useTheme();
    
    // Inicializa com o número do estudante logado
    const [numeroEstudante, setNumeroEstudante] = useState(aluno?.nr_estudante || '');
    const [quantity, setQuantity] = useState(1);
    const [biAnexado, setBiAnexado] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const targetStudentId = useMemo(() => numeroEstudante || aluno?.nr_estudante, [numeroEstudante, aluno]);

    const adjustQuantity = (increment: boolean) => {
        setQuantity((prev) => Math.max(1, prev + (increment ? 1 : -1)));
        setError(null);
    };

    const getSubtotal = useMemo(() => BASE_VALUE * quantity, [quantity]);

    const handleAddToDividas = () => {
        if (!targetStudentId) {
            setError('Por favor, insira o número do estudante.');
            return;
        }
        if (quantity < 1) {
            setError('Selecione uma quantidade válida.');
            return;
        }
        if (!biAnexado) {
            setError('É obrigatório anexar o documento de identificação (B.I.).');
            return;
        }

        const declaracaoParaDividas = {
            id: `DECLARACAO_NOTA-${targetStudentId}-${Date.now()}`,
            descricao: `${SERVICE_NAME} (Qtd: ${quantity})`,
            valor_base: BASE_VALUE, // Valor base unitário
            valor_total: getSubtotal, // Valor total (base * quantidade)
            data_vencimento: '2025-12-31', 
        };

        // Redireciona para o ecrã de Dívidas com o novo item a ser adicionado
        router.push({
            pathname: '/telas/dividas/DividasScreen',
            params: {
                servicosAdicionais: JSON.stringify([declaracaoParaDividas]),
                alunoId: targetStudentId,
            },
        });
    };

    return (
        <ScrollView style={styles.safeArea(isDarkMode)} contentContainerStyle={styles.container(isDarkMode)}>
            <Text style={styles.sectionTitle(isDarkMode)}>{SERVICE_NAME}</Text>
            
            {/* Cartão de Preço/Nota */}
            <View style={styles.priceCard(isDarkMode)}>
                <Text style={styles.priceLabel(isDarkMode)}>Custo por Documento</Text>
                <Text style={styles.valueText}>{formatCurrency(BASE_VALUE)}</Text>
                <Text style={styles.noteText(isDarkMode)}>
                    Nota: O documento final será emitido após a confirmação do pagamento.
                </Text>
            </View>

            {/* Input Número do Estudante */}
            <View style={styles.inputContainer(isDarkMode)}>
                <Text style={styles.label(isDarkMode)}>Número do Estudante</Text>
                <TextInput 
                    style={styles.input(isDarkMode)} 
                    value={numeroEstudante} 
                    onChangeText={setNumeroEstudante} 
                    placeholder="Digite o número do estudante" 
                    keyboardType="numeric" 
                    placeholderTextColor={isDarkMode ? COLORS.gray : COLORS.lightGray} 
                />
            </View>
            
            {/* Quantity Selection */}
            <View style={styles.inputContainer(isDarkMode)}>
                <Text style={styles.label(isDarkMode)}>Quantidade de Documentos</Text>
                <View style={styles.quantityContainer(isDarkMode)}>
                    <TouchableOpacity 
                        style={styles.quantityButton(isDarkMode)} 
                        onPress={() => adjustQuantity(false)} 
                        disabled={quantity <= 1}
                    >
                        <Text style={styles.quantityButtonText(isDarkMode)}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText(isDarkMode)}>{quantity}</Text>
                    <TouchableOpacity 
                        style={styles.quantityButton(isDarkMode)} 
                        onPress={() => adjustQuantity(true)}
                    >
                        <Text style={styles.quantityButtonText(isDarkMode)}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Componente de Upload do BI */}
            <BIUploadComponent 
                isDarkMode={isDarkMode} 
                onUpload={setBiAnexado} 
            />

            {/* Total e Botão */}
            <View style={styles.summaryContainer(isDarkMode)}>
                <Text style={styles.totalText(isDarkMode)}>Total a Pagar:</Text>
                <Text style={styles.totalValue(isDarkMode)}>{formatCurrency(getSubtotal)}</Text>
            </View>
            
            {error && (<Text style={styles.error(isDarkMode)}>{error}</Text>)}

            <TouchableOpacity
                style={[styles.payButton, (getSubtotal === 0 || !biAnexado) && styles.payButtonDisabled]}
                onPress={handleAddToDividas}
                disabled={getSubtotal === 0 || !biAnexado} // Desabilitado se BI não estiver anexado
            >
                <Text style={styles.payButtonText}>
                    ADICIONAR AO CARRINHO ({formatCurrency(getSubtotal)}) <FontAwesome name="arrow-right" size={16} color={COLORS.dark} />
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
