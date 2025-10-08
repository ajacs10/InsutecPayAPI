// app/telas/home/HomeScreen.tsx
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
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';
import { useFinance } from '../../../components/FinanceContext'; // 🛑 Importado useFinance
import { styles, COLORS } from '../../../styles/_HomeStyles';
import { formatCurrency } from '../../../src/utils/formatters';
import { Servico } from '../../../src/types';

const LOGO_IMAGE = require('../../../assets/images/logo.png');
const FALLBACK_PAGAMENTO_PATH = '/telas/ServicoPagamento/ServicoPagamentoScreen';

// Rotas Diretas Mapeadas
const SERVICO_ROTAS_DIRETAS: { [key: string]: string } = {
    Propina: '/telas/servicos/Propina',
    'Declaração com Notas': '/telas/servicos/DeclaracaoNota',
    'Declaração sem Notas': '/telas/servicos/DeclaracaoSemNota',
    'Folha de Prova': '/telas/servicos/FolhadeProva',
    'Reconfirmação de Matrícula': '/telas/servicos/Reconfirmacaumatricula',
    Perfil: '/telas/perfil/PerfilScreen',
    Histórico: '/telas/historico/HistoricoScreen',
    Carteira: '/telas/financeiro/CarteiraScreen',
    Comprovativo: '/telas/comprovativo/ComprovativoScreen',
    'Sobre o App': '/telas/sobre/SobreScreen',
    'Contactar Suporte': '/telas/suporte/SuporteScreen',
    Ajuda: '/telas/verAjuda/verAjudaScreen', 
    Logout: '/telas/login/LoginScreen',
};

// Menu Lateral
const SERVICOS_MENU_LATERAL: Servico[] = [
    { id: '1', nome: 'Propina', icon: 'money', isMenu: true },
    { id: '3', nome: 'Reconfirmação de Matrícula', icon: 'calendar-check-o', isMenu: true },
    { id: '4', nome: 'Carteira', icon: 'credit-card', isMenu: true },
    { id: '5', nome: 'Histórico', icon: 'history', isMenu: true },
    { id: '6', nome: 'Comprovativo', icon: 'file-text-o', isMenu: true },
    { id: '7', nome: 'Perfil', icon: 'user', isMenu: true },
    { id: '8', nome: 'Ajuda', icon: 'support', isMenu: true },
    { id: '10', nome: 'Sobre o App', icon: 'info-circle', isMenu: true },
    { id: '11', nome: 'Contactar Suporte', icon: 'phone', isMenu: true },
    { id: '99', nome: 'Logout', icon: 'sign-out', isMenu: true, isDestructive: true },
];

const SERVICOS_DESTAQUE: Servico[] = [
    { id: '1', nome: 'Propina', icon: 'money' },
    { id: '2', nome: 'Declaração com Notas', icon: 'file-text' },
    { id: '3', nome: 'Declaração sem Notas', icon: 'file-o' },
    { id: '4', nome: 'Folha de Prova', icon: 'book' },
];

// --- FUNÇÕES AUXILIARES ---
const getInitials = (name: string | undefined): string => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0][0].toUpperCase();
};

// --- COMPONENTES AUXILIARES ---
const ServiceListItem: React.FC<{ servico: Servico; onPress: (servico: Servico) => void; isDarkMode: boolean }> =
    React.memo(({ servico, onPress, isDarkMode }) => (
        <TouchableOpacity
            style={styles.serviceListItem({ isDarkMode })}
            onPress={() => onPress(servico)}
            activeOpacity={0.7}
        >
            <View style={styles.serviceListIconContainer({ isDarkMode })}>
                <FontAwesome name={servico.icon} size={24} color={COLORS.accent} />
            </View>
            <Text style={styles.serviceListTitle({ isDarkMode })} numberOfLines={1}>{servico.nome}</Text>
            <Ionicons name="chevron-forward" size={20} color={isDarkMode ? COLORS.subText : COLORS.gray} />
        </TouchableOpacity>
    ));

const MenuOptions: React.FC<{ onClose: () => void }> = ({ onClose }) => {
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
            router.push(SERVICO_ROTAS_DIRETAS[pathKey]);
        }
        onClose();
    };

    return (
        <View style={styles.menuContainer}>
            {['Histórico', 'Regulamento', 'Ajuda'].map((action, index) => (
                <TouchableOpacity
                    key={action}
                    style={[styles.menuItem, index === 2 && styles.lastMenuItem]}
                    onPress={() => handleAction(action)}
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
                    <Text style={styles.menuItemText}>Ver {action === 'Regulamento' ? 'Regulamento' : action}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

// CORREÇÃO CRÍTICA: Sidebar como componente separado com hooks próprios
const SidebarContent: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onServicoPress: (servico: Servico) => void;
    logout: () => Promise<void>;
    isDarkMode: boolean;
    services: Servico[];
}> = ({ isOpen, onClose, onServicoPress, logout, isDarkMode, services }) => {
    // HOOKS DO SIDEBAR - separados do HomeScreen
    const { aluno } = useAuth();
    const windowWidth = Dimensions.get('window').width;
    const SIDEBAR_WIDTH = windowWidth * 0.75;
    
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
            await logout();
            onClose();
        } catch (error) {
            console.error('[Sidebar] Erro no logout:', error);
        }
    }, [logout, onClose]);

    const renderItem = useCallback(
        (servico: Servico) => (
            <TouchableOpacity
                key={servico.id}
                style={styles.sidebarItem({ isDarkMode })}
                onPress={() => (servico.nome === 'Logout' ? handleLogout() : onServicoPress(servico))}
                activeOpacity={0.6}
            >
                <FontAwesome
                    name={servico.icon}
                    size={20}
                    color={servico.nome === 'Logout' ? COLORS.danger : styles.sidebarText({ isDarkMode }).color}
                    style={{ width: 30 }}
                />
                <Text
                    style={[styles.sidebarText({ isDarkMode }), servico.nome === 'Logout' && { color: COLORS.danger }]}
                >
                    {servico.nome}
                </Text>
            </TouchableOpacity>
        ),
        [isDarkMode, handleLogout, onServicoPress]
    );

    return (
        <>
            {isOpen && (
                <TouchableOpacity
                    style={styles.sidebarOverlay}
                    onPress={onClose}
                    activeOpacity={1}
                />
            )}
            <Animated.View style={[styles.sidebar({ isDarkMode, width: SIDEBAR_WIDTH }), { transform: [{ translateX: leftOffset }] }]}>
                <View style={styles.sidebarHeader({ isDarkMode })}>
                    <View style={styles.sidebarAvatar({ isDarkMode })}>
                        <Text style={styles.sidebarAvatarText({ isDarkMode })}>{getInitials(aluno?.nome)}</Text>
                    </View>
                    <Text style={styles.sidebarHeaderText({ isDarkMode })} numberOfLines={1}>
                        {aluno?.nome || 'Utilizador'}
                    </Text>
                    <Text style={styles.sidebarHeaderSubtitle({ isDarkMode })}>{aluno?.nr_estudante || 'Sem ID'}</Text>
                </View>
                
                <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
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
    // TODOS OS HOOKS PRIMEIRO - SEM NENHUM RETORNO ANTECIPADO
    const { aluno, signOut: logout } = useAuth();
    const { isDarkMode } = useTheme(); 
    // 🛑 Pegando resetSaldo
    const { saldo, resetSaldo } = useFinance(); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    // Efeitos após todos os hooks
    useEffect(() => {
        setIsSidebarOpen(false);
        setShowMenu(false);
        
        // Verificação de autenticação sem retorno antecipado
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

    // Handlers - sempre depois dos hooks
    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen((prev) => !prev);
        setShowMenu(false); 
    }, []);

    const toggleMenu = useCallback(() => {
        setShowMenu((prev) => !prev);
        setIsSidebarOpen(false); 
    }, []);

    const handleMainServicoPress = useCallback((servico: Servico) => {
        const targetPath = SERVICO_ROTAS_DIRETAS[servico.nome];
        if (targetPath) {
            router.push({
                pathname: targetPath,
                params: { servico: JSON.stringify(servico) },
            });
        } else {
            router.push(FALLBACK_PAGAMENTO_PATH);
        }
        setIsSidebarOpen(false);
        setShowMenu(false);
    }, []);

    const handleSidebarServicoPress = useCallback((servico: Servico) => {
        setIsSidebarOpen(false);
        const targetPath = SERVICO_ROTAS_DIRETAS[servico.nome];
        if (targetPath) {
            router.push({
                pathname: targetPath,
                params: { servico: JSON.stringify(servico) },
            });
        } else {
            router.push(FALLBACK_PAGAMENTO_PATH);
        }
    }, []);

    // Dados processados APÓS hooks
    const firstName = aluno?.nome?.split(' ')[0] || 'Utilizador';
    const currentDate = new Date().toLocaleString('pt-AO', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

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

    // CORREÇÃO: Loading state como parte normal do render
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

    // RENDER PRINCIPAL - APÓS TODOS OS HOOKS E VERIFICAÇÕES
    return (
        <SafeAreaView style={memoizedStyles.safeArea}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor="transparent"
                translucent={true} 
            />
            
            {/* Header */}
            <View style={[
                memoizedStyles.header, 
                styles.headerAndroidPadding 
            ]}>
                <View style={styles.logoAndGreetingContainer}>
                    <View style={styles.logoContainer}>
                        <Image source={LOGO_IMAGE} style={styles.logoImage} resizeMode="contain" />
                    </View>
                    
                    <View>
                        <Text style={styles.appGreeting({ isDarkMode })} numberOfLines={1}>
                            Olá, {firstName}
                        </Text>
                        <Text style={styles.dateText({ isDarkMode })} numberOfLines={1}>
                            INSU TEC PAY | {currentDate}
                        </Text>
                    </View>
                </View>
                <View style={styles.headerRightButtons}>
                    <TouchableOpacity onPress={toggleSidebar} style={styles.headerButton}>
                        <Ionicons name="menu" size={30} color={styles.sectionTitle({ isDarkMode }).color} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleMenu} style={styles.headerButton}>
                        <Ionicons name="ellipsis-vertical-outline" size={30} color={styles.sectionTitle({ isDarkMode }).color} />
                    </TouchableOpacity>
                </View>
            </View>

            {showMenu && <MenuOptions onClose={toggleMenu} />}
            
            <ScrollView 
                style={{ flex: 1, backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground }} 
                contentContainerStyle={memoizedStyles.contentContainer} 
                showsVerticalScrollIndicator={false}
            >
                
                {/* Saldo/Wallet */}
                <View style={memoizedStyles.saldoContainer}>
                    <Text style={styles.paymentSubtitle({ isDarkMode })}>Pagamento de Serviços Universitários</Text>
                    <View style={styles.balanceHeader}>
                        <Text style={styles.saldoTitle({ isDarkMode })}>Saldo Disponível</Text>
                        <Ionicons name="eye-off-outline" size={20} color={isDarkMode ? COLORS.subText : COLORS.gray} />
                    </View>
                    <Text style={styles.saldoValue({ isDarkMode })}>{formatCurrency(saldo)}</Text>
                    <TouchableOpacity 
                        style={styles.payButton({ isDarkMode })} 
                        onPress={() => handleMainServicoPress(SERVICOS_DESTAQUE[0])}
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
                
                {/* 🛑 BOTÃO DE RESET TEMPORÁRIO AQUI */}
                <TouchableOpacity 
                    onPress={resetSaldo} 
                    style={{ 
                        backgroundColor: COLORS.danger, 
                        padding: 15, 
                        borderRadius: 8, 
                        margin: 20, 
                        alignItems: 'center' 
                    }}
                >
                    <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>
                        CLIQUE AQUI PARA OBTER $5$ BILHÕES (REMOVER DEPOIS)
                    </Text>
                </TouchableOpacity>
                {/* 🛑 FIM DO BOTÃO TEMPORÁRIO */}


                <View style={{ height: 80 }} />
            </ScrollView>

            {/* Navegação Inferior */}
            <View style={memoizedStyles.bottomNavBar}>
                <TouchableOpacity style={styles.navBarItem} onPress={() => router.push('/telas/home/HomeScreen')}>
                    <Ionicons name="home" size={26} color={COLORS.primary} />
                    <Text style={[styles.navBarText({ isDarkMode }), { color: COLORS.primary }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navBarItem} onPress={() => handleMainServicoPress(SERVICOS_MENU_LATERAL[2])}>
                    <Ionicons name="wallet-outline" size={26} color={isDarkMode ? COLORS.textLight : COLORS.gray} />
                    <Text style={styles.navBarText({ isDarkMode })}>Carteira</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navBarItem} onPress={() => handleMainServicoPress(SERVICOS_MENU_LATERAL[5])}>
                    <Ionicons name="person-outline" size={26} color={isDarkMode ? COLORS.textLight : COLORS.gray} />
                    <Text style={styles.navBarText({ isDarkMode })}>Perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navBarItem} onPress={() => handleMainServicoPress(SERVICOS_MENU_LATERAL[3])}>
                    <Ionicons name="time-outline" size={26} color={isDarkMode ? COLORS.textLight : COLORS.gray} />
                    <Text style={styles.navBarText({ isDarkMode })}>Histórico</Text>
                </TouchableOpacity>
            </View>

            {/* Sidebar - Componente separado com hooks próprios */}
            <SidebarContent
                isOpen={isSidebarOpen}
                onClose={toggleSidebar}
                onServicoPress={handleSidebarServicoPress}
                logout={logout}
                isDarkMode={isDarkMode}
                services={SERVICOS_MENU_LATERAL}
            />
        </SafeAreaView>
    );
}
