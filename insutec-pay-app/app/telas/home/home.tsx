import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
  Animated,
  Easing,
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets, EdgeInsets } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';

import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';
import { useFinance } from '../../../components/FinanceContext';
import { styles, COLORS } from '../../../styles/_HomeStyles';
import { formatCurrency } from '../../../src/utils/formatters';
import { Servico } from '../../../src/types';

const LOGO_IMAGE = require('../../../assets/images/logo.png');
const WINDOW_HEIGHT = Dimensions.get('window').height;

// Rotas diretas
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

// Serviços do menu lateral
const SERVICOS_MENU_LATERAL: Servico[] = [
  { id: '1', nome: 'Propina', icon: 'money-bill-wave', isMenu: true },
  { id: '2', nome: 'Declaração com Notas', icon: 'file-alt', isMenu: true },
  { id: '3', nome: 'Declaração sem Notas', icon: 'file', isMenu: true },
  { id: '4', nome: 'Folha de Prova', icon: 'book-open', isMenu: true },
  { id: '5', nome: 'Reconfirmação de Matrícula', icon: 'user-graduate', isMenu: true },
  { id: '6', nome: 'Comprovativo', icon: 'receipt', isMenu: true },
  { id: '7', nome: 'Perfil', icon: 'user', isMenu: true },
  { id: '8', nome: 'Carteira', icon: 'wallet', isMenu: true },
  { id: '9', nome: 'Histórico', icon: 'history', isMenu: true },
  { id: '10', nome: 'Ajuda', icon: 'question-circle', isMenu: true },
  { id: '11', nome: 'Sobre o App', icon: 'info-circle', isMenu: true },
  { id: '12', nome: 'Contactar Suporte', icon: 'headset', isMenu: true },
  { id: '99', nome: 'Logout', icon: 'sign-out-alt', isMenu: true, isDestructive: true },
];

// Serviços em destaque (hexagonos)
const SERVICOS_DESTAQUE: Servico[] = [
  { id: '1', nome: 'Propina', icon: 'money-bill-wave' },
  { id: '2', nome: 'Declaração com Notas', icon: 'file-alt' },
  { id: '3', nome: 'Declaração sem Notas', icon: 'file' },
  { id: '4', nome: 'Folha de Prova', icon: 'book-open' },
];

// Serviços rápidos (grid)
const SERVICOS_RAPIDOS: Servico[] = [
  { id: '5', nome: 'Reconfirmação', icon: 'user-graduate' },
  { id: '6', nome: 'Comprovativo', icon: 'receipt' },
  { id: '7', nome: 'Carteira', icon: 'wallet' },
  { id: '8', nome: 'Histórico', icon: 'history' },
];

// Função auxiliar
const getInitials = (name: string | undefined): string => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2 
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
};

// Componente de serviços rápidos em grid
const QuickServicesGrid = React.memo(({ services, onPress, isDarkMode }: {
  services: Servico[];
  onPress: (servico: Servico) => void;
  isDarkMode: boolean;
}) => {
  return (
    <View style={styles.quickServicesGrid}>
      {services.map((servico) => (
        <TouchableOpacity
          key={servico.id}
          style={styles.quickServiceItem({ isDarkMode })}
          onPress={() => onPress(servico)}
          activeOpacity={0.7}
        >
          <View style={styles.quickServiceIcon}>
            <FontAwesome5 
              name={servico.icon as any} 
              size={24} 
              color={COLORS.primary} 
            />
          </View>
          <Text style={styles.quickServiceText({ isDarkMode })}>
            {servico.nome}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

// Componente HexagonServices otimizado
const HexagonServices = React.memo(({ services, onPress, isDarkMode }: {
  services: Servico[];
  onPress: (servico: Servico) => void;
  isDarkMode: boolean;
}) => {
  const { width } = Dimensions.get('window');
  const isSmall = width < 375;
  const radius = isSmall ? 80 : 100;
  const hexSize = isSmall ? 70 : 90;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { 
          toValue: 1.05, 
          duration: 2000, 
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(pulseAnim, { 
          toValue: 1, 
          duration: 2000, 
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const Hexagon = ({ size, icon, innerText, onPress }: { 
    size: number; 
    icon: string; 
    innerText: string; 
    onPress: () => void;
  }) => {
    const path = `M${size * 0.5},0 L${size},${size * 0.25} L${size},${size * 0.75} L${size * 0.5},${size} L0,${size * 0.75} L0,${size * 0.25} Z`;
    const iconSize = size * 0.3;
    const textSize = size * 0.12;
    const centerX = size / 2;
    const centerY = size / 2;

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <Path d={path} fill={COLORS.white} />
            <Path d={path} fill="none" stroke={COLORS.primary} strokeWidth={2} />
            <G x={centerX - iconSize / 2} y={centerY - iconSize / 2 - textSize / 2}>
              <FontAwesome5 
                name={icon as any} 
                size={iconSize} 
                color={COLORS.primary} 
              />
            </G>
            <SvgText
              x={centerX}
              y={centerY + iconSize / 2 + textSize}
              fontSize={textSize}
              fill={COLORS.primary}
              fontWeight="600"
              textAnchor="middle"
            >
              {innerText.split(' ')[0]}
            </SvgText>
          </Svg>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.serviceListContainer({ isDarkMode })}>
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingVertical: 20,
      }}>
        {services.map((servico, index) => (
          <View key={servico.id} style={{ alignItems: 'center', marginVertical: 10 }}>
            <Hexagon
              size={hexSize}
              icon={servico.icon}
              innerText={servico.nome}
              onPress={() => onPress(servico)}
            />
            <Text style={{
              marginTop: 8,
              fontSize: 12,
              fontWeight: '600',
              color: isDarkMode ? COLORS.textLight : COLORS.black,
              textAlign: 'center',
              maxWidth: hexSize + 20,
            }}>
              {servico.nome}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});

// Componente Sidebar corrigido
const SidebarContent: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  logout: () => Promise<void>;
  isDarkMode: boolean;
  services: Servico[];
  insets: EdgeInsets;
}> = ({ isOpen, onClose, logout, isDarkMode, services, insets }) => {
  const { aluno } = useAuth();
  const windowWidth = Dimensions.get('window').width;
  const SIDEBAR_WIDTH = Math.min(windowWidth * 0.85, 400);

  const leftOffset = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(leftOffset, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(leftOffset, {
          toValue: -SIDEBAR_WIDTH,
          duration: 250,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, SIDEBAR_WIDTH]);

  const handleLogout = useCallback(async () => {
    try {
      onClose();
      await logout();
      router.replace('/telas/login/LoginScreen');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao sair. Tente novamente.');
    }
  }, [logout, onClose]);

  const handleServicoPress = useCallback((servico: Servico) => {
    if (servico.nome === 'Logout') {
      Alert.alert(
        'Sair da Conta',
        'Tem certeza que deseja sair?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sair', style: 'destructive', onPress: handleLogout },
        ],
        { cancelable: true }
      );
      return;
    }

    const targetPath = SERVICO_ROTAS_DIRETAS[servico.nome];
    if (targetPath) {
      onClose();
      router.push(targetPath as any);
    } else {
      Alert.alert('Em breve', `Funcionalidade "${servico.nome}" em desenvolvimento`);
      onClose();
    }
  }, [handleLogout, onClose]);

  const renderItem = useCallback((servico: Servico) => (
    <TouchableOpacity
      key={servico.id}
      style={styles.sidebarItem({ isDarkMode })}
      onPress={() => handleServicoPress(servico)}
      activeOpacity={0.7}
    >
      <FontAwesome5
        name={servico.icon as any}
        size={18}
        color={servico.isDestructive ? COLORS.danger : COLORS.primary}
        style={{ width: 30 }}
      />
      <Text
        style={[
          styles.sidebarText({ isDarkMode }),
          servico.isDestructive && { color: COLORS.danger, fontWeight: '700' }
        ]}
      >
        {servico.nome}
      </Text>
    </TouchableOpacity>
  ), [isDarkMode, handleServicoPress]);

  return (
    <View style={{ ...StyleSheet.absoluteFillObject, zIndex: 999 }}>
      <Animated.View
        style={[styles.sidebarOverlay, { opacity: overlayOpacity }]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <TouchableOpacity 
          style={{ flex: 1 }} 
          onPress={onClose} 
          activeOpacity={1}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.sidebar({ isDarkMode, width: SIDEBAR_WIDTH, insets }),
          { transform: [{ translateX: leftOffset }] }
        ]}
      >
        <View style={styles.sidebarHeader({ isDarkMode, insets })}>
          <TouchableOpacity onPress={() => handleServicoPress({ id: '7', nome: 'Perfil', icon: 'user' } as Servico)}>
            <View style={styles.sidebarAvatar({ isDarkMode })}>
              <Text style={styles.sidebarAvatarText({ isDarkMode })}>
                {getInitials(aluno?.nome_completo)}
              </Text>
            </View>
            <Text style={styles.sidebarHeaderText({ isDarkMode })} numberOfLines={1}>
              {aluno?.nome_completo || aluno?.nome || 'Utilizador'}
            </Text>
            <Text style={styles.sidebarHeaderSubtitle({ isDarkMode })}>
              {aluno?.nr_estudante || 'Sem ID'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={{ paddingVertical: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {services.filter(s => s.nome !== 'Logout').map(renderItem)}
          
          <View style={styles.sidebarFooter}>
            {services.filter(s => s.nome === 'Logout').map(renderItem)}
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

// Componente Principal HomeScreen
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { aluno, signOut: logout, loading: authLoading } = useAuth();
  const { isDarkMode } = useTheme();
  const { saldo } = useFinance();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const pathname = usePathname();

  // Redirecionamento seguro
  useEffect(() => {
    if (!authLoading && !aluno) {
      setShouldRedirect(true);
    }
  }, [authLoading, aluno]);

  useEffect(() => {
    if (shouldRedirect) {
      router.replace('/telas/login/LoginScreen');
    }
  }, [shouldRedirect]);

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const toggleBalanceVisibility = useCallback(() => setIsBalanceVisible(prev => !prev), []);

  const navigateToService = useCallback((servicoNome: string) => {
    const targetPath = SERVICO_ROTAS_DIRETAS[servicoNome];
    if (targetPath) {
      router.push(targetPath as any);
    } else {
      Alert.alert('Aviso', `Funcionalidade "${servicoNome}" em desenvolvimento`);
    }
    setIsSidebarOpen(false);
  }, []);

  const handleMainServicoPress = useCallback((servico: Servico) => navigateToService(servico.nome), [navigateToService]);
  const handleQuickServicoPress = useCallback((servico: Servico) => navigateToService(servico.nome), [navigateToService]);
  const handleBottomNavPress = useCallback((servicoNome: string) => navigateToService(servicoNome), [navigateToService]);

  // Dados do utilizador
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

  // Loading state
  if (authLoading) {
    return (
      <SafeAreaView style={styles.safeArea({ isDarkMode })}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ color: isDarkMode ? COLORS.subText : COLORS.gray, marginTop: 10 }}>
            A verificar autenticação...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Redirecionamento state
  if (!aluno || shouldRedirect) {
    return (
      <SafeAreaView style={styles.safeArea({ isDarkMode })}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ color: isDarkMode ? COLORS.subText : COLORS.gray, marginTop: 10 }}>
            A redirecionar...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea({ isDarkMode })} edges={['top', 'left', 'right']}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent" 
        translucent 
      />

      {/* Header */}
      <View style={[styles.header({ isDarkMode, insets }), styles.headerWithZIndex]}>
        <TouchableOpacity 
          style={styles.logoAndGreetingContainer} 
          onPress={toggleSidebar} 
          activeOpacity={0.8}
        >
          <View style={styles.logoContainer}>
            <Image source={LOGO_IMAGE} style={styles.logoImage} resizeMode="contain" />
          </View>
          <View style={styles.greetingTextWrapper}>
            <Text style={styles.appGreeting({ isDarkMode })} numberOfLines={1}>
              Olá, {firstName}
            </Text>
            <Text style={styles.dateText({ isDarkMode })} numberOfLines={1}>
              {currentDate}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleSidebar} activeOpacity={0.7}>
          <Ionicons 
            name="menu" 
            size={24} 
            color={isDarkMode ? COLORS.textLight : COLORS.black} 
          />
        </TouchableOpacity>
      </View>

      {/* Conteúdo Principal */}
      <ScrollView
        style={styles.mainScrollView({ isDarkMode, insets })}
        contentContainerStyle={styles.contentContainer({ isDarkMode, insets })}
        showsVerticalScrollIndicator={false}
      >
        {/* Saldo e Pagamento */}
        <View style={styles.saldoContainer({ isDarkMode })}>
          <Text style={styles.paymentSubtitle({ isDarkMode })}>
            Pagamento de Serviços para Alunos
          </Text>
          
          <View style={styles.balanceHeader}>
            <Text style={styles.saldoTitle({ isDarkMode })}>
              Saldo Disponível
            </Text>
            <TouchableOpacity onPress={toggleBalanceVisibility} activeOpacity={0.7}>
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
            <Text style={styles.payButtonText()}>
              Pagar Propina
            </Text>
          </TouchableOpacity>
        </View>

        {/* Serviços em Destaque */}
        <View style={styles.sectionContainer()}>
          <Text style={styles.sectionTitle({ isDarkMode })}>
            Serviços Principais
          </Text>
          <HexagonServices 
            services={SERVICOS_DESTAQUE} 
            onPress={handleMainServicoPress} 
            isDarkMode={isDarkMode} 
          />
        </View>

        {/* Serviços Rápidos */}
        <View style={styles.sectionContainer()}>
          <Text style={styles.sectionTitle({ isDarkMode })}>
            Serviços Rápidos
          </Text>
          <QuickServicesGrid 
            services={SERVICOS_RAPIDOS} 
            onPress={handleQuickServicoPress} 
            isDarkMode={isDarkMode} 
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavBar({ isDarkMode, insets })}>
        {['Home', 'Carteira', 'Perfil', 'Histórico'].map((item) => (
          <TouchableOpacity
            key={item}
            style={styles.navBarItem}
            onPress={() => handleBottomNavPress(item)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={
                item === 'Home' ? (pathname === SERVICO_ROTAS_DIRETAS.Home ? 'home' : 'home-outline') :
                item === 'Carteira' ? (pathname === SERVICO_ROTAS_DIRETAS.Carteira ? 'wallet' : 'wallet-outline') :
                item === 'Perfil' ? (pathname === SERVICO_ROTAS_DIRETAS.Perfil ? 'person' : 'person-outline') :
                (pathname === SERVICO_ROTAS_DIRETAS.Histórico ? 'time' : 'time-outline')
              }
              size={24}
              color={pathname === SERVICO_ROTAS_DIRETAS[item] ? COLORS.primary : (isDarkMode ? COLORS.subText : COLORS.gray)}
            />
            <Text style={[
              styles.navBarText({ isDarkMode }),
              { color: pathname === SERVICO_ROTAS_DIRETAS[item] ? COLORS.primary : (isDarkMode ? COLORS.subText : COLORS.gray) }
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sidebar */}
      {isSidebarOpen && (
        <SidebarContent
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
          logout={logout}
          isDarkMode={isDarkMode}
          services={SERVICOS_MENU_LATERAL}
          insets={insets}
        />
      )}
    </SafeAreaView>
  );
}
