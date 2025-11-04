// app/telas/Success/SuccessScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../../../components/FinanceContext';
import { formatCurrency } from '../../../src/utils/formatters';

export default function SuccessScreen() {
  const { comprovativoId } = useLocalSearchParams();
  const { comprovativos } = useFinance();

  const comprovativo = comprovativos.find(c => c.id === comprovativoId);

  if (!comprovativo) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Comprovativo não encontrado.</Text>
        <TouchableOpacity onPress={() => router.replace('/telas/home/HomeScreen')}>
          <Text style={{ color: '#0066CC', marginTop: 10 }}>Voltar ao Início</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9', padding: 20 }}>
      <View style={{ alignItems: 'center', marginTop: 60 }}>
        <Ionicons name="checkmark-circle" size={80} color="#28a745" />
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20 }}>
          Pagamento Realizado!
        </Text>
      </View>

      <View style={{ marginTop: 30, backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 3 }}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>Detalhes do Pagamento:</Text>
        <Text><Text style={{ fontWeight: '600' }}>ID:</Text> {comprovativo.id}</Text>
        <Text><Text style={{ fontWeight: '600' }}>Descrição:</Text> {comprovativo.descricao}</Text>
        <Text><Text style={{ fontWeight: '600' }}>Valor:</Text> {formatCurrency(comprovativo.valor)}</Text>
        <Text><Text style={{ fontWeight: '600' }}>Data:</Text> {new Date(comprovativo.data).toLocaleString('pt-AO')}</Text>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: '#0066CC',
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
          marginTop: 30,
        }}
        onPress={() => router.replace('/telas/home/HomeScreen')}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>Voltar ao Início</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
