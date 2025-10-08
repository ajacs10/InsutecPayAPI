// /insutec-pay-app/styles/_FolhaDeProvaScreen.styles.ts
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
// Assumindo que COLORS está neste caminho:
import { COLORS } from './_ServicoStyles.style.ts'; 

type StyleCreator = (isDarkMode: boolean) => StyleSheet.NamedStyles<any>;

// =========================================================================
// ESTILOS DE PAGAMENTO (Tela FolhadeProva.tsx)
// =========================================================================

export const paymentStyles: StyleCreator = (isDarkMode) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
        paddingTop: 50,
    } as ViewStyle,
    headerText: {
        fontSize: 24,
        fontWeight: '900',
        textAlign: 'center',
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        marginBottom: 10,
    } as TextStyle,
    subHeaderText: {
        fontSize: 16,
        textAlign: 'center',
        color: isDarkMode ? COLORS.subText : COLORS.gray,
        marginBottom: 30,
    } as TextStyle,
    itemCard: {
        backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.white,
        borderRadius: 12,
        marginHorizontal: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 5,
    } as ViewStyle,
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    } as ViewStyle,
    itemDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    } as ViewStyle,
    itemIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: '#E6EEFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#D0D0FF'
    } as ViewStyle,
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    } as TextStyle,
    itemPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    } as TextStyle,
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginRight: 10,
    } as ViewStyle,
    quantityButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDarkMode ? COLORS.cardDark : '#f0f0f0', 
        borderWidth: 1,
        borderColor: isDarkMode ? COLORS.gray : '#E0E0E0',
    } as ViewStyle,
    quantityDisplay: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    } as ViewStyle,
    quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    } as TextStyle,
    fixedFooter: {
        padding: 20,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
        borderTopWidth: 1,
        borderTopColor: isDarkMode ? COLORS.gray : '#E0E0E0',
    } as ViewStyle,
    finalizarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
    } as ViewStyle,
    finalizarButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    } as TextStyle,
});

export const successStyles: StyleCreator = (isDarkMode) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDarkMode ? '#1e1e1e' : '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    } as ViewStyle,
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E6EEFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 2,
        borderColor: COLORS.primary,
    } as ViewStyle,
    successText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        marginBottom: 10,
    } as TextStyle,
    thankYouText: {
        fontSize: 16,
        color: COLORS.primary,
        marginBottom: 30,
    } as TextStyle,
    retrievalText: {
        fontSize: 16,
        textAlign: 'center',
        color: isDarkMode ? COLORS.subText : COLORS.gray,
        lineHeight: 24,
        marginBottom: 40,
    } as TextStyle,
    backButton: {
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
    } as ViewStyle,
    backButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    } as TextStyle,
});
