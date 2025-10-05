import React from 'react';
import { View, Text, TouchableOpacity, Alert, Switch } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
// 🛑 Assumindo que useAuth tem signOut renomeado para logout
import { useAuth } from '../../../components/AuthContext'; 
import { useTheme } from '../ThemeContext/ThemeContext';
// 🛑 Assumindo que _Perfil.styles.ts exporta styles e COLORS
import { styles, COLORS } from '../../../styles/_Perfil.styles.ts'; 

export default function PerfilScreen() {
    // ✅ O uso de useTheme aqui garante a mudança global do tema
    const { aluno, signOut: logout } = useAuth(); // Usando signOut, renomeando para logout
    const { isDarkMode, toggleTheme } = useTheme(); 

    // Função auxiliar para obter as iniciais do nome para o Avatar
    const getInitials = (name: string | undefined): string => {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    };

    /**
     * Confirmação e execução do Logout.
     */
    const handleLogout = () => {
        Alert.alert(
            "Terminar Sessão",
            "Tem certeza que deseja sair da sua conta?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Sair", 
                    onPress: () => {
                        logout();
                        // ✅ CORREÇÃO: Usar a rota completa para o ecrã de Login
                        router.replace('/telas/login/LoginScreen'); 
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    if (!aluno) {
        return (
            <View style={styles.container(isDarkMode)}>
                <Text style={styles.errorText(isDarkMode)}>Erro: Dados do aluno não carregados.</Text>
                <TouchableOpacity onPress={() => router.replace('/telas/login/LoginScreen')} style={styles.linkButton}>
                    <Text style={styles.linkText(isDarkMode)}>Ir para Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container(isDarkMode)}>
            <View style={styles.profileCard(isDarkMode)}>
                <View style={styles.avatar(isDarkMode)}>
                    <Text style={styles.avatarText(isDarkMode)}>
                        {getInitials(aluno.nome)}
                    </Text>
                </View>
                <Text style={styles.nameText(isDarkMode)}>{aluno.nome}</Text>
                <Text style={styles.studentNumberText(isDarkMode)}>Nº de Estudante: {aluno.nr_estudante}</Text>
                <View style={styles.infoBlock(isDarkMode)}>
                    <Text style={styles.infoTitle(isDarkMode)}>Informação de Contacto</Text>
                    <Text style={styles.infoDetail(isDarkMode)}>Email: {aluno.nr_estudante}@insutec.co.ao</Text>
                    <Text style={styles.infoDetail(isDarkMode)}>Curso: Engenharia Informática</Text>
                </View>
            </View>
            <View style={styles.toggleContainer}>
                <Text style={styles.label(isDarkMode)}>Modo Escuro</Text>
                <Switch
                    onValueChange={toggleTheme} // ✅ Esta função garante a mudança global
                    value={isDarkMode}
                    trackColor={{ false: '#CCCCCC', true: '#00CC00' }}
                    thumbColor={isDarkMode ? '#00FF00' : '#FFFFFF'}
                />
            </View>
            <TouchableOpacity 
                style={styles.logoutButton(isDarkMode)}
                onPress={handleLogout}
            >
                <Text style={styles.logoutButtonText(isDarkMode)}>
                    Terminar Sessão (Logout)
                </Text>
            </TouchableOpacity>
            <View style={styles.statusContainer(isDarkMode)}>
                <FontAwesome name="check-circle" size={16} color={COLORS.primary} /> {/* Using restored COLORS.primary */}
                <Text style={styles.statusText(isDarkMode)}>
                    Sessão segura e autenticada.
                </Text>
            </View>
        </View>
    );
}
