import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Switch,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';
import { styles, COLORS } from '../../../styles/_Perfil.styles';

export default function PerfilScreen() {
  // TODOS OS HOOKS PRIMEIRO
  // Removido: 'signOut' de useAuth
  const { aluno, userToken } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  // Removido: 'isLoggingOut' e seu estado
  const windowWidth = Dimensions.get('window').width;

  // Debug: Log the current state
  useEffect(() => {
    console.log('[PerfilScreen] Estado atual:', {
      hasAluno: !!aluno,
      hasToken: !!userToken,
      aluno: aluno?.nr_estudante
    });
  }, [aluno, userToken]);

  // Get initials for avatar
  const getInitials = (name: string | undefined): string => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 ?
      (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() :
      parts[0][0].toUpperCase();
  };

  // Removido: A função 'handleLogout' inteira, incluindo o useCallback e o Alert.

  // CORREÇÃO: Removida a verificação condicional que causava problemas
  // Se não há aluno, o AuthProvider já deve redirecionar automaticamente

  console.log('[PerfilScreen] Renderizando perfil para:', aluno?.nr_estudante);

  return (
    <View style={styles.fullScreenContainer(isDarkMode)}>
      <ScrollView
        style={styles.scrollContentWrapper(isDarkMode)}
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: 30,
          paddingTop: 10,
          flexGrow: 1,
          paddingHorizontal: 10,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar e Informações Pessoais */}
        <View style={styles.profileCard(isDarkMode)}>
          <View style={styles.avatar(isDarkMode)}>
            <Text style={styles.avatarText(isDarkMode)}>
              {getInitials(aluno?.nome)}
            </Text>
          </View>
          <Text style={styles.nameText(isDarkMode)} numberOfLines={1}>
            {aluno?.nome || 'Utilizador'}
          </Text>
          <Text style={styles.studentNumberText(isDarkMode)} numberOfLines={1}>
            Nº de Estudante: {aluno?.nr_estudante || 'N/A'}
          </Text>
          <View style={styles.infoBlock(isDarkMode)}>
            <Text style={styles.infoTitle(isDarkMode)}>Informação de Contacto</Text>
            <Text style={styles.infoDetail(isDarkMode)}>
              Email: {aluno?.nr_estudante}@insutec.co.ao
            </Text>
            <Text style={styles.infoDetail(isDarkMode)}>
              Curso: Engenharia Informática
            </Text>
          </View>
        </View>

        {/* Toggle Modo Escuro */}
        <View style={styles.toggleContainer(isDarkMode)}>
          <View style={styles.toggleLabelContainer}>
            <Text style={styles.label(isDarkMode)}>Modo Escuro</Text>
            <Ionicons
              name={isDarkMode ? 'moon' : 'sunny'}
              size={16}
              color={isDarkMode ? COLORS.textLight : COLORS.textDark}
            />
          </View>
          <Switch
            onValueChange={toggleTheme}
            value={isDarkMode}
            trackColor={{ false: '#CCCCCC', true: COLORS.primary }}
            thumbColor={isDarkMode ? COLORS.accent : COLORS.white}
            ios_backgroundColor="#CCCCCC"
          />
        </View>

        {/* O espaço que continha o botão de Logout foi removido. */}

        {/* Status de Segurança */}
        <View style={styles.statusContainer(isDarkMode)}>
          <FontAwesome name="check-circle" size={16} color={COLORS.success} />
          <Text style={styles.statusText(isDarkMode)}>
            Sessão ativa e autenticada.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
