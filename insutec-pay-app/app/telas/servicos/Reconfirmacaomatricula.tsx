// telas/servicos/ReconfirmacaoMatricula.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../ThemeContext/ThemeContext';
import { styles, COLORS } from '../../../styles/_Reconfirmacao.styles';
import { formatCurrency } from '../../../src/utils/formatters';

interface PaymentDetails {
  taxaReconfirmacao: number;
  totalTaxa: number;
}

const TAXA_RECONFIRMACAO = 15000;

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

const PaymentDetailsCard: React.FC<{
  details: PaymentDetails;
  isDarkMode: boolean;
}> = ({ details, isDarkMode }) => (
  <View style={styles.card(isDarkMode)}>
    <Text style={styles.cardTitle(isDarkMode)}>2. Detalhes do Serviço</Text>
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel(isDarkMode), { fontWeight: '700' }]}>Taxa de Reconfirmação:</Text>
      <Text style={[styles.detailValue(isDarkMode), { color: COLORS.danger, fontWeight: '700' }]}>
        {formatCurrency(details.taxaReconfirmacao)}
      </Text>
    </View>
    <View style={styles.divider(isDarkMode)} />
    <View style={styles.detailRow}>
      <Text style={styles.totalLabel(isDarkMode)}>Valor do Serviço:</Text>
      <Text style={styles.totalValue}>{formatCurrency(details.totalTaxa)}</Text>
    </View>
    <Text style={styles.smallText(isDarkMode)}>
      Nota: A mensalidade da propina deve ser paga separadamente ou será listada como dívida.
    </Text>
  </View>
);

export default function ReconfirmacaoMatricula() {
  const { isDarkMode } = useTheme();
  const params = useLocalSearchParams();
  const [biFile, setBiFile] = useState<DocumentPicker.DocumentAsset | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const paymentDetails: PaymentDetails = {
    taxaReconfirmacao: TAXA_RECONFIRMACAO,
    totalTaxa: TAXA_RECONFIRMACAO,
  };

  const serviceName = React.useMemo(() => {
    try {
      if (params.servico && typeof params.servico === 'string') {
        const parsed = JSON.parse(params.servico) as { nome: string };
        return parsed.nome || 'Reconfirmação de Matrícula';
      }
    } catch (error) {
      console.error('[Reconfirmacaomatricula] Erro ao parsear params.servico:', error);
    }
    return 'Reconfirmação de Matrícula';
  }, [params.servico]);

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

  const handleConfirmarMatricula = () => {
    if (!biFile) {
      Alert.alert('Ficheiro em Falta', 'Por favor, carregue a cópia do BI (PDF ou Imagem) antes de continuar.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const transacaoId = `RECONF-${Date.now()}`;
      router.push({
        pathname: '/telas/financeiro/CarteiraScreen',
        params: {
          id_transacao_unica: transacaoId,
          valor_total: paymentDetails.totalTaxa.toFixed(2),
          descricao: 'Taxa de Reconfirmação de Matrícula',
        },
      });
    }, 2000);
  };

  return (
    <View style={styles.container(isDarkMode)}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header(isDarkMode)}>{serviceName}</Text>
        <Text style={styles.description(isDarkMode)}>
          Para reconfirmar a sua matrícula, é obrigatório submeter a cópia do <Text style={{ fontWeight: '700' }}>BI</Text> e efetuar o pagamento da <Text style={{ fontWeight: '700' }}>Taxa de Reconfirmação.</Text>
        </Text>
        <Text style={styles.description(isDarkMode)}>
          A Taxa de Reconfirmação é de <Text style={{ fontWeight: '700' }}>{formatCurrency(TAXA_RECONFIRMACAO)}</Text> e será processada na próxima tela.
        </Text>

        <UploadCard file={biFile} onPickDocument={handlePickDocument} isDarkMode={isDarkMode} isLoading={isLoading} />
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
            <Text style={styles.confirmButtonText}>Confirmar e Pagar</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.noteText(isDarkMode)}>
          Ao confirmar, o BI será submetido e o pagamento de {formatCurrency(paymentDetails.totalTaxa)} será processado na tela seguinte.
        </Text>
      </ScrollView>
    </View>
  );
}
