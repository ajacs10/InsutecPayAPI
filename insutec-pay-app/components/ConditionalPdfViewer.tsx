// components/ConditionalPdfViewer.tsx (Para iOS e Android)

import React from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet, Dimensions } from 'react-native';
// A importação só ocorre aqui, no arquivo que o Metro usa para o bundle nativo.
import Pdf from 'react-native-pdf'; 

const { height } = Dimensions.get('window');

const COLORS = {
    primary: '#1a4a6d',
};

// Defina um tipo básico para as props do PDF
interface PdfViewerProps {
    source: any;
    style: any;
}

const ConditionalPdfViewer: React.FC<PdfViewerProps> = (props) => {
    
    if (!props.source || !Pdf) {
        return (
             <View style={[styles.placeholderContainer, props.style]}>
                <Text style={styles.placeholderText}>{props.source ? 'A carregar...' : 'Caminho do PDF não disponível.'}</Text>
            </View>
        );
    }
    
    // Em ambiente nativo, usamos o componente Pdf importado
    return (
        <Pdf
            {...props}
            onLoadComplete={(numberOfPages: number) => {
                // console.log(`Número de páginas: ${numberOfPages}`);
            }}
            onError={(error: Error) => {
                console.log('Erro PDF:', error);
                Alert.alert('Erro', 'Não foi possível carregar o PDF.');
            }}
        />
    );
};

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
        marginTop: 10,
    },
});

export default ConditionalPdfViewer;
