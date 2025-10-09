import React, { useEffect, useCallback } from 'react';
import { Stack, router, usePathname } from 'expo-router';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator, Text } from 'react-native';
import { AuthProvider, useAuth } from '../components/AuthContext';
import { FinanceProvider } from '../components/FinanceContext';
import { ThemeProvider, useTheme } from './telas/ThemeContext/ThemeContext';
import CustomSplashScreen from './SplashScreen';

// Importando COLORS
const COLORS = {
  primary: '#39FF14',
  lightBackground: '#F0F2F5',
  darkBackground: '#0F0F0F',
  textDark: '#1C1C1C',
  textLight: '#E0E0E0',
  subText: '#888888',
  gray: '#9E9E9E',
  lightGray: '#E0E0E0',
  cardDark: '#1F1F1F',
  cardLight: '#FFFFFF',
};

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
// Componente para carregamento de fontes
// =========================================================================
function FontLoader({ children }: { children: React.ReactNode }) {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { darkBackground, primary, textLight } = getColors();

  if (!loaded && !error) {
    console.log('[RootLayout] Carregando fontes...');
    return (
      <View style={{ flex: 1, backgroundColor: darkBackground, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={primary} />
        <Text style={{ color: textLight, marginTop: 10 }}>
          A carregar recursos...
        </Text>
      </View>
    );
  }

  if (error) {
    console.error('[RootLayout] Erro ao carregar fontes:', error);
    return (
      <View style={{ flex: 1, backgroundColor: darkBackground, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: textLight }}>
          Erro ao carregar fontes. Tente novamente.
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

// =========================================================================
// Componente Principal que usa Authentication e Theme
// =========================================================================
function AppContent() {
  const { isDarkMode } = useTheme();
  const { isLoading, aluno } = useAuth();
  const pathname = usePathname();

  const { lightBackground, darkBackground } = getColors();

  const stackBgColor = isDarkMode ? darkBackground : lightBackground;

  const PUBLIC_ROUTES = [
    '/telas/login/LoginScreen',
    '/SplashScreen',
    '/telas/cadastro/CadastroScreen',
    '/telas/recuperacao/RecuperarEmailScreen',
  ];

  // Função para garantir a segurança de rotas
  const checkAccess = useCallback(() => {
    if (isLoading) return;

    const isAuthenticated = !!aluno?.nr_estudante;
    const isPublicRoute = PUBLIC_ROUTES.some((route) => 
      pathname === route || pathname.startsWith(route)
    );
    const isIndexRoute = pathname === '/';

    console.log('[AppContent] Verificando acesso:', {
      pathname,
      isAuthenticated,
      isPublicRoute,
      isIndexRoute,
      isLoading
    });

    // 1. Não autenticado em rota privada: Redireciona para o login
    if (!isAuthenticated && !isPublicRoute && !isIndexRoute) {
      console.log('[AppContent] Não autenticado em rota privada. Redirecionando para Login.');
      // Usar setTimeout para evitar conflitos de renderização
      setTimeout(() => {
        router.replace('/telas/login/LoginScreen');
      }, 0);
    }
    // 2. Autenticado em rota pública: Redireciona para Home
    else if (isAuthenticated && (isPublicRoute || isIndexRoute)) {
      console.log('[AppContent] Autenticado em rota pública. Redirecionando para Home.');
      // Usar setTimeout para evitar conflitos de renderização
      setTimeout(() => {
        router.replace('/telas/home/HomeScreen');
      }, 0);
    }
  }, [isLoading, aluno, pathname]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  // Mostrar Splash Screen enquanto carrega (Autenticação)
  if (isLoading) {
    console.log('[AppContent] Exibindo CustomSplashScreen (Carregando Autenticação)');
    return <CustomSplashScreen />;
  }

  console.log('[AppContent] Renderizando Stack Navigator - Dark Mode:', isDarkMode);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: stackBgColor,
        },
      }}
    >
      {/* Rota Index */}
      <Stack.Screen name="index" />

      {/* Splash Screen */}
      <Stack.Screen name="SplashScreen" />
      
      {/* Modal */}
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />

      {/* Rotas de Autenticação */}
      <Stack.Screen name="telas/login/LoginScreen" />
      <Stack.Screen name="telas/cadastro/CadastroScreen" />
      <Stack.Screen name="telas/recuperacao/RecuperarEmailScreen" />

      {/* Rotas Autenticadas - Principal */}
      <Stack.Screen name="telas/home/HomeScreen" />

      {/* Rotas de Serviços */}
      <Stack.Screen name="telas/servicos/Propina" />
      <Stack.Screen name="telas/servicos/Reconfirmacaomatricula" />
      <Stack.Screen name="telas/servicos/FolhadeProva" />
      <Stack.Screen name="telas/servicos/DeclaracaoNota" />
      <Stack.Screen name="telas/servicos/DeclaracaoSemNota" />

      {/* Rotas de Pagamento */}
      <Stack.Screen name="telas/ServicoPagamento/ServicoPagamentoScreen" />
      <Stack.Screen name="telas/ServicoPagamento/DetalhesPagamentoScreen" />

      {/* Rotas Financeiras */}
      <Stack.Screen name="telas/dividas/DividasScreen" />
      <Stack.Screen name="telas/historico/HistoricoScreen" />
      <Stack.Screen name="telas/financeiro/CarteiraScreen" />
      <Stack.Screen name="telas/financeiro/RecibosScreen" />
      <Stack.Screen name="telas/comprovativo/ComprovativoScreen" />

      {/* Rotas de Perfil */}
      <Stack.Screen name="telas/perfil/PerfilScreen" />
      <Stack.Screen name="telas/notificacoes/NotificacoesScreen" />

      {/* Rotas de Ajuda */}
      <Stack.Screen name="telas/verAjuda/verAjudaScreen" />
      <Stack.Screen name="telas/termos/TermosScreen" />
      <Stack.Screen name="telas/termos/SobreScreen" />

      {/* Rotas de Transação */}
      <Stack.Screen name="telas/transacao/[id]" />
      <Stack.Screen name="telas/Success/SuccessScreen" />

      {/* Rota de Fallback */}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

// =========================================================================
// Root Layout - Configuração Principal
// =========================================================================
export default function RootLayout() {
  console.log('[RootLayout] Inicializando app...');

  return (
    <FontLoader>
      <AuthProvider>
        <ThemeProvider>
          <FinanceProvider>
            <AppContent />
          </FinanceProvider>
        </ThemeProvider>
      </AuthProvider>
    </FontLoader>
  );
}
