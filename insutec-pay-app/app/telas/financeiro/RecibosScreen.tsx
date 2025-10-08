// telas/financeiro/RecibosScreen.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, sharedStyles } from '../../../styles/_SharedFinance.styles';
import { recibosStyles } from '../../../styles/_Recibos.styles';
import { useFinance } from '../../../components/FinanceContext';
import { formatCurrency } from '../../../src/utils/formatters';

interface Recibo {
  id: string;
  title: string;
  description: string;
  date: string;
  total: number;
  status: 'PAGO' | 'PENDENTE' | 'VENCIDO';
  type: 'Serviço' | 'Externo';
  details: { label: string; value: string }[];
  saldo_anterior?: number;
  saldo_atual?: number;
}

const ReciboItem = ({ recibo, isDarkMode }: { recibo: Recibo; isDarkMode: boolean }) => {
  const isPaid = recibo.status === 'PAGO';
  const isLate = recibo.status === 'VENCIDO';

  const handleAction = () => {
    if (isPaid) {
      router.push({
        pathname: '/telas/transacao/[id]',
        params: {
          id: recibo.id,
          id_transacao_unica: recibo.id,
          valor_total: recibo.total.toFixed(2),
          descricao: recibo.description,
          metodo_pagamento: recibo.details.find((d) => d.label === 'Método')?.value || 'Desconhecido',
          status: 'SUCESSO',
          data: recibo.date,
          saldo_anterior: recibo.saldo_anterior?.toFixed(2) || '0.00',
          saldo_atual: recibo.saldo_atual?.toFixed(2) || '0.00',
        },
      });
    } else {
      router.push({
        pathname: '/telas/financeiro/CarteiraScreen',
        params: {
          id_transacao_unica: recibo.id,
          valor_total: recibo.total.toFixed(2),
          descricao: recibo.description,
        },
      });
    }
  };

  return (
    <View style={[recibosStyles.card(isDarkMode), { borderLeftColor: isPaid ? COLORS.primaryDark : isLate ? COLORS.danger : COLORS.warning }]}>
      <View style={recibosStyles.header}>
        <View style={{ flexShrink: 1 }}>
          <Text style={recibosStyles.title(isDarkMode)} numberOfLines={1}>{recibo.title}</Text>
          <Text style={recibosStyles.subtitle(isDarkMode)} numberOfLines={1}>{recibo.description}</Text>
          {isLate || recibo.status === 'PENDENTE' ? (
            <Text style={recibosStyles.dateLimit(isLate)}>
              {isLate ? 'VENCIDO' : 'Prazo: '} {recibo.details.find((d) => d.label === 'Data Limite')?.value}
            </Text>
          ) : (
            <Text style={recibosStyles.subtitle(isDarkMode)}>{`Emissão: ${recibo.date}`}</Text>
          )}
        </View>
        <View style={recibosStyles.statusBadgeBase(recibo.status === 'PAGO' ? COLORS.primary : recibo.status === 'VENCIDO' ? COLORS.danger : COLORS.warning)}>
          <Ionicons name={isPaid ? 'checkmark-circle' : isLate ? 'alert-circle' : 'time'} size={14} color={COLORS.dark} />
          <Text style={recibosStyles.statusText}>{recibo.status}</Text>
        </View>
      </View>
      <View style={recibosStyles.detailsContainer}>
        {recibo.details.filter((d) => d.label !== 'Data Limite').map((detail, index) => (
          <View key={index} style={recibosStyles.detailRow}>
            <Text style={recibosStyles.detailLabel(isDarkMode)}>{detail.label}</Text>
            <Text style={recibosStyles.detailValue(isDarkMode)}>{detail.value}</Text>
          </View>
        ))}
      </View>
      <View style={recibosStyles.separator} />
      <View style={recibosStyles.footer}>
        <View>
          <Text style={recibosStyles.totalLabel}>TOTAL</Text>
          <Text style={recibosStyles.totalValue}>{formatCurrency(recibo.total)}</Text>
        </View>
        <TouchableOpacity style={recibosStyles.actionButtonBase(isPaid)} onPress={handleAction}>
          <Text style={recibosStyles.actionButtonText}>{isPaid ? 'Visualizar' : 'Pagar Agora'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const RecibosScreen = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { recibos } = useFinance();

  const order = (status: string) => {
    if (status === 'VENCIDO') return 1;
    if (status === 'PENDENTE') return 2;
    return 3;
  };

  const recibosFiltrados = recibos.sort((a, b) => order(a.status) - order(b.status));

  return (
    <ScrollView style={sharedStyles.container(isDarkMode)} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={sharedStyles.title(isDarkMode)}>Histórico de Recibos</Text>
      {recibosFiltrados.length === 0 ? (
        <Text style={sharedStyles.emptyText(isDarkMode)}>Nenhum recibo encontrado.</Text>
      ) : (
        <View>
          <Text style={sharedStyles.sectionTitle(isDarkMode)}>Itens em Aberto e Pagos</Text>
          {recibosFiltrados.map((recibo) => (
            <ReciboItem key={recibo.id} recibo={recibo} isDarkMode={isDarkMode} />
          ))}
        </View>
      )}
      <Text style={sharedStyles.subtitle(isDarkMode)}>
        Recibos de pagamentos e transações efetuadas. O botão 'Pagar Agora' redireciona para a tela de pagamento.
      </Text>
    </ScrollView>
  );
};

export default RecibosScreen;
