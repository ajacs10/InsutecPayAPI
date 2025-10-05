import React, { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { useFonts } from 'expo-font';
import { Text } from 'react-native'; // Importação do Text do React Native

// Contexto de autenticação
import { AuthProvider, useAuth } from '../components/AuthContext';

// Contexto de tema
import { ThemeProvider } from './telas/ThemeContext/ThemeContext';

// Tela de Splash
import CustomSplashScreen from './SplashScreen';

// Paleta de cores principal (Mantenha esta paleta consistente)
const COLORS = {
    primary: '#00CC00', // Verde Neon mais escuro para Header de fundo
    background: '#f8f9fa',
    textDark: '#333',
    textLight: '#fff',
    primaryDark: '#009900', 
    accent: '#00FFFF', // Neon cyan
    darkBackground: '#1C1C1C', // Fundo escuro
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
    // Carrega a fonte (certifique-se de que o caminho da fonte está correto)
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        // Adicione outras fontes aqui se necessário
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
            <ThemeProvider>
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
        // Atrasar a navegação um pouco para garantir que o Splash seja visto
        const delay = 1000; // 1 segundo
        
        if (!isLoading) {
            const timer = setTimeout(() => {
                if (aluno) {
                    // Usuário logado: vai para a home
                    router.replace('/telas/home/HomeScreen'); 
                } else {
                    // Usuário não logado: vai para o login
                    router.replace('/telas/login/LoginScreen'); 
                }
            }, delay);
            return () => clearTimeout(timer); // Limpa o timer se o componente desmontar
        }

    }, [isLoading, aluno]);

    // Enquanto carrega (e por 1 segundo após o carregamento), mostra o Splash
    if (isLoading) {
        return <CustomSplashScreen />;
    }

    // Se a navegação ainda não ocorreu (e o isLoading é falso), renderizamos o Stack
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: COLORS.primary },
                headerTintColor: COLORS.textLight,
                headerTitleStyle: { fontWeight: 'bold' },
                headerBackTitleVisible: false, // Oculta o título do botão de voltar no iOS
            }}
        >
            {/* Login (sem cabeçalho) */}
            <Stack.Screen
                name="telas/login/LoginScreen"
                options={{ headerShown: false }}
            />

            {/* Home (sem cabeçalho, pois você implementou um header customizado no HomeScreen.tsx) */}
            <Stack.Screen
                name="telas/home/HomeScreen"
                options={{
                    headerShown: false, // ✅ CORREÇÃO APLICADA: Remove o header de navegação
                }}
            />

            {/* Dívidas */}
            <Stack.Screen
                name="telas/dividas/DividasScreen"
                options={{ title: 'Minhas Dívidas' }}
            />

            {/* Perfil */}
            <Stack.Screen
                name="telas/perfil/PerfilScreen"
                options={{ title: 'Meu Perfil' }}
            />

            {/* Histórico */}
            <Stack.Screen
                name="telas/historico/HistoricoScreen"
                options={{ title: 'Histórico de Pagamentos' }}
            />
            
            {/* Pagamento de Serviço */}
            <Stack.Screen
                name="telas/ServicoPagamento/ServicoPagamentoScreen"
                options={{ title: 'Pagamento de Serviço' }}
            />

            {/* Transação (Detalhes/Confirmação de Transação - apresentada como Modal) */}
            <Stack.Screen
                name="telas/transacao/[id]" // Rota dinâmica
                options={{
                    title: 'Detalhes da Transação',
                    presentation: 'modal',
                }}
            />

            {/* Tela de Splash (não é usada diretamente, mas precisa estar no Stack) */}
            <Stack.Screen
                name="SplashScreen"
                options={{ headerShown: false }}
            />
            
            {/* Tela de Notificações (Adicionei para completar o fluxo de Home) */}
            <Stack.Screen
                name="telas/notificacoes/NotificacoesScreen"
                options={{ title: 'Notificações' }}
            />

            {/* Catch-all para rotas não encontradas */}
            <Stack.Screen name="[...missing]" options={{ title: '404 - Não Encontrado' }} />

        </Stack>
    );
}
