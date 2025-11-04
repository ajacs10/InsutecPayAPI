// app/telas/Success/Success.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext/ThemeContext'; 

// 💡 IMPORTANTE: Presumindo que esta função existe e gera/descarrega o comprovativo
// (Substituir 'any' pelo tipo correto se tiveres a função)
import { gerarComprovativoDocx } from '../comprovativo/gerarComprovativoDocx';

// Função utilitária para formatar valores (se não tiveres no ficheiro global)
const formatValue = (value: number | string | undefined) => {
  if (value === undefined) return '0 Kz';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0 Kz';
  return num.toLocaleString('pt-AO') + ' Kz';
};

export default function SuccessScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const [isDownloading, setIsDownloading] = useState(false);

  // 1. Obter dados da transação (passados do DescricaoPagamento.tsx)
  const transacaoId = params.transacaoId as string || 'N/D';
  const valor = parseFloat(params.valor as string || '0');
  const descricao = params.descricao as string || 'Pagamento efetuado';
  const data = new Date().toLocaleDateString('pt-AO');
  const hora = new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' });

  // 2. Lógica para gerar e descarregar o comprovativo
  const handleDownloadComprovativo = async () => {
    setIsDownloading(true);
    try {
      // 💡 Chamada à função real de geração. Passa todos os dados necessários.
      const sucesso = await gerarComprovativoDocx({ 
        id: transacaoId, 
        valor, 
        descricao, 
        data: new Date().toISOString() 
        // Adicionar outros campos de Comprovativo aqui 
      });

      if (sucesso) {
        Alert.alert('Sucesso!', 'O comprovativo foi descarregado com êxito para a sua pasta de documentos.');
      } else {
        Alert.alert('Erro', 'Não foi possível gerar o comprovativo. Tente novamente mais tarde.');
      }

    } catch (error) {
      console.error('Erro ao descarregar comprovativo:', error);
      Alert.alert('Erro', 'Ocorreu um problema inesperado ao gerar o ficheiro.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Componente para os detalhes
  const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
    </View>
  );


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Secção de Confirmação Visual (A celebração!) */}
      <View style={[styles.header, { backgroundColor: colors.successBackground }]}>
        <MaterialCommunityIcons 
          name="check-circle" 
          size={80} 
          color={colors.successText} 
        />
        <Text style={[styles.successTitle, { color: colors.text }]}>
          Pagamento Concluído!
        </Text>
        <Text style={[styles.successValue, { color: colors.successText }]}>
          {formatValue(valor)}
        </Text>
      </View>

      {/* Detalhes da Transação */}
      <View style={[styles.detailsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.primary }]}>
          Resumo da Transação
        </Text>
        <DetailRow label="ID da Transação" value={transacaoId} />
        <DetailRow label="Data" value={data} />
        <DetailRow label="Hora" value={hora} />
        <DetailRow label="Descrição" value={descricao} />
      </View>

      {/* Botões de Ação */}
      <View style={styles.buttonContainer}>
        
        {/* Gerar Comprovativo */}
        <TouchableOpacity 
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={handleDownloadComprovativo}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>
              Descarregar Comprovativo
            </Text>
          )}
        </TouchableOpacity>

        {/* Voltar à Home */}
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.replace('/telas/home/home')}
        >
          <Text style={[styles.buttonText, { color: colors.primary }]}>
            Voltar à Home
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
    borderRadius: 15,
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
  },
  successValue: {
    fontSize: 32,
    fontWeight: '900',
    marginTop: 5,
  },
  detailsCard: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    marginBottom: 40,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 15,
    borderBottomColor: '#E0E0E0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  detailLabel: {
    fontSize: 15,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
  },
  primaryButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    marginBottom: 15,
  },
  secondaryButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    borderWidth: 2,
    borderColor: '#0b5394', // Corrigir para usar colors.primary
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#FFFFFF', // Corrigir para usar colors.text no secondaryButton
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// ✅ EXPORTAR O COMPONENTE SEM O SUFIXO 'Screen' PARA MANTER CONSISTÊNCIA
// (embora o nome do ficheiro seja Success.tsx)
// export default Success;
