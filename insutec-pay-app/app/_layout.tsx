import React, { useEffect, useCallback } from 'react';
import { Stack, router, usePathname } from 'expo-router';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator, Text, Platform } from 'react-native';

// Import all your contexts and styles
import { AuthProvider, useAuth } from '../components/AuthContext';
import { FinanceProvider } from '../components/FinanceContext';
import { ThemeProvider, useTheme } from './telas/ThemeContext/ThemeContext';
import CustomSplashScreen from './SplashScreen';

// Importando COLORS
import { COLORS } from '../styles/_HomeStyles'; 

// --- Cores de Fallback ---
const DEFAULT_COLORS = {
  primary: '#0b5394',
  lightBackground: '#f8f9fa',
  darkBackground: '#1F1F1F',
  textDark: '#333',
  textLight: '#E0E0E0',
};

// Obter cores seguras
const getColors = () => ({
  primary: COLORS?.primary || DEFAULT_COLORS.primary,
  lightBackground: COLORS?.lightBackground || DEFAULT_COLORS.lightBackground,
  darkBackground: COLORS?.darkBackground || DEFAULT_COLORS.darkBackground,
  textDark: COLORS?.textDark || DEFAULT_COLORS.textDark,
  textLight: COLORS?.textLight || DEFAULT_COLORS.textLight,
});

// =========================================================================
// Componente Principal que usa Authentication e Theme
// =========================================================================
function AppContent() {
  const { isDarkMode } = useTheme();
  const { isLoading, aluno } = useAuth();
  const pathname = usePathname();

  const { lightBackground, darkBackground, textLight, textDark } = getColors();

  // Define as cores dinâmicas do Stack
  const stackBgColor = isDarkMode ? darkBackground : lightBackground;
  const headerTintColor = isDarkMode ? textLight : textDark;

  // Rotas públicas que não requerem autenticação
  const PUBLIC_ROUTES = [
    '/telas/login/LoginScreen',
    '/telas/cadastro/CadastroScreen',
    '/telas/recuperacao/RecuperacaoScreen',
    '/SplashScreen',
  ];

  // Função para garantir a segurança de rotas
  const checkAccess = useCallback(() => {
    const isAuthenticated = !!aluno?.nr_estudante;
    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route)); 
    const isIndexRoute = pathname === '/';

    if (!isLoading) {
      // 1. Não autenticado em rota privada: Redireciona para o login
      if (!isAuthenticated && !isPublicRoute && !isIndexRoute) {
        console.log('[AppContent] Não autenticado em rota privada. Redirecionando para Login.');
        router.replace('/telas/login/LoginScreen');
      }
      // 2. Autenticado em rota pública: Redireciona para Home
      else if (isAuthenticated && (isPublicRoute || isIndexRoute)) {
        console.log('[AppContent] Autenticado em rota pública. Redirecionando para Home.');
        router.replace('/telas/home/HomeScreen');
      }
    }
  }, [isLoading, aluno, pathname]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  // Mostrar Splash Screen enquanto carrega
  if (isLoading) {
    console.log('[AppContent] Exibindo CustomSplashScreen');
    return <CustomSplashScreen />; 
  }

  console.log('[AppContent] Renderizando Stack Navigator - Dark Mode:', isDarkMode);

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: stackBgColor, 
        },
        headerStyle: {
          backgroundColor: isDarkMode ? darkBackground : lightBackground,
          ...(Platform.OS === 'web' ? { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' } : { elevation: 4 }),
          borderBottomWidth: 0,
        },
        headerTintColor,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: 'SpaceMono',
          color: headerTintColor,
        },
        headerBackTitleVisible: false,
      }}
    >
      {/* Rotas Principais */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          redirect: !aluno ? '/telas/login/LoginScreen' : '/telas/home/HomeScreen',
        }}
      />
      
      {/* Rotas Públicas */}
      <Stack.Screen name="telas/login/LoginScreen" options={{ headerShown: false }} />
      <Stack.Screen name="telas/cadastro/CadastroScreen" options={{ headerShown: false }} />
      <Stack.Screen name="telas/recuperacao/RecuperacaoScreen" options={{ headerShown: false }} />
      <Stack.Screen name="SplashScreen" options={{ headerShown: false }} />
      
      {/* Rotas Autenticadas - Home e Serviços */}
      <Stack.Screen name="telas/home/HomeScreen" options={{ headerShown: false }} />
      <Stack.Screen name="telas/servicos/Propina" options={{ title: 'Pagamento de Propina', headerShown: true }} />
      <Stack.Screen name="telas/servicos/Reconfirmacaomatricula" options={{ title: 'Reconfirmação de Matrícula', headerShown: true }} />
      <Stack.Screen name="telas/servicos/FolhadeProva" options={{ title: 'Solicitação de Folha de Prova', headerShown: true }} />
      <Stack.Screen name="telas/servicos/DeclaracaoNota" options={{ title: 'Declaração com Notas', headerShown: true }} />
      <Stack.Screen name="telas/servicos/DeclaracaoSemNota" options={{ title: 'Declaração sem Notas', headerShown: true }} />
      
      {/* Rotas de Pagamento e Serviços */}
      <Stack.Screen name="telas/ServicoPagamento/ServicoPagamentoScreen" options={{ title: 'Serviços e Pagamentos' }} />
      <Stack.Screen name="telas/ServicoPagamento/DetalhesPagamentoScreen" options={{ title: 'Detalhes do Pagamento' }} />
      
      {/* Rotas Financeiras */}
      <Stack.Screen name="telas/dividas/DividasScreen" options={{ title: 'Minhas Dívidas' }} />
      <Stack.Screen name="telas/historico/HistoricoScreen" options={{ title: 'Histórico de Pagamentos' }} />
      <Stack.Screen name="telas/financeiro/CarteiraScreen" options={{ title: 'Minha Carteira' }} />
      <Stack.Screen name="telas/financeiro/RecibosScreen" options={{ title: 'Histórico de Recibos' }} />
      <Stack.Screen name="telas/comprovativo/ComprovativoScreen" options={{ title: 'Comprovativo' }} />
      
      {/* Rotas de Perfil e Notificações */}
      <Stack.Screen name="telas/perfil/PerfilScreen" options={{ title: 'Meu Perfil' }} />
      <Stack.Screen name="telas/notificacoes/NotificacoesScreen" options={{ title: 'Notificações' }} />
      
      {/* Rotas de Ajuda e Informações */}
      <Stack.Screen name="telas/verAjuda/verAjudaScreen" options={{ title: 'Ajuda e Suporte', headerShown: true }} />
      <Stack.Screen name="telas/termos/TermosScreen" options={{ title: 'Termos e Políticas', headerShown: true }} />
      <Stack.Screen name="telas/termos/SobreScreen" options={{ title: 'Sobre o App', headerShown: true }} />
      
      {/* Rotas de Transação */}
      <Stack.Screen name="telas/transacao/[id]" options={{ title: 'Detalhes da Transação', presentation: 'modal' }} />
      
      {/* Contextos (para evitar erros de rota) */}
      <Stack.Screen name="telas/ThemeContext/ThemeContext" options={{ headerShown: false }} />
      
      {/* Rotas Futuras (comentadas para referência) */}
      {/* <Stack.Screen name="telas/verAjuda/FaqScreen" options={{ title: 'Perguntas Frequentes', headerShown: true }} /> */}
      {/* <Stack.Screen name="telas/verAjuda/NovoTicketScreen" options={{ title: 'Novo Ticket', headerShown: true }} /> */}
      
      {/* Rota de Fallback */}
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
}

// =========================================================================
// Root Layout - Configuração Principal
// =========================================================================
export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { darkBackground, primary, textLight } = getColors();

  // Mostra tela de carregamento de fontes
  if (!loaded && !error) {
    console.log('[RootLayout] Carregando fontes...');
    return (
      <View style={{ flex: 1, backgroundColor: darkBackground, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={primary} />
        <Text style={{ color: textLight, marginTop: 10 }}>A carregar recursos...</Text>
      </View>
    );
  }

  if (error) {
    console.error('[RootLayout] Erro ao carregar fontes:', error);
    return (
      <View style={{ flex: 1, backgroundColor: darkBackground, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: textLight, fontFamily: 'SpaceMono' }}>
          Erro ao carregar fontes. Tente novamente.
        </Text>
      </View>
    );
  }

  console.log('[RootLayout] Fontes carregadas, inicializando app...');
  
  return (
    <AuthProvider>
      <ThemeProvider>
        <FinanceProvider>
          <AppContent />
        </FinanceProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
