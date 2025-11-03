// app/telas/servicos/DeclaracaoNota.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';
import {
  createDeclaracaoNotaStyles,
  sharedFinanceStyles,
  COLORS,
  GRADIENT,
} from '../../../styles/_DeclaracaoNota.styles';
import { formatCurrency } from '../../../src/utils/formatters';

const SERVICE_NAME = 'Declaração com Notas';
const BASE_VALUE = 15000;

const BIUploadComponent = ({
  isDarkMode,
  onUpload,
}: {
  isDarkMode: boolean;
  onUpload: (success: boolean) => void;
}) => {
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const styles = useMemo(() => createDeclaracaoNotaStyles(isDarkMode), [isDarkMode]);

  const handleUpload = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUploaded(true);
      onUpload(true);
      Alert.alert('Sucesso', 'B.I. anexado com sucesso!');
    }, 1000);
  };

  return (
    <View style={styles.uploadSection}>
      <Text style={styles.sectionTitle(isDarkMode)}>
        Documento de Identificação (B.I.) *
      </Text>
      <TouchableOpacity
        style={[
          styles.uploadButton,
          uploaded ? styles.uploadButtonSuccess : styles.uploadButtonDefault,
        ]}
        onPress={handleUpload}
        disabled={uploaded || loading}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={
            uploaded
              ? GRADIENT.success(isDarkMode)
              : loading
              ? GRADIENT.disabled
              : GRADIENT.primary(isDarkMode)
          }
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        />
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <FontAwesome
              name={uploaded ? 'check-circle' : 'upload'}
              size={22}
              color="#fff"
            />
            <Text style={styles.uploadButtonText}>
              {uploaded
                ? 'B.I. Anexado (Verificado)'
                : 'Anexar Foto ou PDF do B.I.'}
            </Text>
          </>
        )}
      </TouchableOpacity>
      {uploaded && (
        <Text style={styles.uploadSuccessText(isDarkMode)}>
          Documento validado com sucesso
        </Text>
      )}
    </View>
  );
};

export default function DeclaracaoNotaScreen() {
  const router = useRouter();
  const { aluno } = useAuth();
  const { isDarkMode } = useTheme();

  const [numeroEstudante, setNumeroEstudante] = useState(aluno?.nr_estudante || '');
  const [quantity, setQuantity] = useState(1);
  const [biAnexado, setBiAnexado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const styles = useMemo(() => createDeclaracaoNotaStyles(isDarkMode), [isDarkMode]);
  const sharedStyles = useMemo(() => sharedFinanceStyles(isDarkMode), [isDarkMode]);

  const targetStudentId = useMemo(
    () => numeroEstudante || aluno?.nr_estudante || '',
    [numeroEstudante, aluno]
  );

  const adjustQuantity = (increment: boolean) => {
    setQuantity((prev) => Math.max(1, prev + (increment ? 1 : -1)));
    setError(null);
  };

  const subtotal = useMemo(() => BASE_VALUE * quantity, [quantity]);

  const handleAddToDividas = () => {
    if (!targetStudentId) {
      setError('Por favor, insira o número do estudante.');
      return;
    }
    if (!biAnexado) {
      setError('É obrigatório anexar o documento de identificação (B.I.).');
      return;
    }

    const item = {
      id: `DECLARACAO_NOTA-${targetStudentId}-${Date.now()}`,
      descricao: `${SERVICE_NAME} (Qtd: ${quantity})`,
      valor_base: BASE_VALUE,
      valor_total: subtotal,
      data_vencimento: '2025-12-31',
    };

    router.push({
      pathname: '/telas/dividas/DividasScreen',
      params: {
        servicosAdicionais: JSON.stringify([item]),
        alunoId: targetStudentId,
      },
    });
  };

  return (
    <SafeAreaView style={sharedStyles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header com gradiente */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={GRADIENT.header(isDarkMode)}
            style={styles.headerGradient}
          />
          <Text style={styles.header}> {SERVICE_NAME}</Text>
        </View>

        {/* Aluno */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle(isDarkMode)}>Aluno</Text>
          <Text style={styles.normalText}>ID: {targetStudentId || '—'}</Text>
          <Text style={styles.normalText}>Nome: {aluno?.nome || 'Você'}</Text>
        </View>

        {/* Número do Estudante */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle(isDarkMode)}>Número do Estudante</Text>
          <TextInput
            style={styles.input}
            value={numeroEstudante}
            onChangeText={setNumeroEstudante}
            placeholder="Ex: A-12345"
            placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
            keyboardType="default"
          />
        </View>

        {/* Quantidade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle(isDarkMode)}>Quantidade de Documentos</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => adjustQuantity(false)}
              disabled={quantity <= 1}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => adjustQuantity(true)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upload B.I. */}
        <BIUploadComponent isDarkMode={isDarkMode} onUpload={setBiAnexado} />

        {/* Erro */}
        {error && <Text style={styles.error(isDarkMode)}>{error}</Text>}

        {/* Resumo */}
        {biAnexado && (
          <LinearGradient
            colors={GRADIENT.summaryCard(isDarkMode)}
            style={[styles.section, styles.summaryCard]}
          >
            <Text style={styles.sectionTitle(isDarkMode)}>Resumo</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>
                {SERVICE_NAME} ({quantity} {quantity === 1 ? 'unid.' : 'unids.'})
              </Text>
              <Text style={styles.summaryText}>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>TOTAL:</Text>
              <Text style={styles.totalAmount}>{formatCurrency(subtotal)}</Text>
            </View>
          </LinearGradient>
        )}

        {/* Botão */}
        <LinearGradient
          colors={
            !biAnexado || !targetStudentId
              ? GRADIENT.payButtonDisabled
              : GRADIENT.payButton(isDarkMode)
          }
          style={[
            styles.payButton,
            (!biAnexado || !targetStudentId) && styles.payButtonDisabled,
          ]}
        >
          <TouchableOpacity
            onPress={handleAddToDividas}
            disabled={!biAnexado || !targetStudentId}
            style={styles.payButtonInner}
            activeOpacity={0.9}
          >
            <FontAwesome name="shopping-cart" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.payButtonText}>
             pagar ({formatCurrency(subtotal)})
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.infoText}>
          * O documento será validado pela secretaria antes da emissão.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
