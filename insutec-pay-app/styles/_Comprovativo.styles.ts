// styles/_Comprovativo.styles.ts

import { StyleSheet, Platform } from 'react-native';

// Definição de Cores (Ajuste conforme o seu tema global)
const COLORS = {
    primary: '#39FF14',
    success: '#00C853',
    white: '#FFFFFF',
    dark: '#000000',
    darkBackground: '#0F0F0F',
    lightBackground: '#F0F2F5',
    cardDark: '#1F1F1F',
    cardLight: '#FFFFFF',
    textDark: '#1C1C1C',
    textLight: '#E0E0E0',
    subText: '#888888',
};

// Estilos criados
export const styles = StyleSheet.create({
    // Estilos para o componente principal (ComprovativoScreen)
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.lightBackground, // Use a cor de fundo apropriada
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.lightBackground,
    },
    errorText: {
        marginTop: 10,
        color: 'red',
        fontSize: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: COLORS.dark,
        textAlign: 'center',
    },
    title: {
        fontSize: 18,
        color: COLORS.subText,
        marginBottom: 20,
        textAlign: 'center',
    },
    
    // Estilos para os detalhes da transação
    detailCard: {
        backgroundColor: COLORS.cardLight,
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
        ...Platform.select({ ios: { shadowOpacity: 0.1, shadowRadius: 5, shadowColor: COLORS.dark, shadowOffset: { width: 0, height: 2 } }, android: { elevation: 4 } }),
    },
    label: {
        fontSize: 14,
        color: COLORS.subText,
    },
    valuePaid: {
        fontSize: 30,
        fontWeight: 'bold',
        color: COLORS.primary, // Cor de destaque/sucesso
        marginTop: 5,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(136, 136, 136, 0.1)',
    },
    detailLabel: {
        fontSize: 16,
        color: COLORS.textDark,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textDark,
        textAlign: 'right',
    },
    // Adicione mais estilos necessários aqui, como para os botões se houver
});

// Nota: Adapte as cores para o modo escuro no seu tema. Por agora, estamos a usar apenas cores claras/neutras neste ficheiro.
