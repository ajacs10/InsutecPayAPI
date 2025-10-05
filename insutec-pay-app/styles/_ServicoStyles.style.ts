// /caminho/para/styles/_ServicoStyles.style.ts

// Não precisamos do StyleSheet.create se todos os estilos forem funções.
// import { StyleSheet } from 'react-native'; 

export const COLORS = {
    primary: '#00FF00', // Neon green
    primaryDark: '#00CC00', // Darker neon green
    accent: '#00FFFF', // Neon cyan
    backgroundLight: '#2E2E2E', // Cinza escuro suave (usado para dark mode)
    backgroundDark: '#121212',  // Fundo ainda mais escuro, se necessário
    backgroundCard: '#3A3A3A', // Cinza mais claro para seções/cards
    white: '#FFFFFF',
    gray: '#666666',
    error: '#FF3333', // Neon red for errors
    textLight: '#E0E0E0', // Light gray for text (usado para dark mode)
    textDark: '#333333', // Dark text (usado para light mode)
    selected: '#00FF99', // Lighter neon green for selected items
    info: '#00B7EB', // Neon blue for info
};

// Refatoramos 'styles' para ser um objeto de funções, aceitando 'isDark'
export const styles = {
    container: (isDark: boolean) => ({
        flex: 1,
        padding: 20,
        // Usamos backgroundLight como o seu fundo principal escuro
        backgroundColor: COLORS.backgroundLight, 
    }),
    
    sectionContainer: (isDark: boolean) => ({
        marginBottom: 20,
        padding: 10,
        borderRadius: 8,
        backgroundColor: COLORS.backgroundCard, // Cor de fundo da seção
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
    }),
    
    sectionTitle: (isDark: boolean) => ({
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 10,
    }),
    
    priceText: (isDark: boolean) => ({
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textLight, // Usamos textLight para dark mode
        marginBottom: 20,
        textAlign: 'center',
    }),
    
    inputContainer: (isDark: boolean) => ({
        marginBottom: 20,
    }),
    
    label: (isDark: boolean) => ({
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textLight,
        marginBottom: 8,
    }),
    
    input: (isDark: boolean) => ({
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#454545', 
        color: COLORS.textLight,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
    }),
    
    picker: (isDark: boolean) => ({
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        backgroundColor: '#454545',
        overflow: 'hidden',
    }),
    
    quantityContainer: (isDark: boolean) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    }),
    
    quantityButton: (isDark: boolean) => ({
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 8,
        width: 40,
        alignItems: 'center',
        marginHorizontal: 10,
    }),
    
    quantityButtonText: (isDark: boolean) => ({
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    }),
    
    quantityText: (isDark: boolean) => ({
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textLight,
        width: 40,
        textAlign: 'center',
    }),
    
    monthList: {
        justifyContent: 'space-between',
    },
    
    monthButton: (isDark: boolean) => ({
        flex: 1,
        padding: 12,
        margin: 5,
        borderRadius: 8,
        backgroundColor: '#454545',
        borderWidth: 1,
        borderColor: COLORS.gray,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
    }),
    
    monthButtonSelected: (isDark: boolean) => ({
        backgroundColor: COLORS.selected,
        borderColor: COLORS.primary,
    }),
    
    monthButtonText: (isDark: boolean) => ({
        fontSize: 14,
        color: COLORS.textLight,
        fontWeight: '500',
    }),
    
    monthButtonTextSelected: (isDark: boolean) => ({
        color: COLORS.white,
        fontWeight: '600',
    }),
    
    totalText: (isDark: boolean) => ({
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center',
    }),
    
    error: (isDark: boolean) => ({
        color: COLORS.error,
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    }),
    
    infoText: (isDark: boolean) => ({
        color: COLORS.info,
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    }),
    
    payButton: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    
    payButtonDisabled: {
        backgroundColor: COLORS.gray,
        opacity: 0.6,
    },
    
    payButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
};
