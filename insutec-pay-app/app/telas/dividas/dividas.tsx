import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../ThemeContext/ThemeContext';
import { useFinance } from '../../../components/FinanceContext';
import { formatCurrency } from '../../../src/utils/formatters';

// Importe AQUI os estilos compartilhados
import { COLORS, sharedStyles } from '../../../styles/_SharedFinance.styles';

// Interface
interface Divida {
  id: string;
  descricao: string;
  valor_base: number;
  valor_total: number;
  data_vencimento: string;
  tipo_servico: string;
  estudante_alvo_id?: string;
}

export default function DividasScreen() {
  const { isDarkMode } = useTheme();
  const { saldo } = useFinance();
  const params = useLocalSearchParams();
  const [dividas, setDividas] = useState<Divida[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dívidas de params
  useEffect(() => {
    if (params.servicosAdicionais) {
      try {
        const servicos = JSON.parse(params.servicosAdicionais as string) as Divida[];
        setDividas(servicos);
      } catch (e) {
        setError('Erro ao carregar serviços.');
      }
    }
  }, [params.servicosAdicionais]);

  const totalDividas = dividas.reduce((sum, d) => sum + d.valor_total, 0);

  const handleIniciarPagamento = () => {
    if (dividas.length === 0) {
      setError('Nenhuma dívida selecionada.');
      return;
    }
    if (totalDividas > saldo) {
      Alert.alert('Erro', 'Saldo insuficiente.');
      return;
    }

    setIsLoading(true);
    const id = `TX-${Date.now()}`;
    const desc = dividas.map(d => d.descricao).join(', ');
    const tipo = dividas[0]?.tipo_servico || 'OUTRO';
    const estudante = dividas[0]?.estudante_alvo_id;

    setTimeout(() => {
      setIsLoading(false);
      router.push({
        pathname: '/telas/financeiro/CarteiraScreen',
        params: {
          id_transacao_unica: id,
          valor_total: totalDividas.toFixed(2),
          descricao: desc,
          tipo_servico: tipo,
          estudante_alvo_id: estudante,
        },
      });
    }, 1000);
  };

  // Use apenas sharedStyles + COLORS importados
  return (
    <ScrollView
      style={sharedStyles.container(isDarkMode)}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <Text style={sharedStyles.title(isDarkMode)}>Descricao do pagamento</Text>

      {isLoading ? (
        <View style={sharedStyles.loadingContainer(isDarkMode)}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={sharedStyles.loadingText(isDarkMode)}>Processando...</Text>
        </View>
      ) : error ? (
        <View style={sharedStyles.emptyContainer(isDarkMode)}>
          <Text style={sharedStyles.error(isDarkMode)}>{error}</Text>
        </View>
      ) : dividas.length === 0 ? (
        <View style={sharedStyles.emptyContainer(isDarkMode)}>
          <FontAwesome name="exclamation-circle" size={40} color={COLORS.subText} />
          <Text style={sharedStyles.emptyText(isDarkMode)}>Nenhuma dívida encontrada.</Text>
        </View>
      ) : (
        <>
          {dividas.map(divida => (
            <View key={divida.id} style={sharedStyles.detailCard(isDarkMode)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text style={sharedStyles.sectionTitle(isDarkMode)}>{divida.descricao}</Text>
                <Text style={sharedStyles.detailLabel(isDarkMode)}>
                  Venc: {new Date(divida.data_vencimento).toLocaleDateString('pt-AO')}
                </Text>
              </View>

              <View style={sharedStyles.detailItem}>
                <Text style={sharedStyles.detailLabel(isDarkMode)}>Base:</Text>
                <Text style={sharedStyles.detailValue(isDarkMode)}>
                  {formatCurrency(divida.valor_base)}
                </Text>
              </View>

              <View style={sharedStyles.detailItem}>
                <Text style={sharedStyles.detailLabel(isDarkMode)}>Total:</Text>
                <Text style={sharedStyles.detailValue(isDarkMode)}>
                  {formatCurrency(divida.valor_total)}
                </Text>
              </View>

              {divida.estudante_alvo_id && (
                <View style={sharedStyles.detailItem}>
                  <Text style={sharedStyles.detailLabel(isDarkMode)}>Estudante:</Text>
                  <Text style={sharedStyles.detailValue(isDarkMode)}>
                    {divida.estudante_alvo_id}
                  </Text>
                </View>
              )}
            </View>
          ))}

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 16,
            marginVertical: 20,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: isDarkMode ? COLORS.gray + '50' : COLORS.lightGray + '50',
          }}>
            <Text style={sharedStyles.sectionTitle(isDarkMode)}>Total:</Text>
            <Text style={{ ...sharedStyles.sectionTitle(isDarkMode), color: COLORS.primary }}>
              {formatCurrency(totalDividas)}
            </Text>
          </View>
        </>
      )}

      {dividas.length > 0 && (
        <TouchableOpacity
          style={[
            sharedStyles.payButton,
            isLoading || dividas.length === 0 ? sharedStyles.payButtonDisabled : {}
          ]}
          onPress={handleIniciarPagamento}
          disabled={isLoading || dividas.length === 0}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.dark} size="small" />
          ) : (
            <Text style={sharedStyles.payButtonText}>
              Pagar Agora ({formatCurrency(totalDividas)}) <FontAwesome name="arrow-right" size={16} />
            </Text>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
