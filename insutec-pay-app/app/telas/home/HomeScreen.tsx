import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    Animated, 
    Easing, 
    SafeAreaView, 
    Dimensions, 
    StatusBar, 
    Image,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Caminho para a imagem do logo 
const LOGO_IMAGE = require('../../../assets/images/logo.png');

// Ajuste estes caminhos conforme a sua estrutura de pastas reais
import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';
import { styles, COLORS } from '../../../styles/_HomeStyles'; 
import { Servico, SERVICOS_MENU_LATERAL, SERVICOS_DESTAQUE } from '../../../src/constants/services';
import { formatCurrency } from '../../../src/utils/formatters'; 


// =========================================================================
// MOCKS / DADOS E ROTAS (ATUALIZADOS)
// =========================================================================
const getDashboardData = () => ({
    // Mantemos os valores para o saldo, mas ignoramos a dívida no UI.
    saldoDisponivel: 150000.00,
    dividasPendentes: 0, // Definido como 0 para cumprir a regra de "sem dívida"
    totalDivida: 0.00,
});

const SERVICO_ROTAS_DIRETAS: { [key: string]: string } = {
    'Propina': '/telas/servicos/Propina',
    'Taxa de Inscrição': '/telas/servicos/TaxaInscricao',
    'Declaração com Notas': '/telas/servicos/DeclaracaoNota',
    'Declaração sem Notas': '/telas/servicos/DeclaracaoSemNota',
    'Folha de Prova': '/telas/servicos/FolhadeProva',
    'Reconfirmação de Matrícula': '/telas/servicos/Reconfirmacaomatricula',
    'Pagar Agora': '/telas/ServicoPagamento/ServicoPagamentoScreen', 
    'Perfil': '/telas/perfil/PerfilScreen',
    'Histórico': '/telas/historico/HistoricoScreen',
    'Leitor QR': '/telas/qrcode/QRCodeReader',
    'Ajuda': '/telas/ajuda/AjudaScreen',
    'Carteira': '/telas/financeiro/CarteiraScreen', 
};
const FALLBACK_PAGAMENTO_PATH = '/telas/ServicoPagamento/ServicoPagamentoScreen';


const ATALHOS_RAPIDOS = [
    { id: '4', name: 'Carteira', icon: 'credit-card', route: SERVICO_ROTAS_DIRETAS['Carteira'] || '' }, 
    { id: '1', name: 'Histórico', icon: 'history', route: SERVICO_ROTAS_DIRETAS['Histórico'] || '' },
    { id: '2', name: 'Leitor QR', icon: 'qrcode', route: SERVICO_ROTAS_DIRETAS['Leitor QR'] || '' },
    { id: '3', name: 'Ajuda', icon: 'support', route: SERVICO_ROTAS_DIRETAS['Ajuda'] || '' },
];


// =========================================================================
// COMPONENTES AUXILIARES 
// =========================================================================

// Cartão de Destaque (Layout de 3 Colunas)
const ServiceCard: React.FC<{ servico: Servico; onPress: (servico: Servico) => void; isDarkMode: boolean }> = ({ servico, onPress, isDarkMode }) => (
    <TouchableOpacity 
        style={styles.card(isDarkMode)} 
        onPress={() => onPress(servico)}
        activeOpacity={0.7}
    >
        <View style={styles.cardIconContainer(isDarkMode)}>
            <FontAwesome name={servico.icon} size={28} color={COLORS.primary} /> 
        </View>
        <Text style={styles.cardTitle(isDarkMode)} numberOfLines={1}>{servico.nome}</Text>
    </TouchableOpacity>
);

// Cartão de Acesso Rápido (Horizontal Scroll)
const QuickAccessCard: React.FC<{ icon: string; name: string; onPress: () => void; isDarkMode: boolean }> = ({ icon, name, onPress, isDarkMode }) => (
    <TouchableOpacity
        style={styles.quickAccessCard(isDarkMode)}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <FontAwesome name={icon} size={22} color={COLORS.primary} />
        <Text style={styles.quickAccessText(isDarkMode)} numberOfLines={1}>{name}</Text>
    </TouchableOpacity>
);


// Sidebar
const Sidebar: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onServicoPress: (servico: Servico) => void; 
    logout: () => void; 
    isDarkMode: boolean;
}> = ({ isOpen, onClose, onServicoPress, logout, isDarkMode }) => {
    
    const { aluno } = useAuth();
    
    const windowWidth = Dimensions.get('window').width;
    const SIDEBAR_WIDTH = windowWidth * 0.75; 
    const rightOffset = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current; 

    useEffect(() => {
        Animated.timing(rightOffset, {
            toValue: isOpen ? 0 : -SIDEBAR_WIDTH, 
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [isOpen, rightOffset, SIDEBAR_WIDTH]);

    const handleLogout = () => {
        onClose();
        logout();
        router.replace('/telas/login/LoginScreen');
    };

    const renderItem = (servico: Servico) => (
        <TouchableOpacity 
            key={servico.id}
            style={styles.sidebarItem(isDarkMode)} 
            onPress={() => servico.nome === 'Logout' ? handleLogout() : onServicoPress(servico)}
            activeOpacity={0.6}
        >
            <FontAwesome name={servico.icon} size={20} color={servico.nome === 'Logout' ? COLORS.danger : styles.sidebarText(isDarkMode).color} style={{ width: 30 }} />
            <Text style={[styles.sidebarText(isDarkMode), servico.nome === 'Logout' && { color: COLORS.danger }]}>
                {servico.nome}
            </Text>
        </TouchableOpacity>
    );

    return (
        <>
            {isOpen && (
                <TouchableOpacity style={styles.sidebarOverlay} onPress={onClose} activeOpacity={1} />
            )}
            
            <Animated.View style={[
                styles.sidebar(isDarkMode, SIDEBAR_WIDTH), 
                { right: rightOffset }
            ]}>
                
                <View style={styles.sidebarHeader(isDarkMode)}>
                    <FontAwesome name="user-circle" size={40} color={COLORS.primary} />
                    <Text style={styles.sidebarHeaderText(isDarkMode)} numberOfLines={1}>{aluno?.nome || 'Utilizador'}</Text>
                    <Text style={styles.sidebarHeaderSubtitle(isDarkMode)}>{aluno?.nr_estudante || 'Sem ID'}</Text>
                </View>

                <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
                    {SERVICOS_MENU_LATERAL
                        .filter(s => s.nome !== 'Logout') 
                        .map(renderItem)}
                    
                    <View style={styles.sidebarFooter}>
                         {SERVICOS_MENU_LATERAL
                            .filter(s => s.nome === 'Logout')
                            .map(renderItem)}
                    </View>
                </ScrollView>
                
            </Animated.View>
        </>
    );
};


// =========================================================================
// TELA PRINCIPAL (HomeScreen)
// =========================================================================
export default function HomeScreen() {
    const { aluno, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const dashboardData = getDashboardData(); 

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    
    const handleServicoPress = (servico: Servico) => {
        setIsSidebarOpen(false); 

        const targetPath = SERVICO_ROTAS_DIRETAS[servico.nome];
        
        if (servico.nome === 'Logout') {
            logout();
            router.replace('/telas/login/LoginScreen');
            return;
        }

        if (targetPath) {
            router.push({
                pathname: targetPath,
                params: { 
                    servico: JSON.stringify(servico),
                },
            });
        } else {
            router.push(FALLBACK_PAGAMENTO_PATH); 
        }
    };
    
    const handleQuickAccessPress = (route: string) => {
         setIsSidebarOpen(false); 
         if (route) {
            router.push(route);
         }
    };

    const handlePagarAgoraPress = () => {
        // Redireciona para a tela de pagamento principal (Propina/Taxas)
        router.push(FALLBACK_PAGAMENTO_PATH);
    };

    return (
        <SafeAreaView style={styles.safeArea(isDarkMode)}>
            <StatusBar 
                barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
                backgroundColor={isDarkMode ? COLORS.darkBackground : COLORS.lightBackground} 
            />

            {/* HEADER */}
            <View style={styles.header(isDarkMode)}>
                <View style={styles.logoAndGreetingContainer}> 
                    <View style={styles.logoContainer}>
                        <Image 
                            source={LOGO_IMAGE} 
                            style={styles.logoImage} 
                            resizeMode="contain" 
                        />
                    </View>
                    <Text style={styles.greetingText(isDarkMode)} numberOfLines={1}>
                        Olá, {aluno?.nome?.split(' ')[0] || 'Estudante'}!
                    </Text>
                </View>
                
                <View style={styles.headerRightButtons}>
                    <TouchableOpacity onPress={toggleTheme} style={styles.headerButton}>
                        <Ionicons 
                            name={isDarkMode ? "sunny" : "moon"} 
                            size={26} 
                            color={styles.sectionTitle(isDarkMode).color} 
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={toggleSidebar} style={styles.headerButton}>
                        <Ionicons 
                            name="menu" 
                            size={30} 
                            color={styles.sectionTitle(isDarkMode).color} 
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* CONTEÚDO SCROLLABLE */}
            <ScrollView 
                contentContainerStyle={styles.contentContainer(isDarkMode)}
                showsVerticalScrollIndicator={false}
            >
                
                {/* Saldo Disponível (Cartão Principal em Destaque) */}
                <View style={styles.saldoContainer(isDarkMode)}>
                    <View style={styles.balanceHeader}>
                        <Text style={styles.saldoTitle(isDarkMode)}>Saldo Disponível</Text>
                        <Ionicons name="eye-off-outline" size={20} color={isDarkMode ? COLORS.subText : COLORS.gray} />
                    </View>
                    
                    <Text style={styles.saldoValue(isDarkMode)}>{formatCurrency(dashboardData.saldoDisponivel)}</Text>
                    
                    {/* ❌ Secção de Dívida Removida */}


                    <TouchableOpacity style={styles.payButton(isDarkMode)} onPress={handlePagarAgoraPress}>
                        <Text style={styles.payButtonText(isDarkMode)}>Pagar Propina e Taxas</Text>
                    </TouchableOpacity>
                </View>
                
                {/* SERVIÇOS EM DESTAQUE (3 Colunas Centralizadas e Responsivas) */}
                <View style={styles.sectionContainer(isDarkMode)}>
                    <Text style={styles.sectionTitle(isDarkMode)}>Acesso Rápido a Serviços</Text>
                    <View style={styles.highlightServicesGrid}> 
                        {SERVICOS_DESTAQUE.slice(0, 3).map((servico) => ( 
                            <ServiceCard 
                                key={servico.id}
                                servico={servico}
                                onPress={handleServicoPress}
                                isDarkMode={isDarkMode}
                            />
                        ))}
                    </View>
                </View>
                
                {/* OUTROS ATALHOS (Scroll Horizontal com Carteira) */}
                <View style={styles.sectionContainer(isDarkMode)}>
                    <Text style={styles.sectionTitle(isDarkMode)}>Outros Atalhos</Text>
                    
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.quickAccessScrollContainer} 
                    >
                        {ATALHOS_RAPIDOS.map((atalho) => (
                            <QuickAccessCard
                                key={atalho.id}
                                icon={atalho.icon}
                                name={atalho.name}
                                onPress={() => handleQuickAccessPress(atalho.route)}
                                isDarkMode={isDarkMode}
                            />
                        ))}
                    </ScrollView>
                </View>

            </ScrollView>

            {/* BARRA LATERAL */}
            <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={toggleSidebar} 
                onServicoPress={handleServicoPress} 
                logout={logout} 
                isDarkMode={isDarkMode}
            />
        </SafeAreaView>
    );
}
