// styles/_Recuperacao.styles.ts (COMPLETO E ATUALIZADO)

import { StyleSheet } from 'react-native';

export const COLORS = {
    primary: '#007bff', 
    primaryDark: '#0056b3', // Adicionado para contraste
    dark: '#212529',
    subText: '#6c757d',
    background: '#f8f9fa',
    white: '#ffffff',
    borderColor: '#ced4da',
    danger: '#dc3545',
    success: '#28a745', // Adicionado para mensagens de sucesso
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    backButton: {
        padding: 15,
        position: 'absolute',
        top: 40,
        left: 0,
        zIndex: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.subText,
        textAlign: 'center',
        marginBottom: 30,
    },
    // Estilo base do campo de input (Usado no Passo 1 e Passo 3)
    input: {
        width: '100%',
        height: 50,
        backgroundColor: COLORS.background,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        fontSize: 16,
        color: COLORS.dark,
    },
    // Estilo de input específico para o Código OTP (Passo 2)
    otpInput: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 10,
        width: '80%', // Mais compacto para focar no código
        height: 60,
        marginBottom: 10,
        borderColor: COLORS.primaryDark,
    },
    // Estilos do Contador (Timer) no Passo 2
    timerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 30,
        paddingHorizontal: 15,
    },
    timerText: {
        fontSize: 14,
        color: COLORS.subText,
    },
    resendButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    resendButtonText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
    // Estilo base do botão de ação
    button: {
        width: '100%',
        height: 50,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: 10,
    },
    linkButtonText: {
        color: COLORS.primary,
        fontSize: 14,
    },
    // Estilos para mensagens de validação (Passo 3)
    successMessage: {
        fontSize: 16,
        color: COLORS.success,
        textAlign: 'center',
        marginBottom: 20,
    }
});
