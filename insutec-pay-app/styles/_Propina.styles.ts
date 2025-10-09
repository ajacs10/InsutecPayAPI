// app/styles/_Propina.styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Cores base que serão adaptadas ao tema
export const COLORS = {
    primary: '#1a4a6d',
    white: '#fff',
    textDark: '#333',
    darkBackground: '#1c1c1c',
    lightBackground: '#f5f5f5',
    success: '#2ecc71',
    warning: '#f39c12',
    danger: '#e74c3c',
    disabled: '#95a5a6',
    darkCard: '#2a2a2a',
    darkBorder: '#555',
    lightBorder: '#ccc',
    lightGray: '#e0e0e0',
    darkGray: '#3a3a3a',
    successDark: '#1a3a2a',
    successBorderDark: '#2a4a3a',
    successLight: '#d4edda',
    successBorderLight: '#c3e6cb',
    infoDark: '#1e3a5f',
    infoBorderDark: '#2a4a7a',
    infoLight: '#e6f7ff',
    infoBorderLight: '#a0d9ff'
};

// Estilos base que serão adaptados ao tema
export const createPropinaStyles = (isDarkMode: boolean) => {
    return StyleSheet.create({
        // Container principal
        container: {
            flexGrow: 1,
            padding: 9,
            backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground
        },

        // Header
        header: {
       
            fontSize: 24,
            paddingTop: 26,
            fontWeight: 'bold',
            color: isDarkMode ? COLORS.white : COLORS.primary,
            marginBottom: 24,
            textAlign: 'center',
            padding: 17,
             marginBottom: 3,
        },

        // Seções
        section: {
            marginBottom: 15,
            padding: 10,
            backgroundColor: isDarkMode ? COLORS.darkCard : COLORS.white,
            borderRadius: 20,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
        },

        sectionTitle: {
            fontSize: 19,
            fontWeight: '800',
            color: isDarkMode ? COLORS.white : COLORS.textDark,
            marginBottom: 15
        },

        // Seletores
        selectorContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: 15
        },

        pill: {

            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 20,
            marginRight: 8,
            marginBottom: 8,
        },

        pillSelected: {
            backgroundColor: COLORS.primary
        },

        pillUnselected: {
            backgroundColor: isDarkMode ? COLORS.darkGray : COLORS.lightGray
        },

        pillText: {
            fontWeight: 'bold',
            fontSize: 14
        },

        pillTextSelected: {
            color: COLORS.white
        },

        pillTextUnselected: {
            color: isDarkMode ? COLORS.white : COLORS.textDark
        },

        // Container dos meses
        monthsContainer: {
            marginBottom: 10,
        },

        // Grid de meses
        monthsGrid: {
            justifyContent: 'space-between',
        },

        // Itens de mês
        monthItem: {
            width: (width - 64) / 3, 
            margin: 4,
            padding: 14,
            borderRadius: 9,
            alignItems: 'center',
            borderWidth: 1,
            minHeight: 80,
            justifyContent: 'center',
        },

        monthItemSelected: {
            backgroundColor: COLORS.primary,
            borderColor: COLORS.primary
        },

        monthItemSelectedWithFine: {
            backgroundColor: COLORS.warning,
            borderColor: COLORS.warning
        },

        monthItemSelectedFuture: {
            backgroundColor: COLORS.success,
            borderColor: COLORS.success
        },

        monthItemUnselected: {
            backgroundColor: isDarkMode ? COLORS.darkGray : '#f8f9fa',
            borderColor: isDarkMode ? COLORS.darkBorder : COLORS.lightBorder
        },

        monthItemPaid: {
            backgroundColor: COLORS.disabled,
            borderColor: COLORS.disabled,
            opacity: 0.8
        },

        monthText: {
            fontWeight: '800',
            textAlign: 'center',
            fontSize: 12,
        },

        monthTextSelected: {
            color: COLORS.white
        },

        monthTextUnselected: {
            color: isDarkMode ? COLORS.white : COLORS.textDark
        },

        monthTextPaid: {
            color: COLORS.white
        },

        monthPrice: {
            fontSize: 13,
            marginTop: 5,
            textAlign: 'center',
        },

        monthPriceSelected: {
            color: COLORS.white
        },

        monthPriceUnselected: {
            color: isDarkMode ? '#ccc' : '#666'
        },

        // Textos de status
        fineText: {
            fontSize: 10,
            color: COLORS.danger,
            fontWeight: 'bold',
            marginTop: 4,
            textAlign: 'center'
        },

        futureText: {
            fontSize: 12,
            color: COLORS.success,
            fontWeight: 'bold',
            marginTop: 2,
            textAlign: 'center'
        },

        paidText: {
            fontSize: 12,
            color: COLORS.white,
            fontWeight: 'bold',
            marginTop: 6,
            backgroundColor: COLORS.disabled,
            paddingHorizontal: 7,
            paddingVertical: 3,
            borderRadius: 10,
            textAlign: 'center'
        },

        // Cartão de resumo
        summaryCard: {
            padding: 12,
            backgroundColor: isDarkMode ? COLORS.infoDark : COLORS.infoLight,
            borderRadius: 17,
            borderWidth: 2,
            borderColor: isDarkMode ? COLORS.infoBorderDark : COLORS.infoBorderLight,
            marginTop: 11
        },

        summaryRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 9,
            alignItems: 'center'
        },

        summaryText: {
            color: isDarkMode ? COLORS.white : COLORS.textDark,
            fontSize: 15
        },

        totalLabel: {
            fontSize: 15,
            fontWeight: 'bold',
            color: isDarkMode ? COLORS.white : COLORS.primary,
            marginTop: 4
        },

        totalAmount: {
            fontSize: 20,
            fontWeight: 'bold',
            color: isDarkMode ? COLORS.white : COLORS.primary
        },

        // Botão de pagamento
        payButton: {
            backgroundColor: COLORS.primary,
            padding: 15,
    
            borderRadius: 17,
            marginTop: 13,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 15,
        },

        payButtonDisabled: {
            backgroundColor: '#a0a8b3'
        },

        payButtonText: {
            color: COLORS.white,
            fontSize: 15,
            fontWeight: 'bold'
        },

        // Textos informativos
        infoText: {
            fontSize: 10,
            color: isDarkMode ? '#aaa' : '#666',
            marginTop: 5,
            fontStyle: 'italic',
            lineHeight: 14
        },

        normalText: {
            color: isDarkMode ? COLORS.white : COLORS.textDark,
            fontSize: 13,
            lineHeight: 20
        },

        // Mensagens
        successMessage: {
            backgroundColor: isDarkMode ? COLORS.successDark : COLORS.successLight,
            padding: 9,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: isDarkMode ? COLORS.successBorderDark : COLORS.successBorderLight,
            marginTop: 10
        },

        successText: {
            color: isDarkMode ? '#90ee90' : '#155724',
            fontSize: 15,
            textAlign: 'center'
        },

        warningMessage: {
            backgroundColor: '#fff3cd',
            padding: 10,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: '#ffeaa7',
            marginTop: 10
        },

        warningText: {
            color: '#856404',
            fontSize: 15,
            textAlign: 'center'
        },

        // Loading
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
            padding: 18
        },

        loadingText: {
            marginTop: 12,
            color: isDarkMode ? COLORS.white : COLORS.textDark,
            fontSize: 16
        },

        // Legenda
        legendContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginTop: 12,
            gap: 26
        },

        legendItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 15
        },

        legendColor: {
            width: 12,
            height: 12,
            borderRadius: 10,
            marginRight: 6
        },

        legendText: {
            fontSize: 12,
            color: isDarkMode ? '#ccc' : '#666'
        }
    });
};

// Estilos compartilhados para outros componentes financeiros
export const sharedFinanceStyles = (isDarkMode: boolean) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground
        },
        safeArea: {
            flex: 1,
            backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground
        },
        scrollView: {
            flexGrow: 1
        },
        card: {
            backgroundColor: isDarkMode ? COLORS.darkCard : COLORS.white,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        cardTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: isDarkMode ? COLORS.white : COLORS.textDark,
            marginBottom: 8
        },
        cardValue: {
            fontSize: 18,
            fontWeight: 'bold',
            color: isDarkMode ? COLORS.white : COLORS.primary
        }
    });
};

// Helper functions
export const getMonthItemStyle = (
    styles: any, 
    isSelected: boolean, 
    hasFine: boolean, 
    isFuture: boolean, 
    isPaid: boolean
) => {
    if (isPaid) return [styles.monthItem, styles.monthItemPaid];
    if (!isSelected) return [styles.monthItem, styles.monthItemUnselected];
    if (hasFine) return [styles.monthItem, styles.monthItemSelectedWithFine];
    if (isFuture) return [styles.monthItem, styles.monthItemSelectedFuture];
    return [styles.monthItem, styles.monthItemSelected];
};

export const getMonthTextStyle = (styles: any, isSelected: boolean, isPaid: boolean) => {
    if (isPaid) return [styles.monthText, styles.monthTextPaid];
    if (isSelected) return [styles.monthText, styles.monthTextSelected];
    return [styles.monthText, styles.monthTextUnselected];
};

export const getMonthPriceStyle = (styles: any, isSelected: boolean, isPaid: boolean) => {
    if (isPaid) return [styles.monthPrice, styles.monthPriceSelected];
    if (isSelected) return [styles.monthPrice, styles.monthPriceSelected];
    return [styles.monthPrice, styles.monthPriceUnselected];
};

export const getPillStyle = (styles: any, isSelected: boolean) => {
    return [
        styles.pill,
        isSelected ? styles.pillSelected : styles.pillUnselected
    ];
};

export const getPillTextStyle = (styles: any, isSelected: boolean) => {
    return [
        styles.pillText,
        isSelected ? styles.pillTextSelected : styles.pillTextUnselected
    ];
};
