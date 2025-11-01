import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    StatusBar,
    Image,
    ActivityIndicator,
    Animated,
    Easing,
    Alert,
    Platform
} from 'react-native';

// Importações relativas
import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';
import { useFinance } from '../../../components/FinanceContext';
import { styles, COLORS } from '../../../styles/_HomeStyles';
import { formatCurrency } from '../../../src/utils/formatters';
import { Servico } from '../../../src/types';

const LOGO_IMAGE = require('../../../assets/images/logo.png');
const FALLBACK_PAGAMENTO_PATH = '/telas/ServicoPagamento/ServicoPagamentoScreen';

// --- Mapeamento de Rotas (Inalterado) ---
const SERVICO_ROTAS_DIRETAS: { [key: string]: string } = {
    Home: '/telas/home/HomeScreen',
    Propina: '/telas/servicos/Propina',
    'Declaração com Notas': '/telas/servicos/DeclaracaoNota',
    'Declaração sem Notas': '/telas/servicos/DeclaracaoSemNota',
    'Folha de Prova': '/telas/servicos/FolhadeProva',
    'Reconfirmação de Matrícula': '/telas/servicos/Reconfirmacaumatricula',
    Perfil: '/telas/perfil/PerfilScreen',
    Histórico: '/telas/historico/HistoricoScreen',
    Carteira: '/telas/financeiro/CarteiraScreen',
    Comprovativo: '/telas/comprovativo/ComprovativoScreen',
    'Sobre o App': '/telas/termos/SobreScreen',
    'Contactar Suporte': '/telas/verAjuda/verAjudaScreen',
    Ajuda: '/telas/verAjuda/verAjudaScreen',
    Logout: '/telas/login/LoginScreen',
};

// Menu Lateral (Inalterado)
const SERVICOS_MENU_LATERAL: Servico[] = [
    { id: '1', nome: 'Propina', icon: 'money', isMenu: true },
    { id: '3', nome: 'Reconfirmação de Matrícula', icon: 'calendar-check-o', isMenu: true },
    { id: '4', nome: 'Carteira', icon: 'credit-card', isMenu: true },
    { id: '5', nome: 'Histórico', icon: 'history', isMenu: true },
    { id: '6', nome: 'Comprovativo', icon: 'file-text-o', isMenu: true },
    { id: '7', nome: 'Perfil', icon: 'user', isMenu: true },
    { id: '8', nome: 'Ajuda', icon: 'question-circle', isMenu: true },
    { id: '10', nome: 'Sobre o App', icon: 'info-circle', isMenu: true },
    { id: '11', nome: 'Contactar Suporte', icon: 'phone', isMenu: true },
    { id: '99', nome: 'Logout', icon: 'sign-out', isMenu: true, isDestructive: true },
];

// Serviços de Destaque (Inalterado)
const SERVICOS_DESTAQUE: Servico[] = [
    { id: '1', nome: 'Propina', icon: 'money' },
    { id: '2', nome: 'Declaração com Notas', icon: 'file-text' },
    { id: '3', nome: 'Declaração sem Notas', icon: 'file-o' },
    { id: '4', nome: 'Folha de Prova', icon: 'book' },
];

// --- FUNÇÕES AUXILIARES (Inalterado) ---
const getInitials = (name: string | undefined): string => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0][0].toUpperCase();
};

// --- COMPONENTES AUXILIARES (Refinados) ---
const ServiceListItem: React.FC<{ servico: Servico; onPress: (servico: Servico) => void; isDarkMode: boolean }> =
    React.memo(({ servico, onPress, isDarkMode }) => (
        <TouchableOpacity
            style={styles.serviceListItem({ isDarkMode })}
            onPress={() => onPress(servico)}
            activeOpacity={0.6} // Feedback de clique mais suave
        >
            <View style={styles.serviceListIconContainer({ isDarkMode })}>
                <FontAwesome name={servico.icon as any} size={24} color={COLORS.accent} />
            </View>
            <Text style={styles.serviceListTitle({ isDarkMode })} numberOfLines={1}>{servico.nome}</Text>
            <Ionicons name="chevron-forward" size={20} color={isDarkMode ? COLORS.subText : COLORS.gray} />
        </TouchableOpacity>
    ));

// MenuOptions (Inalterado, apenas usa `activeOpacity`)
const MenuOptions: React.FC<{ onClose: () => void; isDarkMode: boolean }> = ({ onClose, isDarkMode }) => {
    const handleAction = (action: string) => {
        let pathKey: string = '';
        if (action === 'Histórico') {
            pathKey = 'Histórico';
        } else if (action === 'Regulamento') {
            pathKey = 'Sobre o App';
        } else if (action === 'Ajuda') {
            pathKey = 'Ajuda';
        }

        if (pathKey && SERVICO_ROTAS_DIRETAS[pathKey]) {
            router.push(SERVICO_ROTAS_DIRETAS[pathKey] as any);
        }
        onClose();
    };

    return (
        <View style={styles.menuContainer(isDarkMode)}>
            {['Histórico', 'Regulamento', 'Ajuda'].map((action, index) => (
                <TouchableOpacity
                    key={action}
                    style={[styles.menuItem(isDarkMode), index === 2 && styles.lastMenuItem]}
                    onPress={() => handleAction(action)}
                    activeOpacity={0.7} // Feedback de clique
                >
                    <Ionicons 
                        name={
                            action === 'Histórico' 
                            ? 'time-outline' 
                            : action === 'Regulamento' 
                            ? 'document-text-outline' 
                            : 'help-circle-outline'
                        } 
                        size={20} 
                        color={COLORS.primary} 
                    />
                   <Text style={styles.menuItemText(isDarkMode)}>Ver {action === 'Regulamento' ? 'Sobre' : action}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

// SidebarContent (Melhorado para Responsividade e Feedback)
const SidebarContent: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    logout: () => Promise<void>;
    isDarkMode: boolean;
    services: Servico[];
}> = ({ isOpen, onClose, logout, isDarkMode, services }) => {
    const { aluno } = useAuth();
    
    // Responsividade: Sidebar ocupa 75% da largura da tela, no máximo 350px
    const windowWidth = Dimensions.get('window').width;
    const SIDEBAR_WIDTH = Math.min(windowWidth * 0.75, 350); 
    
    const leftOffset = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

    useEffect(() => {
        Animated.timing(leftOffset, {
            toValue: isOpen ? 0 : -SIDEBAR_WIDTH,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, [isOpen, leftOffset, SIDEBAR_WIDTH]);

    const handleLogout = useCallback(async () => {
        try {
            onClose();
            // Pequeno delay para a animação de fecho do menu
            setTimeout(async () => {
                await logout();
            }, 150); 
        } catch (error) {
            console.error('[Sidebar] Erro no logout:', error);
            Alert.alert('Erro', 'Não foi possível fazer logout');
            onClose();
        }
    }, [logout, onClose]);

    const handleServicoPress = useCallback((servico: Servico) => {
        
        if (servico.nome === 'Logout') {
            Alert.alert(
                'Confirmação',
                'Tem certeza que deseja sair da sua conta?',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Sair', onPress: handleLogout, style: 'destructive' },
                ]
            );
            return;
        }

        const targetPath = SERVICO_ROTAS_DIRETAS[servico.nome];
        
        if (targetPath) {
            onClose(); // Fecha sidebar primeiro
            router.push(targetPath as any);
        } else {
            Alert.alert('Aviso', `Funcionalidade "${servico.nome}" em desenvolvimento`);
            onClose();
        }
    }, [handleLogout, onClose]);

    const renderItem = useCallback(
        (servico: Servico) => (
            <TouchableOpacity
                key={servico.id}
                style={styles.sidebarItem({ isDarkMode })}
                onPress={() => handleServicoPress(servico)}
                activeOpacity={0.7} // Feedback de clique
            >
                <FontAwesome
                    name={servico.icon as any}
                    size={20}
                    color={servico.nome === 'Logout' ? COLORS.danger : styles.sidebarText({ isDarkMode }).color}
                    style={{ width: 30 }}
                />
                <Text
                    style={[styles.sidebarText({ isDarkMode }), servico.nome === 'Logout' && { color: COLORS.danger, fontWeight: '800' }]}
                >
                    {servico.nome}
                </Text>
            </TouchableOpacity>
        ),
        [isDarkMode, handleServicoPress]
    );

    return (
        <>
            {/* Overlay: Fecha a sidebar ao clicar fora, mas é "box-none" para permitir cliques na sidebar */}
            {isOpen && (
                <TouchableOpacity
                    style={styles.sidebarOverlay}
                    onPress={onClose}
                    activeOpacity={1}
                    pointerEvents="box-none"
                />
            )}
            
            <Animated.View 
                style={[
                    styles.sidebar({ isDarkMode, width: SIDEBAR_WIDTH }), 
                    { transform: [{ translateX: leftOffset }] }
                ]}
            >
                <View style={styles.sidebarHeader({ isDarkMode })}>
                    <TouchableOpacity 
                        onPress={() => handleServicoPress({ id: '7', nome: 'Perfil', icon: 'user' })}
                        activeOpacity={0.7}
                    >
                        <View style={styles.sidebarAvatar({ isDarkMode })}>
                            <Text style={styles.sidebarAvatarText({ isDarkMode })}>{getInitials(aluno?.nome)}</Text>
                        </View>
                        <Text style={styles.sidebarHeaderText({ isDarkMode })} numberOfLines={1}>
                            {aluno?.nome || 'Utilizador'}
                        </Text>
                        <Text style={styles.sidebarHeaderSubtitle({ isDarkMode })}>{aluno?.nr_estudante || 'Sem ID'}</Text>
                    </TouchableOpacity>
                </View>
                
                <ScrollView 
                    contentContainerStyle={{ paddingVertical: 10 }}
                    showsVerticalScrollIndicator={false}
                >
                    {services.filter((s) => s.nome !== 'Logout').map(renderItem)}
                    <View style={styles.sidebarFooter}>
                        {services.filter((s) => s.nome === 'Logout').map(renderItem)}
                    </View>
                </ScrollView>
            </Animated.View>
        </>
    );
};

// --- TELA PRINCIPAL: HomeScreen ---
export default function HomeScreen() {
    const { aluno, signOut: logout } = useAuth();
    const { isDarkMode } = useTheme(); 
    const { saldo, resetSaldo } = useFinance(); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isBalanceVisible, setIsBalanceVisible] = useState(true); // Novo estado para visibilidade
    const pathname = usePathname();

    // Efeitos
    useEffect(() => {
        setIsSidebarOpen(false);
        setShowMenu(false);
        
        if (aluno === undefined) {
            setIsLoading(true);
            return;
        }
        
        if (!aluno) {
            const timer = setTimeout(() => {
                router.replace('/telas/login/LoginScreen');
            }, 0);
            setIsLoading(false);
            return () => clearTimeout(timer);
        }
        
        setIsLoading(false);
    }, [aluno, pathname]);

    // Handlers
    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen((prev) => !prev);
        setShowMenu(false); 
    }, []);

    const toggleMenu = useCallback(() => {
        setShowMenu((prev) => !prev);
        setIsSidebarOpen(false); 
    }, []);
    
    // Novo Handler para Alternar Visibilidade do Saldo
    const toggleBalanceVisibility = useCallback(() => {
        setIsBalanceVisible((prev) => !prev);
    }, []);

    const navigateToService = useCallback((servicoNome: string) => {
        const targetPath = SERVICO_ROTAS_DIRETAS[servicoNome];
        
        if (targetPath) {
            router.push(targetPath as any);
        } else {
            Alert.alert('Aviso', `Funcionalidade "${servicoNome}" em desenvolvimento`);
            if (servicoNome !== 'Home') {
                    router.push(FALLBACK_PAGAMENTO_PATH as any);
            }
        }
        setIsSidebarOpen(false);
        setShowMenu(false);
    }, []);

    const handleMainServicoPress = useCallback((servico: Servico) => navigateToService(servico.nome), [navigateToService]);
    const handleBottomNavPress = useCallback((servicoNome: string) => navigateToService(servicoNome), [navigateToService]);

    // Dados processados
    const firstName = aluno?.nome?.split(' ')[0] || 'Utilizador';
    const currentDate = useMemo(() => new Date().toLocaleString('pt-AO', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }), []);

    // Memoized Styles (mantido para otimização, mas a lógica de estilos foi ajustada no .ts)
    const memoizedStyles = useMemo(
        () => ({
            header: styles.header({ isDarkMode }),
            safeArea: styles.safeArea({ isDarkMode }),
            contentContainer: styles.contentContainer({ isDarkMode }),
            saldoContainer: styles.saldoContainer({ isDarkMode }),
            sectionContainer: styles.sectionContainer({ isDarkMode }),
            serviceListContainer: styles.serviceListContainer({ isDarkMode }),
            bottomNavBar: styles.bottomNavBar({ isDarkMode }),
        }),
        [isDarkMode]
    );

    // Loading state (Inalterado)
    if (isLoading || !aluno) {
        return (
            <View style={{ 
                flex: 1, 
                backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground, 
                justifyContent: 'center', 
                alignItems: 'center' 
            }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ 
                    color: isDarkMode ? COLORS.textLight : COLORS.textDark, 
                    marginTop: 10 
                }}>
                    {isLoading ? 'A verificar autenticação...' : 'Redirecionando para login...'}
                </Text>
            </View>
        );
    }

    // RENDER PRINCIPAL
    return (
        <SafeAreaView style={memoizedStyles.safeArea}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor="transparent"
                translucent={true} 
            />
            
            {/* Header (Inalterado) */}
            <View style={[
                memoizedStyles.header, 
                styles.headerAndroidPadding 
            ]}>
                <View style={styles.logoAndGreetingContainer}>
                    <View style={styles.logoContainer}>
                        <Image source={LOGO_IMAGE} style={styles.logoImage} resizeMode="contain" />
                    </View>
                    
                    <View style={styles.greetingTextWrapper}> {/* Novo wrapper para flexibilidade */}
                        <Text style={styles.appGreeting({ isDarkMode })} numberOfLines={1}>
                            Olá, {firstName}
                        </Text>
                        <Text style={styles.dateText({ isDarkMode })} numberOfLines={1}>
                            INSU TEC PAY | {currentDate}
                        </Text>
                    </View>
                </View>
                <View style={styles.headerRightButtons}>
                    <TouchableOpacity 
                        onPress={toggleSidebar} 
                        style={styles.headerButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="menu" size={30} color={isDarkMode ? COLORS.textLight : COLORS.textDark} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={toggleMenu} 
                        style={styles.headerButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="ellipsis-vertical-outline" size={30} color={isDarkMode ? COLORS.textLight : COLORS.textDark} />
                    </TouchableOpacity>
                </View>
            </View>

            {showMenu && <MenuOptions onClose={toggleMenu} isDarkMode={isDarkMode} />}
            
            <ScrollView 
                style={{ 
                    flex: 1, 
                    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
                }} 
                contentContainerStyle={memoizedStyles.contentContainer} 
                showsVerticalScrollIndicator={false}
            >
                
                {/* Saldo/Wallet - COM INTERAÇÃO */}
                <View style={memoizedStyles.saldoContainer}>
                    <Text style={styles.paymentSubtitle({ isDarkMode })}>Pagamento de Serviços para Alunos</Text>
                    <View style={styles.balanceHeader}>
                        <Text style={styles.saldoTitle({ isDarkMode })}>Saldo Disponível</Text>
                        <TouchableOpacity 
                            onPress={toggleBalanceVisibility} 
                            activeOpacity={0.7}
                        >
                            <Ionicons 
                                name={isBalanceVisible ? 'eye-outline' : 'eye-off-outline'} 
                                size={22} 
                                color={isDarkMode ? COLORS.subText : COLORS.gray} 
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.saldoValue({ isDarkMode })}>
                        {isBalanceVisible ? formatCurrency(saldo) : '***,** Kz'} 
                    </Text>
                    <TouchableOpacity 
                        style={styles.payButton({ isDarkMode })} 
                        onPress={() => handleMainServicoPress(SERVICOS_DESTAQUE[0])}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.payButtonText({ isDarkMode })}>Pagar Propina</Text>
                    </TouchableOpacity>
                </View>

                {/* Serviços Essenciais */}
                <View style={memoizedStyles.sectionContainer}>
                    <Text style={styles.sectionTitle({ isDarkMode })}>Serviços Essenciais</Text>
                    <View style={memoizedStyles.serviceListContainer}>
                        {SERVICOS_DESTAQUE.map((servico) => (
                            <ServiceListItem
                                key={servico.id}
                                servico={servico}
                                onPress={handleMainServicoPress}
                                isDarkMode={isDarkMode}
                            />
                        ))}
                    </View>
                </View>
                
                {/* Botão de Reset Temporário (Inalterado) */}
                <TouchableOpacity 
                    onPress={resetSaldo} 
                    style={{ 
                        backgroundColor: COLORS.danger, 
                        padding: 15, 
                        borderRadius: 8, 
                        margin: 20, 
                        alignItems: 'center' 
                    }}
                    activeOpacity={0.7}
                >
                    <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>
                        CLIQUE AQUI PARA OBTER $5$ BILHÕES (REMOVER DEPOIS)
                    </Text>
                </TouchableOpacity>

                <View style={{ height: 80 }} />
            </ScrollView>

            {/* Navegação Inferior (Adicionado feedback ativo/inativo) */}
            <View style={memoizedStyles.bottomNavBar}>
                {/* Home */}
                <TouchableOpacity 
                    style={styles.navBarItem} 
                    onPress={() => handleBottomNavPress('Home')}
                    activeOpacity={0.7}
                >
                    <Ionicons 
                        name={pathname === SERVICO_ROTAS_DIRETAS.Home ? 'home' : 'home-outline'} 
                        size={26} 
                        color={pathname === SERVICO_ROTAS_DIRETAS.Home ? COLORS.primary : (isDarkMode ? COLORS.textLight : COLORS.gray)} 
                    />
                    <Text style={[
                        styles.navBarText({ isDarkMode }), 
                        { color: pathname === SERVICO_ROTAS_DIRETAS.Home ? COLORS.primary : (isDarkMode ? COLORS.textLight : COLORS.gray) }
                    ]}>Home</Text>
                </TouchableOpacity>
                {/* Carteira */}
                <TouchableOpacity 
                    style={styles.navBarItem} 
                    onPress={() => handleBottomNavPress('Carteira')}
                    activeOpacity={0.7}
                >
                    <Ionicons 
                        name={pathname === SERVICO_ROTAS_DIRETAS.Carteira ? 'wallet' : 'wallet-outline'} 
                        size={26} 
                        color={pathname === SERVICO_ROTAS_DIRETAS.Carteira ? COLORS.primary : (isDarkMode ? COLORS.textLight : COLORS.gray)} 
                    />
                    <Text style={[
                        styles.navBarText({ isDarkMode }), 
                        { color: pathname === SERVICO_ROTAS_DIRETAS.Carteira ? COLORS.primary : (isDarkMode ? COLORS.textLight : COLORS.gray) }
                    ]}>Carteira</Text>
                </TouchableOpacity>
                {/* Perfil */}
                <TouchableOpacity 
                    style={styles.navBarItem} 
                    onPress={() => handleBottomNavPress('Perfil')}
                    activeOpacity={0.7}
                >
                    <Ionicons 
                        name={pathname === SERVICO_ROTAS_DIRETAS.Perfil ? 'person' : 'person-outline'} 
                        size={26} 
                        color={pathname === SERVICO_ROTAS_DIRETAS.Perfil ? COLORS.primary : (isDarkMode ? COLORS.textLight : COLORS.gray)} 
                    />
                    <Text style={[
                        styles.navBarText({ isDarkMode }), 
                        { color: pathname === SERVICO_ROTAS_DIRETAS.Perfil ? COLORS.primary : (isDarkMode ? COLORS.textLight : COLORS.gray) }
                    ]}>Perfil</Text>
                </TouchableOpacity>
                {/* Histórico */}
                <TouchableOpacity 
                    style={styles.navBarItem} 
                    onPress={() => handleBottomNavPress('Histórico')}
                    activeOpacity={0.7}
                >
                    <Ionicons 
                        name={pathname === SERVICO_ROTAS_DIRETAS.Histórico ? 'time' : 'time-outline'} 
                        size={26} 
                        color={pathname === SERVICO_ROTAS_DIRETAS.Histórico ? COLORS.primary : (isDarkMode ? COLORS.textLight : COLORS.gray)} 
                    />
                    <Text style={[
                        styles.navBarText({ isDarkMode }), 
                        { color: pathname === SERVICO_ROTAS_DIRETAS.Histórico ? COLORS.primary : (isDarkMode ? COLORS.textLight : COLORS.gray) }
                    ]}>Histórico</Text>
                </TouchableOpacity>
            </View>

            {/* Sidebar */}
            <SidebarContent
                isOpen={isSidebarOpen}
                onClose={toggleSidebar}
                logout={logout}
                isDarkMode={isDarkMode}
                services={SERVICOS_MENU_LATERAL}
            />
        </SafeAreaView>
    );
}
