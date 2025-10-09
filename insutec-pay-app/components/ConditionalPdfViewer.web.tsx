import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

// Definir cores localmente para evitar dependências de terceiros
const COLORS = {
    primary: '#1a4a6d',
};

const ConditionalPdfViewerWeb: React.FC<any> = ({ style }) => (
    <View style={[styles.placeholderContainer, style]}>
        <Text style={styles.placeholderText}>
            Visualizador de PDF não disponível na Web.
            {"\n"}
            Use o aplicativo móvel ou a função de Compartilhar/Baixar.
        </Text>
    </View>
);

const styles = StyleSheet.create({
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        minHeight: height * 0.4,
        padding: 20,
        borderRadius: 10,
    },
    placeholderText: {
        fontSize: 16,
        color: COLORS.primary,
        textAlign: 'center',
        lineHeight: 22,
    },
});

export default ConditionalPdfViewerWeb;

