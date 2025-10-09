// components/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { router, usePathname } from 'expo-router';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Rotas públicas que não requerem autenticação
  const PUBLIC_ROUTES = [
    '/telas/login/LoginScreen',
    '/telas/cadastro/CadastroScreen',
    '/telas/recuperacao/RecuperarEmailScreen',
    '/telas/termos/TermosScreen',
    '/telas/termos/SobreScreen',
  ];

  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route);

    if (!isLoading) {
      // Se não está autenticado e tenta acessar rota privada
      if (!isAuthenticated && !isPublicRoute) {
        console.log('[ProtectedRoute] Acesso negado, redirecionando para login');
        router.replace('/telas/login/LoginScreen');
        return;
      }

      // Se está autenticado e tenta acessar rota de login
      if (isAuthenticated && pathname === '/telas/login/LoginScreen') {
        console.log('[ProtectedRoute] Já autenticado, redirecionando para home');
        router.replace('/telas/home/HomeScreen');
        return;
      }
    }
  }, [isLoading, isAuthenticated, pathname]);

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#0F0F0F'
      }}>
        <ActivityIndicator size="large" color="#39FF14" />
        <Text style={{ color: '#E0E0E0', marginTop: 10 }}>
          Verificando autenticação...
        </Text>
      </View>
    );
  }

  // Se não está autenticado e não é rota pública, não renderiza nada (já redirecionou)
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route);
  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  // Renderiza o conteúdo protegido
  return <>{children}</>;
}
