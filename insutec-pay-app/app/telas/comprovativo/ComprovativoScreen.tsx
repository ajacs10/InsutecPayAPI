import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Platform, ScrollView } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useTheme } from '../ThemeContext/ThemeContext';
import { useFinance } from '../../../components/FinanceContext';
import { formatCurrency } from '../../../src/utils/formatters';
import { styles, COLORS } from '../../../styles/_ComprovativoScreen.styles';

export default function ComprovativoScreen() {
  const { isDarkMode } = useTheme();
  const { comprovativos } = useFinance();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleGoHome = () => {
    router.replace('/telas/home/HomeScreen');
  };

  const handleGoBack = () => {
    router.back();
  };

  const generateComprovativoContent = (comprovativo: any): string => {
    const data = new Date(comprovativo.data).toLocaleString('pt-AO');
    
    return `
COMPROVATIVO DE PAGAMENTO - INSUTEC PAY
========================================

ID da Transação: ${comprovativo.id}
Data/Hora: ${data}
Status: ${comprovativo.tipo === 'Débito' ? 'PAGO' : 'CRÉDITO'}

DETALHES DO PAGAMENTO:
----------------------
Serviço: ${comprovativo.tipo_servico || 'Serviço Académico'}
Descrição: ${comprovativo.descricao}
${comprovativo.estudante_alvo_id ? `Estudante: ${comprovativo.estudante_alvo_id}` : ''}
Método de Pagamento: ${comprovativo.metodo_pagamento || 'Cartão Atlântico Universitário+'}

INFORMAÇÕES FINANCEIRAS:
------------------------
Valor: ${formatCurrency(comprovativo.valor)}
Tipo: ${comprovativo.tipo}

========================================
Este é um comprovativo eletrónico gerado
automaticamente pelo sistema InsutecPay.

Data de emissão: ${new Date().toLocaleString('pt-AO')}
========================================
    `.trim();
  };

  const downloadComprovativo = async (comprovativo: any) => {
    try {
      setDownloadingId(comprovativo.id);
      
      const content = generateComprovativoContent(comprovativo);
      
      if (Platform.OS === 'web') {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `comprovativo_${comprovativo.id}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        Alert.alert('Sucesso', 'Comprovativo baixado com sucesso!');
        return;
      }

      const filename = `comprovativo_${comprovativo.id}.txt`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      
      await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding: FileSystem.EncodingType.UTF8
      });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/plain',
          dialogTitle: 'Compartilhar Comprovativo',
          UTI: 'public.plain-text'
        });
      } else {
        Alert.alert(
          'Download Concluído', 
          `Comprovativo salvo em: ${fileUri}`,
          [{ text: 'OK' }]
        );
      }
      
    } catch (error) {
      console.error('Erro ao baixar comprovativo:', error);
      Alert.alert('Erro', 'Não foi possível baixar o comprovativo. Tente novamente.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleComprovativoPress = (comprovativo: any) => {
    Alert.alert(
      'Comprovativo',
      `Deseja baixar o comprovativo de ${formatCurrency(comprovativo.valor)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Baixar', 
          onPress: () => downloadComprovativo(comprovativo),
          style: 'default'
        }
      ]
    );
  };

  const handleLongPress = (comprovativo: any) => {
    Alert.alert(
      'Opções do Comprovativo',
      `Comprovativo: ${comprovativo.descricao}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Baixar PDF', 
          onPress: () => downloadComprovativo(comprovativo)
        },
        {
          text: 'Ver Detalhes',
          onPress: () => showComprovativoDetails(comprovativo)
        }
      ]
    );
  };

  const showComprovativoDetails = (comprovativo: any) => {
    Alert.alert(
      'Detalhes do Comprovativo',
      `
Descrição: ${comprovativo.descricao}
Valor: ${formatCurrency(comprovativo.valor)}
Data: ${new Date(comprovativo.data).toLocaleString('pt-AO')}
Tipo: ${comprovativo.tipo}
${comprovativo.tipo_servico ? `Serviço: ${comprovativo.tipo_servico}` : ''}
${comprovativo.metodo_pagamento ? `Método: ${comprovativo.metodo_pagamento}` : ''}
      `.trim(),
      [
        { text: 'Fechar', style: 'cancel' },
        { 
          text: 'Baixar', 
          onPress: () => downloadComprovativo(comprovativo)
        }
      ]
    );
  };

  const renderComprovativo = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.comprovativoCard(isDarkMode)}
      onPress={() => handleComprovativoPress(item)}
      onLongPress={() => handleLongPress(item)}
      activeOpacity={0.7}
      delayLongPress={500}
    >
      <View style={styles.comprovativoHeader}>
        <View style={styles.comprovativoInfo}>
          <Text style={styles.comprovativoTitle(isDarkMode)} numberOfLines={2}>
            {item.descricao}
          </Text>
          {item.tipo_servico && (
            <Text style={styles.serviceType(isDarkMode)}>
              {item.tipo_servico}
            </Text>
          )}
        </View>
        
        <View style={styles.valueContainer}>
          <Text style={styles.comprovativoValue(isDarkMode)}>
            {formatCurrency(item.valor)}
          </Text>
          <TouchableOpacity 
            style={styles.downloadButton}
            onPress={() => downloadComprovativo(item)}
            disabled={downloadingId === item.id}
          >
            {downloadingId === item.id ? (
              <Ionicons name="download" size={16} color={COLORS.primary} />
            ) : (
              <Ionicons name="download-outline" size={16} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.comprovativoDetails}>
        <View style={styles.dateContainer}>
          <Ionicons 
            name="calendar-outline" 
            size={14} 
            color={isDarkMode ? COLORS.subText : COLORS.gray} 
          />
          <Text style={styles.comprovativoDate(isDarkMode)}>
            {new Date(item.data).toLocaleDateString('pt-AO', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={styles.statusBadge(item.tipo)}>
            <Ionicons 
              name={item.tipo === 'Débito' ? 'arrow-down-circle' : 'arrow-up-circle'} 
              size={12} 
              color={COLORS.primary} 
            />
            <Text style={styles.statusText}>
              {item.tipo === 'Débito' ? 'PAGO' : 'CRÉDITO'}
            </Text>
          </View>
        </View>
      </View>

      {item.metodo_pagamento && (
        <View style={styles.paymentMethod}>
          <Ionicons 
            name="card-outline" 
            size={12} 
            color={isDarkMode ? COLORS.subText : COLORS.gray} 
          />
          <Text style={styles.paymentMethodText(isDarkMode)}>
            {item.metodo_pagamento}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderHeaderButtons = () => (
    <View style={styles.headerButtonsContainer}>
      <TouchableOpacity 
        style={styles.smallButton(isDarkMode)}
        onPress={handleGoBack}
      >
        <Ionicons 
          name="arrow-back" 
          size={16} 
          color={isDarkMode ? COLORS.textLight : COLORS.textDark} 
        />
        <Text style={styles.smallButtonText(isDarkMode)}>Voltar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.smallPrimaryButton}
        onPress={handleGoHome}
      >
        <Ionicons name="home" size={16} color={COLORS.white} />
        <Text style={styles.smallPrimaryButtonText}>Início</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons 
        name="document-text-outline" 
        size={80} 
        color={COLORS.primary} 
      />
      <Text style={styles.title(isDarkMode)}>Meus Comprovativos</Text>
      <Text style={styles.emptyText(isDarkMode)}>
        Você ainda não possui comprovativos de pagamento.
      </Text>
      <Text style={styles.emptySubtext(isDarkMode)}>
        Realize pagamentos para gerar comprovativos.
      </Text>
    </View>
  );

  const renderListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listTitle(isDarkMode)}>Meus Comprovativos</Text>
      <Text style={styles.listSubtitle(isDarkMode)}>
        {comprovativos.length} comprovativo(s) encontrado(s)
      </Text>
      <Text style={styles.instructionText(isDarkMode)}>
        Toque para baixar • Mantenha pressionado para mais opções
      </Text>
    </View>
  );

  return (
    <View style={styles.safeArea(isDarkMode)}>
      <Stack.Screen
        options={{
          title: 'Comprovativos',
          headerStyle: { 
            backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground 
          },
          headerTintColor: isDarkMode ? COLORS.textLight : COLORS.textDark,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      
      {/* Botões no Topo */}
      {renderHeaderButtons()}
      
      {/* Lista de Comprovativos */}
      {comprovativos.length === 0 ? (
        <ScrollView contentContainerStyle={styles.emptyContainer}>
          {renderEmptyState()}
        </ScrollView>
      ) : (
        <FlatList
          data={comprovativos}
          renderItem={renderComprovativo}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderListHeader()}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
}
