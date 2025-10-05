import { StyleSheet } from 'react-native';

const primaryColor = '#007bff'; // Azul Insutec
const accentColor = '#ffc107'; // Amarelo/Destaque
const errorColor = '#dc3545'; // Vermelho para Dívida
const darkText = '#343a40';
const lightBackground = '#f8f9fa';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: lightBackground,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: darkText,
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    
    // --- Card de Dívida ---
    debtCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginHorizontal: 15,
        marginTop: 15,
        padding: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        borderLeftWidth: 5,
        borderLeftColor: errorColor,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: darkText,
        flexShrink: 1,
    },
    dueDate: {
        fontSize: 13,
        color: '#6c757d',
    },
    
    // --- Detalhes dos Valores ---
    valueRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    valueLabel: {
        fontSize: 14,
        color: darkText,
    },
    valueAmount: {
        fontSize: 14,
        fontWeight: '500',
        color: darkText,
    },
    
    // --- Total e Ação ---
    totalContainer: {
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        paddingTop: 10,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: errorColor,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: errorColor,
    },
    
    // --- Botão de Ação ---
    payButton: {
        backgroundColor: primaryColor,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    payButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },

    // --- Estados de Feedback ---
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        minHeight: 200,
    },
    emptyText: {
        fontSize: 18,
        color: '#6c757d',
        textAlign: 'center',
        marginTop: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: errorColor,
        textAlign: 'center',
        marginTop: 10,
    }
});

