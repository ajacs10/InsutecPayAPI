
import React from 'react';
import { View, Text, TouchableOpacity, Alert, Switch, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

// Contextos
import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';

// Estilos e Cores
import { styles, COLORS } from '../../../styles/_Perfil.styles';

export default function PerfilScreen() {
  const { aluno, signOut: logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  // Função auxiliar para obter as iniciais do nome para o Avatar
  const getInitials = (name: string | undefined): string => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  // Confirmação e execução do Logout
  const handleLogout = () => {
    Alert.alert(
      'Terminar Sessão',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          onPress: async () => {
            try {
              await logout();
              router.replace('/telas/login');
              console.log('[PerfilScreen] Logout realizado com sucesso.');
            } catch (error) {
              console.error('[PerfilScreen] Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Falha ao terminar a sessão.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (!aluno) {
    console.log('[PerfilScreen] Aluno não encontrado, redirecionando para login.');
    return (
      <View style={styles.container(isDarkMode)}>
        <Text style={styles.errorText(isDarkMode)}>Erro: Dados do aluno não carregados.</Text>
        <TouchableOpacity
          onPress={() => router.replace('/telas/login')}
          style={styles.linkButton(isDarkMode)}
        >
          <Text style={styles.linkText(isDarkMode)}>Ir para Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  console.log('[PerfilScreen] Renderizando perfil para:', aluno.nr_estudante);

  return (
    <View style={styles.container(isDarkMode)}>
      <ScrollView
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: 30,
          paddingTop: 10,
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.profileCard(isDarkMode)}>
          <View style={styles.avatar(isDarkMode)}>
            <Text style={styles.avatarText(isDarkMode)}>{getInitials(aluno.nome)}</Text>
          </View>
          <Text style={styles.nameText(isDarkMode)}>{aluno.nome}</Text>
          <Text style={styles.studentNumberText(isDarkMode)}>
            Nº de Estudante: {aluno.nr_estudante}
          </Text>
          <View style={styles.infoBlock(isDarkMode)}>
            <Text style={styles.infoTitle(isDarkMode)}>Informação de Contacto</Text>
            <Text style={styles.infoDetail(isDarkMode)}>
              Email: {aluno.nr_estudante}@insutec.co.ao
            </Text>
            <Text style={styles.infoDetail(isDarkMode)}>Curso: Engenharia Informática</Text>
          </View>
        </View>

        <View style={styles.toggleContainer(isDarkMode)}>
          <Text style={styles.label(isDarkMode)}>Modo Escuro</Text>
          <Switch
            onValueChange={toggleTheme}
            value={isDarkMode}
            trackColor={{ false: '#CCCCCC', true: COLORS.primaryDark }}
            thumbColor={isDarkMode ? COLORS.accent : COLORS.white}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton(isDarkMode)} onPress={handleLogout}>
          <Text style={styles.logoutButtonText(isDarkMode)}>Terminar Sessão</Text>
        </TouchableOpacity>

        <View style={styles.statusContainer(isDarkMode)}>
          <FontAwesome name="check-circle" size={16} color={COLORS.primary} />
          <Text style={styles.statusText(isDarkMode)}>Sessão segura e autenticada.</Text>
        </View>
      </ScrollView>
    </View>
  );
}
