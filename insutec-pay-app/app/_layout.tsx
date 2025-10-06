import React, { useEffect, useCallback } from 'react';
import { Stack, router, usePathname } from 'expo-router';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator, Text, Platform } from 'react-native';
import { AuthProvider, useAuth } from '../components/AuthContext';
import { ThemeProvider } from './telas/ThemeContext/ThemeContext';
import CustomSplashScreen from './SplashScreen';

// Definindo as Cores
const COLORS = {
  primary: '#39FF14',
  textLight: '#E0E0E0',
  darkBackground: '#121212',
  dark: '#000000',
  white: '#FFFFFF',
};

// =========================================================================
// 1. ROOT LAYOUT (Providers)
// =========================================================================
export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Mostra tela de carregamento de fontes
  if (!loaded && !error) {
    console.log('[RootLayout] Carregando fontes...');
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.darkBackground, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: COLORS.textLight, marginTop: 10 }}>
          A carregar recursos...
        </Text>
      </View>
    );
  }

  if (error) {
    console.error('[RootLayout] Erro ao carregar fontes:', error);
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.darkBackground, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: COLORS.textLight, fontFamily: loaded ? 'SpaceMono' : undefined }}>
          Erro ao carregar fontes. Tente novamente.
        </Text>
      </View>
    );
  }

  console.log('[RootLayout] Fontes carregadas, renderizando AppLayout');
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppLayout />
      </ThemeProvider>
    </AuthProvider>
  );
}

// =========================================================================
// 2. APP LAYOUT (Lógica de Autenticação e Navegação)
// =========================================================================

// Rotas públicas que não requerem autenticação (Login e Splash)
const PUBLIC_ROUTES = [
  '/telas/login/LoginScreen',
  '/SplashScreen',
];

function AppLayout() {
  const { isLoading, aluno } = useAuth();
  const pathname = usePathname();

  // Função para garantir a segurança (utilizador não autenticado em rota privada)
  const checkAccess = useCallback(() => {
    const alunoId = aluno?.nr_estudante;
    const isAuthenticated = !!alunoId;

    if (!isLoading) {
      const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
      const isIndexRoute = pathname === '/';

      // 1. REDIRECIONAMENTO DE SEGURANÇA (Anti-acesso)
      if (!isAuthenticated && !isPublicRoute && !isIndexRoute) {
        console.log('[AppLayout - Safety Check] Não autenticado em rota privada. Redirecionando para Login.');
        router.replace('/telas/login/LoginScreen');
      } 
      // 2. REDIRECIONAMENTO DE EXPERIÊNCIA (Anti-Login após autenticação)
      else if (isAuthenticated && (isPublicRoute || isIndexRoute)) {
        console.log('[AppLayout - UX Check] Autenticado em rota pública. Redirecionando para Home.');
        router.replace('/telas/home/HomeScreen');
      }
      else {
        console.log('[AppLayout] Rota válida para o estado atual. Sem redirecionamento.');
      }
    }
  }, [isLoading, aluno, pathname]);

  useEffect(() => {
    // A lógica de navegação de segurança/UX é acionada após o carregamento inicial.
    checkAccess();
  }, [checkAccess]);

  // 1. PRIMEIRA TELA: Splash Screen (enquanto isLoading é true)
  if (isLoading) {
    console.log('[AppLayout] Exibindo CustomSplashScreen');
    return <CustomSplashScreen />;
  }

  // 2. APÓS SPLASH: Renderiza a Stack para gerir as telas Login/Home
  console.log('[AppLayout] Renderizando Stack Navigator');
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
          // Corrigindo uso de boxShadow em Web
          ...(Platform.OS === 'web' ? { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' } : { elevation: 4 }),
        },
        headerTintColor: COLORS.dark,
        headerTitleStyle: { fontWeight: 'bold', fontFamily: 'SpaceMono' },
        headerBackTitleVisible: false,
      }}
    >
      
      {/* 🚀 CORREÇÃO CRUCIAL: Rota Index para forçar Login/Home após o Splash */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          // O redirect força a navegação para o destino final assim que isLoading for false.
          redirect: !aluno 
            ? '/telas/login/LoginScreen' // Se não autenticado, vá para Login
            : '/telas/home/HomeScreen', // Se autenticado, vá para Home
        }}
      />

      <Stack.Screen name="telas/login/LoginScreen" options={{ headerShown: false }} />
      <Stack.Screen name="SplashScreen" options={{ headerShown: false }} />
      <Stack.Screen name="telas/home/HomeScreen" options={{ headerShown: false }} />
      
      {/* Rotas de Serviços */}
      <Stack.Screen name="telas/servicos/Propina" options={{ title: 'Pagamento de Propina', headerShown: true }} />
      <Stack.Screen
        name="telas/servicos/Reconfirmacaomatricula"
        options={{ title: 'Reconfirmação de Matrícula', headerShown: true }}
      />
      <Stack.Screen
        name="telas/servicos/FolhadeProva"
        options={{ title: 'Solicitação de Folha de Prova', headerShown: true }}
      />
      
      {/* Rotas de Funcionalidades */}
      <Stack.Screen name="telas/ServicoPagamento/ServicoPagamentoScreen" options={{ title: 'Serviços e Pagamentos' }} />
      <Stack.Screen name="telas/dividas/DividasScreen" options={{ title: 'Minhas Dívidas' }} />
      <Stack.Screen name="telas/historico/HistoricoScreen" options={{ title: 'Histórico de Pagamentos' }} />
      <Stack.Screen name="telas/notificacoes/NotificacoesScreen" options={{ title: 'Notificações' }} />
      <Stack.Screen name="telas/perfil/PerfilScreen" options={{ title: 'Meu Perfil' }} />
      <Stack.Screen name="telas/financeiro/CarteiraScreen" options={{ title: 'Minha Carteira' }} />
      
      {/* Rotas Modais */}
      <Stack.Screen
        name="telas/comprovativo/ComprovativoScreen"
        options={{
          title: 'Comprovativo de Pagamento',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="telas/transacao/[id]"
        options={{
          title: 'Detalhes da Transação',
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
}
