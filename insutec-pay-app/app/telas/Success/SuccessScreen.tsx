// app/telas/Success/SuccessScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinance } from '../../../components/FinanceContext';
import { COLORS, sharedStyles } from '../../../styles/_SharedFinance.styles';

export default function SuccessScreen() {
  const { comprovativoId } = useLocalSearchParams<{ comprovativoId: string }>();
  const { comprovativos } = useFinance();

  const comprovativo = comprovativos.find(c => c.id === comprovativoId);
  const mensagem = comprovativo?.mensagem_sucesso || 'Pagamento concluído com sucesso!';

  return (
    <SafeAreaView style={sharedStyles.container(true)}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Ionicons name="checkmark-circle" size={100} color={COLORS.success} />

        <Text style={{ ...sharedStyles.title(true), color: COLORS.success, marginTop: 20, textAlign: 'center' }}>
          {mensagem}
        </Text>

        <Text style={{ fontSize: 14, color: COLORS.subText, textAlign: 'center', marginVertical: 16 }}>
          ID do Comprovativo: <Text style={{ fontWeight: '600' }}>{comprovativoId}</Text>
        </Text>

        <TouchableOpacity
          style={sharedStyles.payButton}
          onPress={() =>
            router.push({
              pathname: '/telas/comprovativo/ComprovativoScreen',
              params: { highlightId: comprovativoId },
            })
          }
        >
          <Text style={sharedStyles.payButtonText}>Ver Comprovativo Completo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 15 }}
          onPress={() => router.back()}
        >
          <Text style={{ color: COLORS.primary, fontWeight: '600' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
