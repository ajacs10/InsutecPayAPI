// app/telas/admin/AlunosScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { api } from '../../../src/api/InsutecPayAPI';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface Aluno {
  id: number;
  tipo_usuario: string;
  nome_completo: string;
  email: string;
}

export default function AlunosScreen() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [filtered, setFiltered] = useState<Aluno[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlunos();
  }, []);

  const fetchAlunos = async () => {
    try {
      const res = await api.get('/admin/alunos');
      setAlunos(res.data);
      setFiltered(res.data);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar alunos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = alunos.filter(
      (a) =>
        a.nome_completo.toLowerCase().includes(text.toLowerCase()) ||
        a.email.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filtered);
  };

  const deleteAluno = async (id: number) => {
    Alert.alert('Excluir', 'Tem certeza?', [
      { text: 'Cancelar' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/aluno/${id}`);
            fetchAlunos();
            Alert.alert('Sucesso', 'Aluno excluído');
          } catch (error) {
            Alert.alert('Erro', 'Falha ao excluir');
          }
        },
      },
    ]);
  };

  const exportarExcel = async () => {
    const csv = [
      ['ID', 'Tipo', 'Nome', 'Email'],
      ...filtered.map((a) => [a.id, a.tipo_usuario, a.nome_completo, a.email]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const fileUri = FileSystem.documentDirectory + 'alunos.csv';
    await FileSystem.writeAsStringAsync(fileUri, csv);
    await Sharing.shareAsync(fileUri);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Alunos</Text>

      <TextInput
        style={styles.search}
        placeholder="Buscar por nome ou email..."
        value={search}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.nome}>{item.nome_completo}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.tipo}>{item.tipo_usuario}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => router.push(`/telas/admin/EditarAluno?id=${item.id}`)}
              >
                <Text style={styles.btnText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteAluno(item.id)}>
                <Text style={styles.btnText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum aluno encontrado</Text>}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.exportBtn} onPress={exportarExcel}>
          <Text style={styles.exportText}>Exportar Excel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/telas/admin/DashboardScreen')}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  search: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },
  nome: { fontWeight: 'bold', fontSize: 16 },
  email: { color: '#666', fontSize: 14 },
  tipo: { color: '#007bff', fontSize: 12, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 10 },
  editBtn: { backgroundColor: '#007bff', padding: 8, borderRadius: 6 },
  deleteBtn: { backgroundColor: '#dc3545', padding: 8, borderRadius: 6 },
  btnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#666', marginTop: 20 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  exportBtn: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, flex: 0.48 },
  exportText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  backBtn: { backgroundColor: '#6c757d', padding: 15, borderRadius: 8, flex: 0.48 },
  backText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
