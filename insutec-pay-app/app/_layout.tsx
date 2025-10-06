import React from 'react';
import { Stack, Redirect, usePathname } from 'expo-router';
import { useFonts } from 'expo-font';
import { Text, Platform, View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../components/AuthContext';
import { ThemeProvider } from './telas/ThemeContext/ThemeContext';
import CustomSplashScreen from './SplashScreen'; 

// Definindo as Cores
const COLORS = {
    primary: '#39FF14', 
    textLight: '#E0E0E0',
    darkBackground: '#121212',
    dark: '#000000',
    white: '#FFFFFF', // Adicionado para consistência
};

// =========================================================================
// 1. ROOT LAYOUT (Providers)
// =========================================================================
export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    // Exibir tela de carregamento de fontes
    if (!loaded && !error) {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.darkBackground, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ color: COLORS.textLight, marginTop: 10 }}>A carregar recursos...</Text>
            </View>
        );
    }
    // Exibir erro de carregamento de fontes
    if (error) {
        console.error('[RootLayout] Erro ao carregar fontes:', error);
        return <Text>Erro ao carregar fontes. Tente novamente.</Text>;
    }

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
function AppLayout() {
    const { isLoading, aluno } = useAuth();
    
    // --- Constantes de Rota ---
    const HOME_ROUTE = '/telas/home/HomeScreen';
    const LOGIN_ROUTE = '/telas/login/LoginScreen';

    // 1. Exibir a tela de splash enquanto a autenticação está a carregar
    if (isLoading) {
        return <CustomSplashScreen />;
    }

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: COLORS.primary,
                    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' } : { elevation: 4 }),
                },
                headerTintColor: COLORS.dark,
                headerTitleStyle: { fontWeight: 'bold', fontFamily: 'SpaceMono' },
                headerBackTitleVisible: false,
            }}
        >
            
            {/* 1. Rota Index ('/') com Lógica de Redirecionamento */}
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                    redirect: aluno ? HOME_ROUTE : LOGIN_ROUTE, 
                }}
            />
            
            {/* 2. Rotas de Autenticação */}
            <Stack.Screen name="telas/login/LoginScreen" options={{ headerShown: false }} />
            <Stack.Screen name="SplashScreen" options={{ headerShown: false }} />

            {/* 3. Rota Principal */}
            <Stack.Screen name="telas/home/HomeScreen" options={{ headerShown: false }} />
            
            {/* 4. Rotas de Serviços */}
            <Stack.Screen name="telas/servicos/Propina" options={{ title: 'Pagamento de Propina', headerShown: true }} />
            <Stack.Screen
                name="telas/servicos/Reconfirmacaomatricula"
                options={{ title: 'Reconfirmação de Matrícula', headerShown: true }}
            />
            <Stack.Screen
                name="telas/servicos/FolhadeProva"
                options={{ title: 'Solicitação de Folha de Prova', headerShown: true }}
            />
            <Stack.Screen name="telas/ServicoPagamento/ServicoPagamentoScreen" options={{ title: 'Serviços e Pagamentos' }} />
            
            {/* 5. Rotas de Utilidade */}
            <Stack.Screen name="telas/dividas/DividasScreen" options={{ title: 'Minhas Dívidas' }} />
            <Stack.Screen name="telas/historico/HistoricoScreen" options={{ title: 'Histórico de Pagamentos' }} />
            <Stack.Screen name="telas/notificacoes/NotificacoesScreen" options={{ title: 'Notificações' }} />
            <Stack.Screen name="telas/perfil/PerfilScreen" options={{ title: 'Meu Perfil' }} />
            <Stack.Screen name="telas/financeiro/CarteiraScreen" options={{ title: 'Minha Carteira' }} />

            {/* 6. ROTAS MODAIS / TRANSAÇÃO */}
            
            {/* 🎯 ROTA DE COMPROVATIVO (Estática, usando o nome do ficheiro) */}
            <Stack.Screen
                // O nome da rota deve ser o caminho completo do ficheiro
                name="telas/comprovativo/ComprovativoScreen" 
                options={{
                    title: 'Comprovativo de Pagamento',
                    presentation: 'modal',
                }}
            />

            {/* ROTA DINÂMICA (Original para detalhes de transação por ID) */}
            <Stack.Screen
                name="telas/transacao/[id]"
                options={{
                    title: 'Detalhes da Transação',
                    presentation: 'modal',
                }}
            />
            
            {/* 7. Rota Not Found */}
            <Stack.Screen name="+not-found" />
        </Stack>
    );
}
