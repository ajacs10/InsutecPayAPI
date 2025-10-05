import { StyleSheet, Platform } from 'react-native';

// Paleta de cores local (ajustada para o tema neon)
// 💥 CORREÇÃO AQUI: 'export' adicionado para que PerfilScreen possa aceder a COLORS
export const COLORS = { 
  primary: '#00FF00', // Neon green
  lightBackground: '#f8f9fa',
  darkBackground: '#2E2E2E',
  textDark: '#333',
  textLight: '#fff',
  primaryDark: '#00CC00',
  accent: '#00FFFF',
  cardBackground: '#3A3A3A',
  success: '#00FF00',
  danger: '#FF3333',
  warning: '#FFCC00',
  secondary: '#00FFFF',
  text: '#E0E0E0',
  subText: '#AAAAAA',
  white: '#FFFFFF',
  gray: '#666666',
  error: '#FF3333',
};

export const styles = StyleSheet.create({
  container: (isDarkMode: boolean) => ({
    flex: 1,
    padding: 20,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  profileCard: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? COLORS.cardBackground : '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: Platform.OS === 'android' ? 2 : 0,
  }),
  avatar: (isDarkMode: boolean) => ({
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: isDarkMode ? '#454545' : '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: isDarkMode ? COLORS.gray : '#CCCCCC',
  }),
  avatarText: (isDarkMode: boolean) => ({
    // Corrigido para usar cores que se destaquem no avatar, baseado na paleta
    fontSize: 32,
    color: isDarkMode ? COLORS.white : COLORS.textDark, 
    fontWeight: 'bold',
  }),
  nameText: (isDarkMode: boolean) => ({
    fontSize: 24,
    fontWeight: 'bold',
    // Corrigido para usar cores de texto apropriadas para fundo claro/escuro
    color: isDarkMode ? COLORS.text : COLORS.textDark, 
    marginBottom: 5,
  }),
  studentNumberText: (isDarkMode: boolean) => ({
    fontSize: 16,
    // Corrigido para usar cores de subtexto
    color: isDarkMode ? COLORS.subText : COLORS.gray, 
    marginBottom: 15,
  }),
  infoBlock: (isDarkMode: boolean) => ({
    width: '100%',
    marginTop: 15,
    padding: 10,
    // Usa darkBackground em vez de um código rígido
    backgroundColor: isDarkMode ? COLORS.darkBackground : '#F0F0F0', 
    borderRadius: 8,
  }),
  infoTitle: (isDarkMode: boolean) => ({
    fontSize: 18,
    fontWeight: '600',
    color: isDarkMode ? COLORS.primary : COLORS.primaryDark,
    marginBottom: 10,
  }),
  infoDetail: (isDarkMode: boolean) => ({
    fontSize: 14,
    // Corrigido: usa cores definidas
    color: isDarkMode ? COLORS.text : COLORS.textDark, 
    marginBottom: 5,
  }),
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '90%',
  },
  label: (isDarkMode: boolean) => ({
    fontSize: 16,
    fontWeight: '600',
    // Corrigido: usa cores definidas
    color: isDarkMode ? COLORS.text : COLORS.textDark, 
  }),
  logoutButton: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? COLORS.danger : '#FF6666',
    padding: 12,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: Platform.OS === 'android' ? 2 : 0,
  }),
  logoutButtonText: (isDarkMode: boolean) => ({
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  }),
  errorText: (isDarkMode: boolean) => ({
    color: COLORS.error,
    fontSize: 18,
    textAlign: 'center',
  }),
  linkButton: {
    marginTop: 20,
  },
  linkText: (isDarkMode: boolean) => ({
    color: COLORS.primary,
    fontSize: 16,
    textAlign: 'center',
  }),
  statusContainer: (isDarkMode: boolean) => ({
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  }),
  statusText: (isDarkMode: boolean) => ({
    // Corrigido: usa cores definidas
    color: isDarkMode ? COLORS.subText : COLORS.gray, 
    marginLeft: 8,
    fontSize: 14,
  }),
});
