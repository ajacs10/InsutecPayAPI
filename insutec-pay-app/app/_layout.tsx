// app/_layout.tsx
import React, { useEffect, useCallback } from 'react';
import { Stack, router, usePathname, useFocusEffect } from 'expo-router';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator, Text } from 'react-native';
import { AuthProvider, useAuth } from '../components/AuthContext';
import { FinanceProvider } from '../components/FinanceContext';
import { ThemeProvider, useTheme } from './telas/ThemeContext/ThemeContext';
import CustomSplashScreen from './SplashScreen';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#39FF14',
  lightBackground: '#F0F2F5',
  darkBackground: '#0F0F0F',
  textDark: '#1C1C1C',
  textLight: '#E0E0E0',
};

const DEFAULT_COLORS = {
  primary: '#0b5394',
  lightBackground: '#f8f9fa',
  darkBackground: '#1F1F1F',
  textDark: '#333',
  textLight: '#E0E0E0',
};

const getColors = () => ({
  primary: COLORS?.primary || DEFAULT_COLORS.primary,
  lightBackground: COLORS?.lightBackground || DEFAULT_COLORS.lightBackground,
  darkBackground: COLORS?.darkBackground || DEFAULT_COLORS.darkBackground,
  textDark: COLORS?.textDark || DEFAULT_COLORS.textDark,
  textLight: COLORS?.textLight || DEFAULT_COLORS.textLight,
});

function FontLoader({ children }: { children: React.ReactNode }) {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...Ionicons.font,
  });

  const { darkBackground, primary, textLight } = getColors();

  if (!loaded && !error) {
    return (
      <View style={{ flex: 1, backgroundColor: darkBackground, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={primary} />
        <Text style={{ color: textLight, marginTop: 10 }}>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: darkBackground, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: textLight }}>Erro ao carregar fontes.</Text>
      </View>
    );
  }

  return <>{children}</>;
}

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

  const checkAccess = useCallback(() => {
    if (isLoading) return;

    const isAuthenticated = !!aluno?.nr_estudante;
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route));
    const isIndexRoute = pathname === '/';

    if (!isAuthenticated && !isPublicRoute && !isIndexRoute) {
      router.replace('/telas/login/LoginScreen');
    } else if (isAuthenticated && (isPublicRoute || isIndexRoute)) {
      router.replace('/telas/home/HomeScreen');
    }
  }, [isLoading, aluno, pathname]);

  // Use useFocusEffect para evitar navegação antes do mount
  useFocusEffect(
    useCallback(() => {
      checkAccess();
    }, [checkAccess])
  );

  if (isLoading) {
    return <CustomSplashScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: stackBgColor },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="SplashScreen" />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="telas/login/LoginScreen" />
      <Stack.Screen name="telas/cadastro/CadastroScreen" />
      <Stack.Screen name="telas/recuperacao/RecuperarEmailScreen" />
      <Stack.Screen name="telas/home/HomeScreen" />
      <Stack.Screen name="telas/servicos/Propina" />
      <Stack.Screen name="telas/servicos/Reconfirmacaomatricula" />
      <Stack.Screen name="telas/servicos/FolhadeProva" />
      <Stack.Screen name="telas/servicos/DeclaracaoNota" />
      <Stack.Screen name="telas/servicos/DeclaracaoSemNota" />
      <Stack.Screen name="telas/ServicoPagamento/ServicoPagamentoScreen" />
      <Stack.Screen name="telas/ServicoPagamento/DetalhesPagamentoScreen" />
      <Stack.Screen name="telas/dividas/DividasScreen" />
      <Stack.Screen name="telas/historico/HistoricoScreen" />
      <Stack.Screen name="telas/financeiro/CarteiraScreen" />
      <Stack.Screen name="telas/financeiro/RecibosScreen" />
      <Stack.Screen name="telas/comprovativo/ComprovativoScreen" />
      <Stack.Screen name="telas/perfil/PerfilScreen" />
      <Stack.Screen name="telas/notificacoes/NotificacoesScreen" />
      <Stack.Screen name="telas/verAjuda/verAjudaScreen" />
      <Stack.Screen name="telas/termos/TermosScreen" />
      <Stack.Screen name="telas/termos/SobreScreen" />
      <Stack.Screen name="telas/transacao/[id]" />
      <Stack.Screen name="telas/Success/SuccessScreen" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
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
