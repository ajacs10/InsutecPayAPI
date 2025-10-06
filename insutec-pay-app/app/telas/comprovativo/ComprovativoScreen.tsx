import React, { useCallback, useRef, useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView, 
    Alert, 
    StyleSheet, 
    Platform, 
    ActivityIndicator 
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router'; 
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext/ThemeContext';
import { formatCurrency, formatDate } from '../../../src/utils/formatters';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { styles, COLORS } from '../../../styles/_Comprovativo.styles';

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
  status: 'FALHA',
  data: new Date().toISOString(),
  saldo_anterior: '0.00',
  saldo_atual: '0.00',
};

export default function ComprovativoScreen() {
  const { isDarkMode } = useTheme();
  const params = useLocalSearchParams() as unknown as ComprovativoParams;
  const comprovativo = { ...DEFAULT_PARAMS, ...params };

  const valorTotal = parseFloat(comprovativo.valor_total);
  const saldoAtual = parseFloat(comprovativo.saldo_atual);

  const viewShotRef = useRef<ViewShot>(null);
  const [isSharing, setIsSharing] = useState(false);

  const statusInfo = {
    SUCESSO: { color: COLORS.success, icon: 'check-circle', text: 'Pagamento Concluído' },
    PENDENTE: { color: COLORS.warning || '#FFC107', icon: 'alert-circle', text: 'Em Processamento' }, 
    FALHA: { color: COLORS.danger, icon: 'close-circle', text: 'Falha na Transação' },
  };

  const currentStatus = statusInfo[comprovativo.status] || statusInfo.FALHA;
  const isSuccess = comprovativo.status === 'SUCESSO';

  const handleShareComprovativo = useCallback(async () => {
    if (!viewShotRef.current || isSharing) return;

    setIsSharing(true);
    console.log('[ComprovativoScreen] Iniciando compartilhamento do comprovativo');
    try {
        if (viewShotRef.current === null) {
            throw new Error("ViewShot reference is null.");
        }

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
      console.log('[ComprovativoScreen] Comprovativo compartilhado com sucesso');
    } catch (error) {
      console.error('[ComprovativoScreen] Erro ao partilhar comprovativo:', error);
      Alert.alert('Erro', 'Não foi possível gerar ou partilhar o comprovativo.');
    } finally {
      setIsSharing(false);
    }
  }, [comprovativo.id_transacao_unica, isSharing]);

  console.log('[ComprovativoScreen] Renderizando com parâmetros:', comprovativo);

  return (
    {/* Usa styles.fullContainer(isDarkMode) para corrigir o TypeError anterior */}
    <ScrollView 
        style={styles.fullContainer(isDarkMode)} 
        contentContainerStyle={styles.scrollContentContainer} // Usando o estilo estático para contentContainer
    >
      <Stack.Screen
        options={{
          title: 'Comprovativo',
          headerShown: false,
          presentation: 'modal',
        }}
      />
      
      <ViewShot 
          ref={viewShotRef} 
          options={{ format: 'jpg', quality: 0.9 }} 
          style={{ flex: 1, backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground }}
      >
        
        {/* Cartão do cabeçalho com status */}
        <View style={styles.headerCard(isDarkMode, isSuccess)}>
          <MaterialCommunityIcons name={currentStatus.icon as any} size={48} color={currentStatus.color} />
          <Text style={styles.statusText(currentStatus.color)}>{currentStatus.text}</Text>
          <Text style={styles.valueText}>{formatCurrency(valorTotal)}</Text>
        </View>

        {/* Detalhes da Transação */}
        <View style={styles.detailSection(isDarkMode)}>
          <Text style={styles.sectionTitle(isDarkMode)}>Detalhes da Transação</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel(isDarkMode)}>ID Transação:</Text>
            <Text style={styles.detailValue(isDarkMode, false)}>{comprovativo.id_transacao_unica}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel(isDarkMode)}>Data e Hora:</Text>
            <Text style={styles.detailValue(isDarkMode, false)}>{formatDate(comprovativo.data)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel(isDarkMode)}>Descrição:</Text>
            <Text style={styles.detailValue(isDarkMode, false)}>{comprovativo.descricao}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel(isDarkMode)}>Método de Pagamento:</Text>
            <Text style={styles.detailValue(isDarkMode, false)}>{comprovativo.metodo_pagamento}</Text>
          </View>
        </View>

        {/* Resumo Financeiro */}
        <View style={styles.detailSection(isDarkMode)}>
          <Text style={styles.sectionTitle(isDarkMode)}>Resumo Financeiro</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel(isDarkMode)}>VALOR PAGO</Text>
            <Text style={styles.detailValue(isDarkMode, true)}>{formatCurrency(valorTotal)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel(isDarkMode)}>Saldo Anterior</Text>
            <Text style={styles.detailValue(isDarkMode, false)}>{formatCurrency(parseFloat(comprovativo.saldo_anterior))}</Text>
          </View>
          
          {isSuccess && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel(isDarkMode)}>Saldo Atual</Text>
              <Text style={styles.detailValue(isDarkMode, false)}>{formatCurrency(saldoAtual)}</Text>
            </View>
          )}
        </View>
      </ViewShot>

      {/* Botões de Ação Fixos */}
      <View style={styles.actionContainer(isDarkMode)}>
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
          <Text style={styles.buttonText}>{isSharing ? 'A preparar...' : 'Partilhar Comprovativo'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.homeButton} 
          onPress={() => router.replace('/telas/home/HomeScreen')}
        >
          <Text style={[styles.buttonText, { color: COLORS.white }]}>Concluir</Text> 
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
