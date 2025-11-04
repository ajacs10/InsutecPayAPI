// app/telas/perfil/PerfilScreen.tsx
import React, { useEffect } from 'react';
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
  const { aluno } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    console.log('[PerfilScreen] Usuário:', aluno);
  }, [aluno]);

  const getInitials = (name: string | undefined): string => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  };

  if (!aluno) {
    return (
      <View style={styles.fullScreenContainer({ isDarkMode })}>
        <Text style={{ color: COLORS.error, textAlign: 'center', marginTop: 50 }}>
          Erro: Usuário não autenticado.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.fullScreenContainer({ isDarkMode })}>
      <ScrollView
        style={styles.scrollContainer({ isDarkMode })}
        contentContainerStyle={styles.scrollContentWrapper({ isDarkMode })}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar e Informações */}
        <View style={styles.profileCard({ isDarkMode })}>
          <View style={styles.avatar({ isDarkMode })}>
            <Text style={styles.avatarText({ isDarkMode })}>
              {getInitials(aluno.nome_completo || aluno.nome)}
            </Text>
          </View>

          <Text style={styles.nameText({ isDarkMode })} numberOfLines={1}>
            {aluno.nome_completo || aluno.nome || 'Utilizador'}
          </Text>

          <Text style={styles.studentNumberText({ isDarkMode })} numberOfLines={1}>
            Nº de Estudante: {aluno.nr_estudante || 'N/A'}
          </Text>

          <View style={styles.infoBlock({ isDarkMode })}>
            <Text style={styles.infoTitle({ isDarkMode })}>Informação de Contacto</Text>
            <Text style={styles.infoDetail({ isDarkMode })}>
              Email: {aluno.email || `${aluno.nr_estudante}@insutec.co.ao`}
            </Text>
            <Text style={styles.infoDetail({ isDarkMode })}>
              Curso: {aluno.curso || 'Não informado'}
            </Text>
          </View>
        </View>

        {/* Modo Escuro */}
        <View style={styles.toggleContainer({ isDarkMode })}>
          <View style={styles.toggleLabelContainer}>
            <Text style={styles.label({ isDarkMode })}>Modo Escuro</Text>
            <Ionicons
              name={isDarkMode ? 'moon' : 'sunny'}
              size={18}
              color={isDarkMode ? COLORS.accent : COLORS.primary}
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

        {/* Status */}
        <View style={styles.statusContainer({ isDarkMode })}>
          <FontAwesome name="check-circle" size={18} color={COLORS.success} />
          <Text style={styles.statusText({ isDarkMode })}>
            Sessão ativa e autenticada.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
