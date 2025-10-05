import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Dimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';

const { width } = Dimensions.get('window');

// Caminho da imagem
import LogoImage from '../assets/images/logo.png';

// Define o tempo mínimo de exibição (3 segundos)
const MINIMUM_DURATION_MS = 3000;

// Impede o Splash automático de desaparecer antes do tempo
SplashScreen.preventAutoHideAsync();

export default function SplashScreenCustom() {
  useEffect(() => {
    async function prepare() {
      try {
        // 🔹 Pré-carrega a imagem antes mesmo de renderizar
        await Asset.fromModule(LogoImage).downloadAsync();

        // 🔹 Mantém o splash ativo por pelo menos 3 segundos
        await new Promise(resolve => setTimeout(resolve, MINIMUM_DURATION_MS));
      } catch (e) {
        console.warn('Erro ao carregar assets:', e);
      } finally {
        // 🔹 Após tudo estar pronto, esconde o splash
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <View style={styles.container}>
      {/* Logótipo */}
      <Image
        source={LogoImage}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="Logótipo da Aplicação Insutec Pay"
      />

      {/* Título */}
      <Text style={styles.text}>Insutec Pay</Text>

      {/* Indicador de carregamento */}
      <ActivityIndicator size="large" color="#fff" style={styles.indicator} />
      <Text style={styles.loadingText}>A carregar a aplicação...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: 25,
    marginBottom: 20,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  indicator: {
    marginTop: 50,
    marginBottom: 10,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
});

