// app/telas/admin/DashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../../components/AuthContext';
import { getAlunosAdmin, deleteAluno } from '../../../src/api/InsutecPayAPI';
import { styles, COLORS } from '../../../styles/Admin.styles';

export default function DashboardScreen() {
  const { aluno, signOut } = useAuth();
  const [alunos, setAlunos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (aluno?.tipo_usuario !== 'ADMIN') {
      router.replace('/telas/home/HomeScreen');
    } else {
      loadAlunos();
    }
  }, [aluno]);

  const loadAlunos = async () => {
    try {
      const data = await getAlunosAdmin();
      setAlunos(data);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert('Excluir', 'Tem certeza?', [
      { text: 'Cancelar' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAluno(id);
            setAlunos(prev => prev.filter(a => a.id !== id));
          } catch (error: any) {
            Alert.alert('Erro', error.message);
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/telas/login/LoginScreen');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Painel Admin</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color={COLORS.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total de Alunos</Text>
          <Text style={styles.cardValue}>{alunos.length}</Text>
        </View>

        <Text style={styles.sectionTitle}>Lista de Alunos</Text>
        {alunos.map((a) => (
          <View key={a.id} style={styles.alunoItem}>
            <View>
              <Text style={styles.alunoNome}>{a.nome_completo}</Text>
              <Text style={styles.alunoEmail}>{a.email}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(a.id)}>
              <Ionicons name="trash-outline" size={24} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/telas/admin/EmolumentosScreen')}>
        <Ionicons name="add" size={30} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
}
