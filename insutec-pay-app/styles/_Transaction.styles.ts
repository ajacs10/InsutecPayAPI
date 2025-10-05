import { StyleSheet } from 'react-native';

const primaryColor = '#007bff'; // Azul Insutec
const successColor = '#28a745'; // Verde para sucesso
const errorColor = '#dc3545'; // Vermelho para erro
const warningColor = '#ffc107'; // Amarelo para pendente
const darkGray = '#343a40';
const lightBackground = '#f8f9fa';

export const COLORS = {
    primary: primaryColor,
    success: successColor,
    error: errorColor,
    warning: warningColor,
    dark: darkGray,
    background: lightBackground,
    white: '#fff',
    cardShadow: '#000',
    // 💡 Adicionado 'danger' para compatibilidade com TransactionScreen.tsx
    danger: errorColor, 
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: 20,
        textAlign: 'center',
    },
    
    // --- Cartão de Detalhes da Dívida ---
    detailCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        elevation: 5,
        shadowColor: COLORS.cardShadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f1',
    },
    detailLabel: {
        fontSize: 15,
        color: COLORS.dark,
    },
    detailValue: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.dark,
    },
    totalRow: {
        marginTop: 10,
        borderTopWidth: 2,
        borderTopColor: COLORS.primary,
        paddingTop: 10,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.dark,
    },
    totalValue: {
        fontSize: 22,
        fontWeight: 'bold',
        // Corrigido para PRIMARY (Azul), pois é o valor a pagar, não um erro.
        color: COLORS.primary, 
    },

    // --- Secção de Transação e Status ---
    transactionSection: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    statusText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center',
    },
    
    // --- Botões ---
    button: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
        width: '100%',
    },
    buttonPrimary: {
        backgroundColor: COLORS.primary,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonSimulate: {
        backgroundColor: COLORS.warning,
        marginTop: 10,
    },
    buttonSimulateText: {
        color: COLORS.dark,
        fontSize: 14,
        fontWeight: '600',
    },
    
    // --- QR Code ---
    qrCodeContainer: {
        alignItems: 'center',
        marginVertical: 20,
        padding: 10,
        backgroundColor: COLORS.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    qrCodeLabel: {
        marginTop: 15,
        fontSize: 14,
        color: COLORS.dark,
    },
    qrCodeValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginTop: 5,
    },
    // --- Estados de Feedback ---
    successBox: {
        backgroundColor: '#e6ffed', // Fundo verde claro
        padding: 20,
        borderRadius: 10,
        borderLeftWidth: 5,
        borderLeftColor: COLORS.success,
        alignItems: 'center',
    },
    errorBox: {
        backgroundColor: '#ffeded', // Fundo vermelho claro
        padding: 20,
        borderRadius: 10,
        borderLeftWidth: 5,
        borderLeftColor: COLORS.error,
        alignItems: 'center',
    },
    feedbackTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginTop: 10,
    },
    feedbackMessage: {
        fontSize: 14,
        color: COLORS.dark,
        textAlign: 'center',
        marginTop: 5,
    },
    
    // --- Outros ---
    loadingText: {
        marginTop: 10,
        color: COLORS.dark,
    }
});

