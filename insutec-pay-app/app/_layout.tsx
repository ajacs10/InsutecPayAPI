// app/_layout.tsx
import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, Text } from 'react-native';
import { AuthProvider, useAuth } from '../components/AuthContext';
import { FinanceProvider } from '../components/FinanceContext';
import { ThemeProvider } from './telas/ThemeContext/ThemeContext';

const COLORS = {
  primary: '#0b5394',
  darkBackground: '#1F1F1F',
  textLight: '#E0E0E0',
};

// === COMPONENTE DE CARREGAMENTO DE FONTES ===
function FontLoader({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = React.useState(false);

  useEffect(() => {
    Font.loadAsync({
      SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'), 
      ...Ionicons.font,
    })
      .then(() => setLoaded(true))
      .catch((err) => {
        console.warn('Erro ao carregar fontes:', err);
        setLoaded(true); 
      });
  }, []);

  if (!loaded) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: COLORS.darkBackground,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: COLORS.textLight, marginTop: 10, fontSize: 16 }}>
          Carregando fontes...
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

// === COMPONENTE DE REDIRECIONAMENTO AUTOMÁTICO (Lógica de Permissões Centralizada) ===
function RedirectHandler() {
  const { aluno, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    // Rotas públicas baseadas nos teus nomes de ficheiro
    const isPublicRoute = segments[0] === 'telas' && 
                         (segments[1] === 'login' || 
                          segments[1] === 'recuperacao' || 
                          segments[1] === 'cadastro' || 
                          segments[1] === 'termos');
    
    const isAdminRoute = segments[0] === 'telas' && segments[1] === 'admin';

    // 🛑 CORREÇÃO: Usar os nomes de rotas curtas definidos no Stack.Screen
    const homeAluno = '/telas/home/home';
    const homeAdmin = '/telas/admin/dashboard';
    // Nota: Usamos o nome do ficheiro 'login.tsx', que é a rota preferencial de login
    const loginRoute = '/telas/login/login'; 

    if (!aluno) {
      if (!isPublicRoute) {
          router.replace(loginRoute);
      }
      return;
    } 

    if (aluno) {
        if (isPublicRoute) {
            const destino = aluno.tipo_usuario === 'ADMIN' ? homeAdmin : homeAluno;
            router.replace(destino);
            return;
        }

        if (isAdminRoute && aluno.tipo_usuario !== 'ADMIN') {
            console.warn('[AUTH] Acesso não autorizado à rota admin. Redirecionando.');
            router.replace(homeAluno);
            return;
        }
    }
    
  }, [aluno, loading, segments, router]);

  return null;
}

// === LAYOUT PRINCIPAL ===
export default function RootLayout() {
  return (
    <FontLoader>
      <AuthProvider>
        <ThemeProvider>
          <FinanceProvider>
            <RedirectHandler />
            <Stack screenOptions={{ headerShown: false }}>
              
              {/* TELA INICIAL */}
              <Stack.Screen name="index" />

              {/* TELAS PÚBLICAS - Mapeado EXATAMENTE com os teus ficheiros */}
              {/* 🛑 Duas telas de Login: 'login' e 'LoginScreen'. Incluí ambas. */}
              <Stack.Screen name="telas/login/login" />
              <Stack.Screen name="telas/login/LoginScreen" />
              <Stack.Screen name="telas/recuperacao/RecuperarEmail" />
              <Stack.Screen name="telas/cadastro/Cadastro" />

              {/* TELAS PROTEGIDAS (ALUNO) - Mapeado EXATAMENTE */}
              <Stack.Screen name="telas/home/home" />
              <Stack.Screen name="telas/perfil/perfil" />
              <Stack.Screen name="telas/pagamento/DescricaoPagamento" />
              <Stack.Screen name="telas/historico/historico" />
              <Stack.Screen name="telas/notificacoes/notificacoes" />
              <Stack.Screen name="telas/financeiro/carteira" />
              <Stack.Screen name="telas/financeiro/recibos" />
              <Stack.Screen name="telas/dividas/dividas" />
              <Stack.Screen name="telas/comprovativo/comprovativo" />

              {/* TELAS DE SERVIÇOS - Mapeado EXATAMENTE */}
              <Stack.Screen name="telas/servicos/DeclaracaoNota" />
              <Stack.Screen name="telas/servicos/DeclaracaoSemNota" />
              <Stack.Screen name="telas/servicos/FolhadeProva" />
              <Stack.Screen name="telas/servicos/Propina" />
              <Stack.Screen name="telas/servicos/Reconfirmacaomatricula" />
              
              {/* TELAS DE PAGAMENTO/SUCESSO - Mapeado EXATAMENTE */}
              <Stack.Screen name="telas/ServicoPagamento/ServicoPagamento" />
              <Stack.Screen name="telas/ServicoPagamento/DetalhesPagamento" />
              <Stack.Screen name="telas/Success/Success" />
              
              {/* TELAS DIVERSAS - Mapeado EXATAMENTE */}
              <Stack.Screen name="telas/transacao/[id]" />
              <Stack.Screen name="telas/termos/Sobre" />
              <Stack.Screen name="telas/termos/Termos" />
              <Stack.Screen name="telas/verAjuda/verAjuda" />

              {/* TELAS ADMIN - Mapeado EXATAMENTE */}
              <Stack.Screen name="telas/admin/dashboard" />
              <Stack.Screen name="telas/admin/emolumentos" />
              <Stack.Screen name="telas/admin/Alunos" />

              {/* TELAS ESPECIAIS */}
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
              <Stack.Screen name="+not-found" />
              
            </Stack>
          </FinanceProvider>
        </ThemeProvider>
      </AuthProvider>
    </FontLoader>
  );
}
