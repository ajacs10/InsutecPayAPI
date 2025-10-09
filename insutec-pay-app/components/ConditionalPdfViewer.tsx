import React from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  Alert, 
  StyleSheet, 
  Dimensions,
  Platform,
  Linking,
  TouchableOpacity 
} from 'react-native';

const { height } = Dimensions.get('window');

const COLORS = {
  primary: '#1a4a6d',
};

interface ConditionalPdfViewerProps {
  source: { uri: string } | null;
  style?: any;
  title?: string;
}

const WebPdfFallback: React.FC<{ pdfUri: string; title?: string }> = ({ pdfUri, title }) => {
  const handleOpenPdf = async () => {
    try {
      const canOpen = await Linking.canOpenURL(pdfUri);
      if (canOpen) {
        await Linking.openURL(pdfUri);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o PDF. Nenhum aplicativo compatível encontrado.');
      }
    } catch (error) {
      console.error('Erro ao abrir PDF:', error);
      Alert.alert('Erro', 'Não foi possível abrir o PDF.');
    }
  };

  return (
    <View style={styles.fallbackContainer}>
      <Text style={styles.fallbackTitle}>{title || 'Documento PDF'}</Text>
      <Text style={styles.fallbackText}>
        Para visualizar o documento PDF completo:
      </Text>
      
      <TouchableOpacity style={styles.button} onPress={handleOpenPdf}>
        <Text style={styles.buttonText}>Abrir PDF em Visualizador Externo</Text>
      </TouchableOpacity>
    </View>
  );
};

const ConditionalPdfViewer: React.FC<ConditionalPdfViewerProps> = (props) => {
  const { source, style, title } = props;

  // No Expo Go, sempre usa o fallback (react-native-pdf não funciona)
  if (!source || !source.uri) {
    return (
      <View style={[styles.placeholderContainer, style]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.placeholderText}>
          PDF não disponível
        </Text>
      </View>
    );
  }

  // SEMPRE usa fallback no Expo Go - remove a tentativa de importar react-native-pdf
  return <WebPdfFallback pdfUri={source.uri} title={title} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    minHeight: height * 0.4,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    minHeight: height * 0.4,
    padding: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  fallbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  fallbackText: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ConditionalPdfViewer;
