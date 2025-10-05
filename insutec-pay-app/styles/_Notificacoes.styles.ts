// styles/_Notificacoes.styles.ts

import { StyleSheet } from 'react-native';

export const COLORS = {
    primary: '#007bff', 
    success: '#28a745', 
    warning: '#ffc107', 
    error: '#dc3545', 
    dark: '#212529',
    subText: '#6c757d',
    background: '#f8f9fa',
    white: '#ffffff',
    lightGray: '#e9ecef',
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.dark,
        padding: 15,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    badgeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.error,
        marginLeft: 5,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 50,
    },
    emptyText: {
        color: COLORS.subText,
        fontSize: 16,
        marginTop: 15,
        textAlign: 'center',
    },
    
    // --- Itens de Notificação ---
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 10,
        marginBottom: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        borderLeftWidth: 5,
        borderLeftColor: COLORS.lightGray,
    },
    itemUnread: {
        backgroundColor: COLORS.lightGray, // Fundo mais claro para não lidas
        borderLeftColor: COLORS.primary, // Destaque na borda esquerda
    },
    itemIcon: {
        width: 30,
        marginRight: 10,
    },
    itemContent: {
        flex: 1,
        marginRight: 10,
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.dark,
    },
    itemMessage: {
        fontSize: 13,
        color: COLORS.subText,
        marginTop: 3,
    },
    itemDate: {
        fontSize: 10,
        color: COLORS.subText,
        marginTop: 5,
    },

    // --- Botões de Ação ---
    itemActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderRadius: 5,
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
    },
    itemActionButtonText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    itemMarkReadButton: {
        padding: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.success,
    }
});
