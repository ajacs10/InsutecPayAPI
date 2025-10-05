import { StyleSheet } from 'react-native';

const primaryColor = '#007bff'; // Azul Insutec
const darkGray = '#333';
const lightGray = '#f8f9fa';
const errorColor = '#dc3545';

export const COLORS = {
    primary: primaryColor,
    dark: darkGray,
    white: '#fff',
    lightGray: lightGray,
    error: errorColor,
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 20,
    },
    header: {
        marginTop: 40,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: darkGray,
        opacity: 0.7,
    },
    input: {
        height: 50,
        backgroundColor: lightGray,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: darkGray,
    },
    registerButton: {
        backgroundColor: primaryColor,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginLink: {
        marginTop: 20,
        alignItems: 'center',
    },
    loginText: {
        fontSize: 14,
        color: darkGray,
    },
    loginLinkText: {
        color: primaryColor,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    errorText: {
        color: errorColor,
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 14,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    }
});

