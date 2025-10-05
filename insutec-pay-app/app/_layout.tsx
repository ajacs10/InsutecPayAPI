// app/_layout.tsx

import React, { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { useFonts } from 'expo-font';

// Contexto de autenticação
import { AuthProvider, useAuth } from '../components/AuthContext';

// Contexto de tema
import { ThemeProvider } from './telas/ThemeContext/ThemeContext'; // Updated path

// Tela de Splash
import CustomSplashScreen from './SplashScreen';

// Paleta de cores principal
const COLORS = {
  primary: '#00FF00', // Neon green
  background: '#f8f9fa',
  textDark: '#333',
  textLight: '#fff',
  primaryDark: '#00CC00', // Darker neon green
  accent: '#00FFFF', // Neon cyan
  darkBackground: '#2E2E2E', // Dark mode background
  cardBackground: '#3A3A3A',
  success: '#00FF00',
  danger: '#FF3333',
  warning: '#FFCC00',
  secondary: '#00FFFF',
  text: '#E0E0E0',
  subText: '#AAAAAA',
  white: '#FFFFFF',
  gray: '#666666',
};

// ----------------------------------------------------------------------
// 1️⃣ RootLayout: Carrega fontes e envolve o app com AuthProvider
// ----------------------------------------------------------------------
export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded && !error) {
    return null; // Espera o carregamento da fonte
  }
  if (error) {
    console.error('Erro ao carregar fontes:', error);
    return <Text>Erro ao carregar fontes. Tente novamente.</Text>; // Fallback básico
  }

  return (
    <AuthProvider>
      <ThemeProvider> {/* ✅ TEMA GLOBAL: Corretamente posicionado para envolver o AppLayout */}
        <AppLayout />
      </ThemeProvider>
    </AuthProvider>
  );
}

// ----------------------------------------------------------------------
// 2️⃣ AppLayout: Controla splash e navegação inicial
// ----------------------------------------------------------------------
function AppLayout() {
  const { isLoading, aluno } = useAuth();

  useEffect(() => {
    // Quando o carregamento termina, decide a rota inicial
    if (!isLoading) {
      if (aluno) {
        router.replace('/telas/home/HomeScreen'); // Usuário logado
      } else {
        router.replace('/telas/login/LoginScreen'); // Usuário não logado
      }
    }
    // Nota: Pode adicionar um setTimeout para manter o splash por mais tempo, se desejado
  }, [isLoading, aluno]);

  // Enquanto carrega, mostra o Splash
  if (isLoading) {
    return <CustomSplashScreen />;
  }

  // Quando termina o carregamento, renderiza as telas
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.textLight,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {/* Telas principais */}
      <Stack.Screen
        name="telas/login/LoginScreen"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="telas/home/HomeScreen"
        options={{
          title: 'InsutecPay',
          headerLeft: () => null,
        }}
      />

      <Stack.Screen
        name="telas/dividas/DividasScreen"
        options={{ title: 'Minhas Dívidas' }}
      />

      <Stack.Screen
        name="telas/transacao/TransactionScreen"
        options={{
          title: 'Confirmar Pagamento',
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="telas/perfil/PerfilScreen"
        options={{ title: 'Meu Perfil' }}
      />

      <Stack.Screen
        name="telas/historico/HistoricoScreen"
        options={{ title: 'Histórico de Pagamentos' }}
      />
      
      {/* 🛑 FALTA A ROTA DO SERVICO PAGAMENTO */}
      <Stack.Screen
        name="telas/ServicoPagamento/ServicoPagamentoScreen"
        options={{ title: 'Pagamento de Serviço' }}
      />


      {/* Tela de Splash (não aparece no stack, apenas chamada condicional) */}
      <Stack.Screen
        name="SplashScreen"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
