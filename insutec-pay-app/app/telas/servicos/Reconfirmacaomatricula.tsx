
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';

// Contexto de tema
import { useTheme } from '../ThemeContext/ThemeContext';
import { styles, COLORS } from '../../../styles/_Reconfirmacao.styles';

// Interfaces
interface Servico {
  id: string;
  nome: string;
  icon: string;
}

interface PaymentDetails {
  propinasMensal: number;
  taxaReconfirmacao: number;
  total: number;
}

// Constantes
const TAXA_RECONFIRMACAO = 15000; // 15.000 Kz
const PROPINAS_MENSAL = 30000; // 30.000 Kz (deve ser obtido via API no futuro)

// Componente de cartão de upload
const UploadCard: React.FC<{
  file: DocumentPicker.DocumentAsset | null;
  onPickDocument: () => Promise<void>;
  isDarkMode: boolean;
  isLoading: boolean;
}> = ({ file, onPickDocument, isDarkMode, isLoading }) => {
  const fileName = file ? file.name : 'Nenhum ficheiro selecionado';
  return (
    <View style={styles.card(isDarkMode)}>
      <Text style={styles.cardTitle(isDarkMode)}>1. Bilhete de Identidade</Text>
      <View style={styles.fileDisplay}>
        <MaterialIcons
          name={file ? 'insert-drive-file' : 'attach-file'}
          size={20}
          color={file ? COLORS.success : COLORS.subText}
        />
        <Text style={styles.fileStatus(isDarkMode, !!file)}>
          {fileName.length > 40 ? `${fileName.substring(0, 40)}...` : fileName}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.uploadButton(isDarkMode)}
        onPress={onPickDocument}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <MaterialIcons
          name={file ? 'check-circle' : 'cloud-upload'}
          size={20}
          color={COLORS.white}
          style={{ marginRight: 10 }}
        />
        <Text style={styles.uploadButtonText}>{file ? 'Ficheiro Pronto' : 'Carregar Arquivo'}</Text>
      </TouchableOpacity>
      <Text style={styles.smallText(isDarkMode)}>Formatos aceites: PDF ou Imagem</Text>
    </View>
  );
};

// Componente de detalhes de pagamento
const PaymentDetailsCard: React.FC<{
  details: PaymentDetails;
  isDarkMode: boolean;
}> = ({ details, isDarkMode }) => (
  <View style={styles.card(isDarkMode)}>
    <Text style={styles.cardTitle(isDarkMode)}>2. Detalhes de Pagamento</Text>
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel(isDarkMode)}>Propina Mensal (Ref.):</Text>
      <Text style={styles.detailValue(isDarkMode)}>{details.propinasMensal.toLocaleString('pt-AO')} Kz</Text>
    </View>
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel(isDarkMode), { fontWeight: '700' }]}>Taxa de Reconfirmação:</Text>
      <Text style={[styles.detailValue(isDarkMode), { color: COLORS.danger, fontWeight: '700' }]}>
        {details.taxaReconfirmacao.toLocaleString('pt-AO')} Kz
      </Text>
    </View>
    <View style={styles.divider(isDarkMode)} />
    <View style={styles.detailRow}>
      <Text style={styles.totalLabel(isDarkMode)}>Total a Pagar:</Text>
      <Text style={styles.totalValue}>{details.total.toLocaleString('pt-AO')} Kz</Text>
    </View>
  </View>
);

/**
 * Componente principal para reconfirmação de matrícula
 */
export default function Reconfirmacaomatricula() {
  const { isDarkMode } = useTheme();
  const params = useLocalSearchParams();
  const [biFile, setBiFile] = useState<DocumentPicker.DocumentAsset | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Dados de pagamento
  const paymentDetails: PaymentDetails = {
    propinasMensal: PROPINAS_MENSAL,
    taxaReconfirmacao: TAXA_RECONFIRMACAO,
    total: PROPINAS_MENSAL + TAXA_RECONFIRMACAO,
  };

  // Parse do parâmetro de serviço
  const serviceName = React.useMemo(() => {
    try {
      if (params.servico && typeof params.servico === 'string') {
        const parsed = JSON.parse(params.servico) as Servico;
        console.log('[Reconfirmacaomatricula] Nome do serviço:', parsed.nome);
        return parsed.nome || 'Reconfirmação de Matrícula';
      }
    } catch (error) {
      console.error('[Reconfirmacaomatricula] Erro ao parsear params.servico:', error);
    }
    return 'Reconfirmação de Matrícula';
  }, [params.servico]);

  /**
   * Seleciona o ficheiro de BI (PDF ou Imagem)
   */
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log('[Reconfirmacaomatricula] Seleção de arquivo cancelada');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        setBiFile(result.assets[0]);
        console.log('[Reconfirmacaomatricula] Arquivo selecionado:', result.assets[0].name);
      }
    } catch (error) {
      console.error('[Reconfirmacaomatricula] Erro ao selecionar documento:', error);
      Alert.alert('Erro', 'Não foi possível selecionar o ficheiro. Tente novamente.');
    }
  };

  /**
   * Processa a reconfirmação e redireciona para pagamento
   */
  const handleConfirmarMatricula = () => {
    if (!biFile) {
      Alert.alert('Ficheiro em Falta', 'Por favor, carregue a cópia do BI (PDF ou Imagem) antes de continuar.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Submissão Concluída',
        `Documento de BI enviado. O pagamento de ${paymentDetails.total.toLocaleString('pt-AO')} Kz será processado.`,
        [
          {
            text: 'Ir para Pagamento',
            onPress: () => {
              console.log('[Reconfirmacaomatricula] Redirecionando para DividasScreen');
              router.push({
                pathname: '/telas/dividas/DividasScreen',
                params: {
                  servicosAdicionais: JSON.stringify([
                    {
                      descricao: 'Reconfirmação de Matrícula',
                      valor_total: paymentDetails.total,
                    },
                  ]),
                },
              });
            },
          },
        ]
      );
    }, 2000); // Simula um atraso de 2 segundos
  };

  useEffect(() => {
    console.log('[Reconfirmacaomatricula] Componente montado, serviceName:', serviceName);
  }, [serviceName]);

  return (
    <View style={styles.container(isDarkMode)}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header(isDarkMode)}>{serviceName}</Text>
        <Text style={styles.description(isDarkMode)}>
          Para reconfirmar a sua matrícula, é obrigatório submeter a cópia do <Text style={{ fontWeight: '700' }}>BI</Text> e efetuar o pagamento de um mês de mensalidade mais a taxa de reconfirmação.
        </Text>
        <Text style={styles.description(isDarkMode)}>
          A taxa de reconfirmação é de <Text style={{ fontWeight: '700' }}>{TAXA_RECONFIRMACAO.toLocaleString('pt-AO')} Kz</Text>.
        </Text>

        <UploadCard
          file={biFile}
          onPickDocument={handlePickDocument}
          isDarkMode={isDarkMode}
          isLoading={isLoading}
        />
        <PaymentDetailsCard details={paymentDetails} isDarkMode={isDarkMode} />

        <TouchableOpacity
          style={[styles.confirmButton, (!biFile || isLoading) && styles.confirmButtonDisabled]}
          onPress={handleConfirmarMatricula}
          disabled={!biFile || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.noteText(isDarkMode)}>
          Ao confirmar, o BI será submetido e o pagamento total de {paymentDetails.total.toLocaleString('pt-AO')} Kz será processado.
        </Text>
      </ScrollView>
    </View>
  );
}
