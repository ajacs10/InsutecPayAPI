// app/telas/comprovativo/ComprovativoScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext/ThemeContext';
import { useFinance } from '../../../components/FinanceContext';
import { useAuth } from '../../../components/AuthContext';
import { COLORS, sharedStyles } from '../../../styles/_SharedFinance.styles';
import QRCode from 'react-native-qrcode-svg';
import { gerarRecibo } from './gerarComprovativoDocx';

// === DATA E HORA DE LUANDA (UTC+1) ===
const getLuandaDateTime = () => {
  const now = new Date();
  const luandaOffset = 1 * 60; // UTC+1
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const luandaTime = new Date(utc + luandaOffset * 60000);

  const data = luandaTime.toLocaleDateString('pt-AO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const hora = luandaTime.toLocaleTimeString('pt-AO', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return { data, hora };
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-AO', { day: '2-digit', month: '2-digit', year: 'numeric' });

const formatFullDate = (iso: string) =>
  new Date(iso).toLocaleString('pt-AO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatCurrency = (v: number | string) => {
  const num = typeof v === 'string' ? parseFloat(v) : v;
  return num.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 2 });
};

export default function ComprovativoScreen() {
  const { isDarkMode } = useTheme();
  const { comprovativos } = useFinance();
  const { aluno } = useAuth();
  const { highlightId } = useLocalSearchParams<{ highlightId?: string }>();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(highlightId || null);

  const selectedComprovativo = comprovativos.find(c => c.id === selectedId);

  // === GERAR RECIBO EM QUALQUER FORMATO ===
  const handleGerarRecibo = async (formato: 'docx' | 'pdf' | 'txt') => {
    if (!selectedComprovativo) return;

    setDownloadingId(selectedComprovativo.id);

    const { data, hora } = getLuandaDateTime();

    const dados = {
      ANO: new Date().getFullYear(),
      NUMERO: selectedComprovativo.id.slice(-5),
      DATA: formatDate(selectedComprovativo.data),
      HORA: new Date(selectedComprovativo.data).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }),
      NOME_ESTUDANTE: aluno?.nome || 'Estudante',
      NIF_ESTUDANTE: aluno?.nif || '000000000LA000',
      MORADA: aluno?.morada || 'Não informada',
      NUM_ESTUDANTE: aluno?.nr_estudante || '000000',
      CURSO: aluno?.curso || 'Curso não definido',
      ANO: aluno?.ano || '1',
      TURNO: aluno?.turno || 'M',
      ANO_LECTIVO: '2025/2026',
      SERVICO: selectedComprovativo.descricao,
      VALOR: formatCurrency(selectedComprovativo.valor).replace('AOA', '').trim(),
      QT: '1',
      TIPOSERVICO: selectedComprovativo.tipo_servico,
      // Data/Hora de Luanda será sobrescrita no gerarRecibo
    };

    try {
      await gerarRecibo(dados, formato);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', `Falha ao gerar ${formato.toUpperCase()}.`);
    } finally {
      setDownloadingId(null);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isSelected = selectedId === item.id;
    const isDownloading = downloadingId === item.id;

    return (
      <TouchableOpacity
        style={[
          sharedStyles.card(isDarkMode),
          isSelected && { borderColor: COLORS.primary, borderWidth: 2 },
        ]}
        onPress={() => setSelectedId(item.id)}
        onLongPress={() => handleGerarRecibo('txt')}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={sharedStyles.sectionTitle(isDarkMode)}>{item.descricao}</Text>
            <Text style={sharedStyles.label(isDarkMode)}>
              {item.tipo_servico} • {formatDate(item.data)}
            </Text>
          </View>
          <Text style={{ ...sharedStyles.value(isDarkMode), fontWeight: '700' }}>
            {formatCurrency(item.valor)}
          </Text>
        </View>
        {isDownloading && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={{ marginLeft: 8, color: COLORS.primary }}>Gerando...</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={sharedStyles.container(isDarkMode)}>
      <Stack.Screen options={{ title: 'Comprovativos' }} />

      {/* Cabeçalho */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/telas/home/HomeScreen')}>
          <Ionicons name="home" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {comprovativos.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="document-text-outline" size={80} color={COLORS.subText} />
          <Text style={sharedStyles.title(isDarkMode)}>Nenhum comprovativo</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {/* Lista */}
          <FlatList
            data={comprovativos}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            style={{ flex: selectedComprovativo ? 0.4 : 1 }}
          />

          {/* Detalhe */}
          {selectedComprovativo && (
            <ScrollView
              style={{
                flex: 0.6,
                backgroundColor: isDarkMode ? '#111' : '#f9f9f9',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingTop: 16,
                marginTop: 8,
              }}
            >
              <Text style={{ ...sharedStyles.title(isDarkMode), textAlign: 'center', marginBottom: 16 }}>
                Detalhe do Comprovativo
              </Text>

              <View style={sharedStyles.card(isDarkMode)}>
                {/* QR Code */}
                <View style={{ alignItems: 'center', marginVertical: 16 }}>
                  <QRCode
                    value={selectedComprovativo.qrCode || selectedComprovativo.id}
                    size={160}
                  />
                </View>

                {/* Dados do Aluno */}
                <View style={styles.row}>
                  <Text style={sharedStyles.label(isDarkMode)}>Estudante:</Text>
                  <Text style={sharedStyles.value(isDarkMode)}>{aluno?.nome}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={sharedStyles.label(isDarkMode)}>Nº Estudante:</Text>
                  <Text style={sharedStyles.value(isDarkMode)}>{aluno?.nr_estudante}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={sharedStyles.label(isDarkMode)}>Curso:</Text>
                  <Text style={sharedStyles.value(isDarkMode)}>
                    {aluno?.curso} ({aluno?.ano}ºAno - {aluno?.turno})
                  </Text>
                </View>

                <View style={styles.divider} />

                {/* Serviço */}
                <View style={styles.row}>
                  <Text style={sharedStyles.label(isDarkMode)}>Serviço:</Text>
                  <Text style={sharedStyles.value(isDarkMode)}>{selectedComprovativo.tipo_servico}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={sharedStyles.label(isDarkMode)}>Descrição:</Text>
                  <Text style={sharedStyles.value(isDarkMode)}>{selectedComprovativo.descricao}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={sharedStyles.label(isDarkMode)}>Data:</Text>
                  <Text style={sharedStyles.value(isDarkMode)}>{formatFullDate(selectedComprovativo.data)}</Text>
                </View>

                <View style={styles.divider} />

                {/* Valores */}
                <View style={styles.row}>
                  <Text style={sharedStyles.label(isDarkMode)}>Valor Total:</Text>
                  <Text style={sharedStyles.value(isDarkMode)}>{formatCurrency(selectedComprovativo.valor)}</Text>
                </View>
                {selectedComprovativo.valor_multas && parseFloat(selectedComprovativo.valor_multas) > 0 && (
                  <View style={styles.row}>
                    <Text style={sharedStyles.label(isDarkMode)}>Multa:</Text>
                    <Text style={{ ...sharedStyles.value(isDarkMode), color: COLORS.danger }}>
                      + {formatCurrency(selectedComprovativo.valor_multas)}
                    </Text>
                  </View>
                )}
                <View style={styles.row}>
                  <Text style={sharedStyles.label(isDarkMode)}>Método:</Text>
                  <Text style={sharedStyles.value(isDarkMode)}>Carteira Insutec Pay</Text>
                </View>

                <View style={styles.divider} />
              </View>

              {/* Botões de Download */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20, flexWrap: 'wrap' }}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleGerarRecibo('pdf')}
                  disabled={downloadingId !== null}
                >
                  <Feather name="file-text" size={20} color="#fff" />
                  <Text style={styles.actionText}>PDF</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleGerarRecibo('txt')}
                  disabled={downloadingId !== null}
                >
                  <Feather name="download" size={20} color="#fff" />
                  <Text style={styles.actionText}>TXT</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleGerarRecibo('docx')}
                  disabled={downloadingId !== null}
                >
                  <Feather name="file-word" size={20} color="#fff" />
                  <Text style={styles.actionText}>DOCX</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleGerarRecibo('txt')}
                  disabled={downloadingId !== null}
                >
                  <Feather name="share-2" size={20} color="#fff" />
                  <Text style={styles.actionText}>Compartilhar</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={{ alignSelf: 'center', marginBottom: 20 }}
                onPress={() => setSelectedId(null)}
              >
                <Text style={{ color: COLORS.primary, fontWeight: '600' }}>Fechar Detalhe</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = {
  row: { flexDirection: 'row' as const, justifyContent: 'space-between', marginBottom: 8 },
  divider: { height: 1, backgroundColor: '#444', marginVertical: 16 },
  actionButton: {
    backgroundColor: COLORS.primaryDark,
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
    margin: 5,
  },
  actionText: { color: '#fff', fontWeight: '600' },
};
