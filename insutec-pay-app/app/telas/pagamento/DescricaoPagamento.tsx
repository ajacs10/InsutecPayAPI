// app/telas/pagamento/DescricaoPagamentoScreen.tsx
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
import { useAuth } from '../../../components/AuthContext';
import { formatCurrency } from '../../../src/utils/formatters';
import { COLORS, sharedStyles } from '../../../styles/_SharedFinance.styles';

// Interface do serviço
interface Servico {
  id: string;
  descricao: string;
  valor_base: number;
  valor_total: number;
  data_vencimento: string;
  tipo_servico: string;
  estudante_alvo_id?: string;
}

export default function DescricaoPagamentoScreen() {
  const { isDarkMode } = useTheme();
  const { saldo } = useFinance();
  const { user } = useAuth(); // Usuário logado
  const params = useLocalSearchParams();

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar serviços de params
  useEffect(() => {
    if (params.servicosAdicionais) {
      try {
        const dados = JSON.parse(params.servicosAdicionais as string) as Servico[];
        setServicos(dados);
      } catch (e) {
        setError('Erro ao carregar informações do pagamento.');
      }
    }
  }, [params.servicosAdicionais]);

  const totalPagar = servicos.reduce((sum, s) => sum + s.valor_total, 0);

  const handleIniciarPagamento = () => {
    if (servicos.length === 0) {
      setError('Nenhum serviço selecionado.');
      return;
    }
    if (totalPagar > saldo) {
      Alert.alert('Saldo Insuficiente', `Você precisa de ${formatCurrency(totalPagar)}`);
      return;
    }

    setIsLoading(true);
    const id = `PAY-${Date.now()}`;
    const desc = servicos.map(s => s.descricao).join(', ');
    const tipo = servicos[0]?.tipo_servico || 'SERVICO';
    const estudante = servicos[0]?.estudante_alvo_id;

    setTimeout(() => {
      setIsLoading(false);
      router.push({
        pathname: '/telas/financeiro/CarteiraScreen',
        params: {
          id_transacao_unica: id,
          valor_total: totalPagar.toFixed(2),
          descricao: desc,
          tipo_servico: tipo,
          estudante_alvo_id: estudante,
          pagador_nome: user?.nome || 'Usuário',
          pagador_id: user?.id || 'N/A',
        },
      });
    }, 1000);
  };

  return (
    <ScrollView
      style={sharedStyles.container(isDarkMode)}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <Text style={sharedStyles.title(isDarkMode)}>Descrição do Pagamento</Text>

      {isLoading ? (
        <View style={sharedStyles.loadingContainer(isDarkMode)}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={sharedStyles.loadingText(isDarkMode)}>Preparando...</Text>
        </View>
      ) : error ? (
        <View style={sharedStyles.emptyContainer(isDarkMode)}>
          <Text style={sharedStyles.error(isDarkMode)}>{error}</Text>
        </View>
      ) : servicos.length === 0 ? (
        <View style={sharedStyles.emptyContainer(isDarkMode)}>
          <FontAwesome name="info-circle" size={40} color={COLORS.subText} />
          <Text style={sharedStyles.emptyText(isDarkMode)}>
            Nenhum serviço encontrado.
          </Text>
        </View>
      ) : (
        <>
          {/* Informações do Pagador */}
          <View style={sharedStyles.detailCard(isDarkMode)}>
            <Text style={sharedStyles.sectionTitle(isDarkMode)}>Quem está pagando</Text>
            <View style={sharedStyles.detailItem}>
              <Text style={sharedStyles.detailLabel(isDarkMode)}>Nome:</Text>
              <Text style={sharedStyles.detailValue(isDarkMode)}>
                {user?.nome || 'Usuário Anônimo'}
              </Text>
            </View>
            <View style={sharedStyles.detailItem}>
              <Text style={sharedStyles.detailLabel(isDarkMode)}>ID:</Text>
              <Text style={sharedStyles.detailValue(isDarkMode)}>
                {user?.id || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Detalhes do Serviço */}
          {servicos.map(servico => (
            <View key={servico.id} style={sharedStyles.detailCard(isDarkMode)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text style={sharedStyles.sectionTitle(isDarkMode)}>{servico.descricao}</Text>
                <Text style={sharedStyles.detailLabel(isDarkMode)}>
                  Venc: {new Date(servico.data_vencimento).toLocaleDateString('pt-AO')}
                </Text>
              </View>

              <View style={sharedStyles.detailItem}>
                <Text style={sharedStyles.detailLabel(isDarkMode)}>Valor Base:</Text>
                <Text style={sharedStyles.detailValue(isDarkMode)}>
                  {formatCurrency(servico.valor_base)}
                </Text>
              </View>

              <View style={sharedStyles.detailItem}>
                <Text style={sharedStyles.detailLabel(isDarkMode)}>Valor Total:</Text>
                <Text style={sharedStyles.detailValue(isDarkMode)}>
                  {formatCurrency(servico.valor_total)}
                </Text>
              </View>

              {servico.estudante_alvo_id && (
                <View style={sharedStyles.detailItem}>
                  <Text style={sharedStyles.detailLabel(isDarkMode)}>Nº do Estudante:</Text>
                  <Text style={sharedStyles.detailValue(isDarkMode)}>
                    {servico.estudante_alvo_id}
                  </Text>
                </View>
              )}
            </View>
          ))}

          {/* Total */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 16,
            marginVertical: 20,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: isDarkMode ? COLORS.gray + '50' : COLORS.lightGray + '50',
          }}>
            <Text style={sharedStyles.sectionTitle(isDarkMode)}>Total a Pagar:</Text>
            <Text style={{ ...sharedStyles.sectionTitle(isDarkMode), color: COLORS.primary }}>
              {formatCurrency(totalPagar)}
            </Text>
          </View>
        </>
      )}

      {/* Botão Pagar */}
      {servicos.length > 0 && (
        <TouchableOpacity
          style={[
            sharedStyles.payButton,
            isLoading || totalPagar > saldo ? sharedStyles.payButtonDisabled : {}
          ]}
          onPress={handleIniciarPagamento}
          disabled={isLoading || totalPagar > saldo}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.dark} size="small" />
          ) : (
            <Text style={sharedStyles.payButtonText}>
              Pagar Agora ({formatCurrency(totalPagar)}) <FontAwesome name="arrow-right" size={16} />
            </Text>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
