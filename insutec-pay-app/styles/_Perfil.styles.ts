import { StyleSheet, Platform } from 'react-native';

export const COLORS = {
  // Cores Primárias e Secundárias
  primary: '#0b5394', // Azul Principal (Cor da Marca/Ação)
  primaryDark: '#00CC00', // Verde (Usado para acentuação ou modo claro)
  secondary: '#00FFFF', // Ciano/Turquesa (Accent)
  accent: '#00FFFF',
  // Cores de Fundo
  lightBackground: '#f8f9fa', // Fundo no Modo Claro
  darkBackground: '#2E2E2E', // Fundo no Modo Escuro
  cardBackground: '#3A3A3A', // Cartões no Modo Escuro
  // Cores de Texto
  textDark: '#333', // Texto principal no modo claro
  textLight: '#fff', // Texto principal no modo escuro
  text: '#E0E0E0', // Texto Geral (Claro para Fundo Escuro)
  subText: '#AAAAAA', // Texto Secundário
  white: '#FFFFFF',
  gray: '#666666',
  // Cores de Status
  success: '#00FF00', // Verde Neon
  danger: '#FF3333', // Vermelho para botão de Logout
  error: '#FF3333', // Vermelho para mensagens de erro
  warning: '#FFCC00', // Amarelo
};

// ✅ CORREÇÃO CRÍTICA: Removidas todas as chamadas 'StyleSheet.create()' de dentro das funções
// Os estilos dinâmicos (funções que aceitam isDarkMode) devem retornar APENAS o objeto de estilo.
export const styles = {
    container: (isDarkMode: boolean) => ({
        flex: 1,
        padding: 10,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
        justifyContent: 'center',
        alignItems: 'center',
    }),
    profileCard: (isDarkMode: boolean) => ({
        backgroundColor: isDarkMode ? COLORS.cardBackground : COLORS.white,
        padding: 20,
        borderRadius: 20,
        width: '90%',
        // Mantida a margem para baixo
        marginTop: 60,
        alignItems: 'center',
        shadowColor: isDarkMode ? COLORS.darkBackground : '#6fa8dc',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 2,
        elevation: Platform.OS === 'android' ? 2 : 0,
    }),
    avatar: (isDarkMode: boolean) => ({
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: isDarkMode ? '#454545' : '#E8E8E8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 0,
        borderColor: isDarkMode ? COLORS.gray : '#CCCCCC',
    }),
    avatarText: (isDarkMode: boolean) => ({
        fontSize: 19,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        fontWeight: 'bold',
    }),
    nameText: (isDarkMode: boolean) => ({
        fontSize: 24,
        fontWeight: 'bold',
        color: isDarkMode ? COLORS.text : COLORS.textDark,
        marginBottom: 6,
    }),
    studentNumberText: (isDarkMode: boolean) => ({
        fontSize: 17,
        color: isDarkMode ? COLORS.subText : COLORS.gray,
        marginBottom: 18,
    }),
    infoBlock: (isDarkMode: boolean) => ({
        width: '100%',
        marginTop: 15,
        padding: 10,
        backgroundColor: isDarkMode ? COLORS.darkBackground : '#d2caca',
        borderRadius: 9,
    }),
    infoTitle: (isDarkMode: boolean) => ({
        fontSize: 19,
        fontWeight: '800',
        color: isDarkMode ? COLORS.primary : COLORS.primaryDark,
        marginBottom: 8,
    }),
    infoDetail: (isDarkMode: boolean) => ({
        fontSize: 16,
        color: isDarkMode ? COLORS.text : COLORS.textDark,
        marginBottom: 5,
    }),
    toggleContainer: (isDarkMode: boolean) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // Mantida a margem para baixo
        marginTop: 90,
        width: '100%',
        paddingHorizontal: 10,
    }),
    label: (isDarkMode: boolean) => ({
        fontSize: 16,
        fontWeight: '800',
        color: isDarkMode ? COLORS.text : COLORS.textDark,
    }),
    logoutButton: (isDarkMode: boolean) => ({
        backgroundColor: COLORS.danger,
        padding: 10,
        textAlign: 'center',
        borderRadius: 16,
        width: '60%',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: isDarkMode ? COLORS.danger : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 9,
        elevation: Platform.OS === 'android' ? 5 : 0,
    }),
    logoutButtonText: (isDarkMode: boolean) => ({
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '800',
        textAlign: 'center',
    }),
    errorText: (isDarkMode: boolean) => ({
        color: COLORS.error,
        fontSize: 19,
        textAlign: 'center',
    }),
    linkButton: (isDarkMode: boolean) => ({
        marginTop: 10,
    }),
    linkText: (isDarkMode: boolean) => ({
        color: COLORS.primary,
        fontSize: 16,
        textAlign: 'center',
    }),
    statusContainer: (isDarkMode: boolean) => ({
        // Mantida a margem para baixo
        marginTop: 60,
        flexDirection: 'row',
        alignItems: 'center',
    }),
    statusText: (isDarkMode: boolean) => ({
        color: isDarkMode ? COLORS.subText : COLORS.gray,
        marginLeft: 15,
        fontSize: 14,
        fontWeight: '800',
    }),
};
