// /telas/servicos/DeclaracaoSemNota.tsx (Atualizado com BI)

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';
import { styles, COLORS } from '../../../styles/_ServicoStyles.style.ts';
import { formatCurrency } from '../../../src/utils/formatters';

const SERVICE_NAME = 'Declaração sem Notas';
const BASE_VALUE = 2000; // Valor ligeiramente menor, como exemplo

// O BIUploadComponent deve ser definido ou importado em ambos os ficheiros.
// Para este exemplo, vou colocá-lo aqui novamente para ser autocontido.
const BIUploadComponent = ({ isDarkMode, onUpload }: { isDarkMode: boolean, onUpload: (success: boolean) => void }) => {
    const [uploaded, setUploaded] = useState(false);
    return (
        <View style={styles.inputContainer(isDarkMode)}>
            <Text style={styles.label(isDarkMode)}>Documento de Identificação (B.I.)</Text>
            <TouchableOpacity
                style={[
                    styles.uploadButton,
                    uploaded ? styles.uploadButtonSuccess : styles.uploadButton
                ]}
                onPress={() => {
                    Alert.alert("Anexo Concluído", "O ficheiro do B.I. foi anexado com sucesso para validação.");
                    setUploaded(true);
                    onUpload(true);
                }}
            >
                <FontAwesome name={uploaded ? "check-circle" : "upload"} size={20} color={COLORS.white} />
                <Text style={styles.uploadButtonText}>
                    {uploaded ? "B.I. Anexado (Verificado)" : "Anexar Foto / PDF do B.I."}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default function DeclaracaoSemNotaScreen() {
    const { aluno } = useAuth();
    const { isDarkMode } = useTheme();
    
    const [numeroEstudante, setNumeroEstudante] = useState(aluno?.nr_estudante || '');
    const [quantity, setQuantity] = useState(1);
    const [biAnexado, setBiAnexado] = useState(false); // Novo estado
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
        // NOVA VALIDAÇÃO
        if (!biAnexado) {
            setError('É obrigatório anexar o documento de identificação (B.I.).');
            return;
        }

        const declaracaoParaDividas = {
            id: `DECLARACAO_SEM_NOTA-${targetStudentId}-${Date.now()}`,
            descricao: `${SERVICE_NAME} (Qtd: ${quantity})`,
            valor_base: getSubtotal,
            valor_total: getSubtotal,
            data_vencimento: '2025-12-31', 
        };

        router.push({
            pathname: '/telas/dividas/DividasScreen',
            params: {
                servicosAdicionais: JSON.stringify([declaracaoParaDividas]),
                alunoId: targetStudentId,
            },
        });
    };

    return (
        <ScrollView style={styles.container(isDarkMode)}>
            <Text style={styles.sectionTitle(isDarkMode)}>{SERVICE_NAME}</Text>
            <Text style={styles.priceText(isDarkMode)}>Valor por unidade: {formatCurrency(BASE_VALUE)}</Text>

            {/* Input Número do Estudante */}
            <View style={styles.inputContainer(isDarkMode)}>
                <Text style={styles.label(isDarkMode)}>Número do Estudante</Text>
                <TextInput style={styles.input(isDarkMode)} value={numeroEstudante} onChangeText={setNumeroEstudante} placeholder="Digite o número do estudante" keyboardType="numeric" placeholderTextColor={isDarkMode ? COLORS.gray : COLORS.lightGray} />
            </View>
            
            {/* Quantity Selection */}
            <View style={styles.inputContainer(isDarkMode)}>
                <Text style={styles.label(isDarkMode)}>Quantidade de Documentos</Text>
                <View style={styles.quantityContainer(isDarkMode)}>
                    <TouchableOpacity style={styles.quantityButton(isDarkMode)} onPress={() => adjustQuantity(false)} disabled={quantity <= 1}>
                        <Text style={styles.quantityButtonText(isDarkMode)}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText(isDarkMode)}>{quantity}</Text>
                    <TouchableOpacity style={styles.quantityButton(isDarkMode)} onPress={() => adjustQuantity(true)}>
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
            <Text style={styles.totalText(isDarkMode)}>Total: {formatCurrency(getSubtotal)}</Text>
            {error && (<Text style={styles.error(isDarkMode)}>{error}</Text>)}

            <TouchableOpacity
                style={[styles.payButton, (getSubtotal === 0 || !biAnexado) && styles.payButtonDisabled]}
                onPress={handleAddToDividas}
                disabled={getSubtotal === 0 || !biAnexado}
            >
                <Text style={styles.payButtonText}>Adicionar ao Carrinho ({formatCurrency(getSubtotal)}) <FontAwesome name="arrow-right" size={16} color={COLORS.white} /></Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
