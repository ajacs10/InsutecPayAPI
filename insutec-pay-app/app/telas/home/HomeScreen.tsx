import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  ActivityIndicator, // Adicionado para o loading screen de segurança
  // 🚀 CORREÇÃO PRINCIPAL: Importação do Platform para usar useNativeDriver
  Platform, 
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useAuth } from '../../../components/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';
// Assumindo que este ficheiro de estilos está correto
import { styles, COLORS } from '../../../styles/_HomeStyles';
import { formatCurrency } from '../../../src/utils/formatters';

// Caminho para a imagem do logo
const LOGO_IMAGE = require('../../../assets/images/logo.png');

// --- TIPAGENS E CONSTANTES ---
interface Servico {
  id: string;
  nome: string;
  icon: any;
  isMenu?: boolean;
  isDestructive?: boolean;
}

// Mocks e Rotas (SIMULANDO O SEU services.ts)
const getDashboardData = () => ({
  saldoDisponivel: 150000.0,
  dividasPendentes: 0,
  totalDivida: 0.0,
});

const FALLBACK_PAGAMENTO_PATH = '/telas/ServicoPagamento/ServicoPagamentoScreen';

// 1. Definição Completa de Rotas
const SERVICO_ROTAS_DIRETAS: { [key: string]: string } = {
  Propina: '/telas/servicos/Propina',
  'Taxa de Inscrição': '/telas/servicos/TaxaInscricao',
  'Declaração com Notas': '/telas/servicos/DeclaracaoNota',
  'Declaração sem Notas': '/telas/servicos/DeclaracaoSemNota',
  'Folha de Prova': '/telas/servicos/FolhadeProva',
  'Reconfirmação de Matrícula': '/telas/servicos/Reconfirmacaomatricula',
  'Pagar Agora': '/telas/ServicoPagamento/ServicoPagamentoScreen',
  Perfil: '/telas/perfil/PerfilScreen',
  Histórico: '/telas/historico/HistoricoScreen',
  'Leitor QR': '/telas/qrcode/QRCodeReader',
  Ajuda: '/telas/ajuda/AjudaScreen',
  Carteira: '/telas/financeiro/CarteiraScreen',
  Comprovativo: '/telas/comprovativo/ComprovativoScreen',
};

// MOCK: Serviços que aparecem no Menu Lateral
const SERVICOS_MENU_LATERAL: Servico[] = [
  { id: '1', nome: 'Propina', icon: 'money', isMenu: true },
  { id: '2', nome: 'Taxa de Inscrição', icon: 'vcard-o', isMenu: true },
  { id: '3', nome: 'Reconfirmação de Matrícula', icon: 'calendar-check-o', isMenu: true },
  { id: '4', nome: 'Carteira', icon: 'credit-card', isMenu: true },
  { id: '5', nome: 'Histórico', icon: 'history', isMenu: true },
  { id: '6', nome: 'Comprovativo', icon: 'file-text-o', isMenu: true },
  { id: '7', nome: 'Perfil', icon: 'user', isMenu: true },
  { id: '8', nome: 'Ajuda', icon: 'support', isMenu: true },
  { id: '99', nome: 'Logout', icon: 'sign-out', isMenu: true, isDestructive: true },
];

// MOCK: Serviços de Destaque no ecrã principal
const SERVICOS_DESTAQUE: Servico[] = [
  { id: '1', nome: 'Propina', icon: 'money' },
  { id: '2', nome: 'Taxa de Inscrição', icon: 'vcard-o' },
  { id: '3', nome: 'Declaração com Notas', icon: 'file-text' },
  { id: '4', nome: 'Folha de Prova', icon: 'book' },
];

// 2. Definição dos Atalhos Rápidos
const ATALHOS_RAPIDOS = [
  { id: '5', name: 'Comprovativo', icon: 'file-text-o', route: SERVICO_ROTAS_DIRETAS['Comprovativo'] || '' },
  { id: '4', name: 'Carteira', icon: 'credit-card', route: SERVICO_ROTAS_DIRETAS['Carteira'] || '' },
  { id: '1', name: 'Histórico', icon: 'history', route: SERVICO_ROTAS_DIRETAS['Histórico'] || '' },
  { id: '2', name: 'Leitor QR', icon: 'qrcode', route: SERVICO_ROTAS_DIRETAS['Leitor QR'] || '' },
  { id: '3', name: 'Ajuda', icon: 'support', route: SERVICO_ROTAS_DIRETAS['Ajuda'] || '' },
];


// --- COMPONENTES AUXILIARES ---

const ServiceCard: React.FC<{ servico: Servico; onPress: (servico: Servico) => void; isDarkMode: boolean }> =
  React.memo(({ servico, onPress, isDarkMode }) => (
    <TouchableOpacity style={styles.card(isDarkMode)} onPress={() => onPress(servico)} activeOpacity={0.7}>
      <View style={styles.cardIconContainer(isDarkMode)}>
        <FontAwesome name={servico.icon} size={28} color={COLORS.primary} />
      </View>
      <Text style={styles.cardTitle(isDarkMode)} numberOfLines={1}>{servico.nome}</Text>
    </TouchableOpacity>
  ));

const QuickAccessCard: React.FC<{ icon: string; name: string; onPress: () => void; isDarkMode: boolean }> =
  React.memo(({ icon, name, onPress, isDarkMode }) => (
    <TouchableOpacity style={styles.quickAccessCard(isDarkMode)} onPress={onPress} activeOpacity={0.7}>
      <FontAwesome name={icon} size={22} color={COLORS.primary} />
      <Text style={styles.quickAccessText(isDarkMode)} numberOfLines={1}>{name}</Text>
    </TouchableOpacity>
  ));

const Sidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onServicoPress: (servico: Servico) => void;
  logout: () => Promise<void>;
  isDarkMode: boolean;
}> = ({ isOpen, onClose, onServicoPress, logout, isDarkMode }) => {
  const { aluno } = useAuth();
  const windowWidth = Dimensions.get('window').width;
  const SIDEBAR_WIDTH = windowWidth * 0.75;
  const rightOffset = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  useEffect(() => {
    console.log('[Sidebar] Estado da Sidebar:', { isOpen });
    Animated.timing(rightOffset, {
      toValue: isOpen ? 0 : -SIDEBAR_WIDTH,
      duration: 300,
      easing: Easing.out(Easing.ease),
      // Esta linha agora está correta
      useNativeDriver: Platform.OS !== 'web', 
    }).start();
  }, [isOpen, rightOffset, SIDEBAR_WIDTH]);

  const handleLogout = useCallback(async () => {
    console.log('[Sidebar] Iniciando logout');
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('[Sidebar] Erro no logout:', error);
    }
  }, [logout, onClose]);

  const renderItem = (servico: Servico) => (
    <TouchableOpacity
      key={servico.id}
      style={styles.sidebarItem(isDarkMode)}
      onPress={() => {
        console.log('[Sidebar] Item clicado:', servico.nome);
        if (servico.nome === 'Logout') {
          handleLogout();
        } else {
          onServicoPress(servico);
        }
      }}
      activeOpacity={0.6}
    >
      <FontAwesome
        name={servico.icon}
        size={20}
        color={servico.nome === 'Logout' ? COLORS.danger : styles.sidebarText(isDarkMode).color}
        style={{ width: 30 }}
      />
      <Text
        style={[styles.sidebarText(isDarkMode), servico.nome === 'Logout' && { color: COLORS.danger }]}
      >
        {servico.nome}
      </Text>
    </TouchableOpacity>
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
      <Animated.View style={[styles.sidebar(isDarkMode, SIDEBAR_WIDTH), { transform: [{ translateX: rightOffset }] }]}>
        <View style={styles.sidebarHeader(isDarkMode)}>
          <FontAwesome name="user-circle" size={40} color={COLORS.primary} />
          <Text style={styles.sidebarHeaderText(isDarkMode)} numberOfLines={1}>
            {aluno?.nome || 'Utilizador'}
          </Text>
          <Text style={styles.sidebarHeaderSubtitle(isDarkMode)}>{aluno?.nr_estudante || 'Sem ID'}</Text>
        </View>
        <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
          {/* Renderiza todos os itens do menu lateral, exceto Logout */}
          {SERVICOS_MENU_LATERAL.filter((s) => s.nome !== 'Logout').map(renderItem)}
          <View style={styles.sidebarFooter}>
            {/* Renderiza o item Logout separadamente no footer */}
            {SERVICOS_MENU_LATERAL.filter((s) => s.nome === 'Logout').map(renderItem)}
          </View>
        </ScrollView>
      </Animated.View>
    </>
  );
};

// --- TELA PRINCIPAL: HomeScreen ---

export default function HomeScreen() {
  const { aluno, signOut: logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const dashboardData = getDashboardData();

  useEffect(() => {
    console.log('[HomeScreen] Carregada, aluno:', aluno?.nr_estudante);
    setIsSidebarOpen(false); // Garante que a sidebar esteja fechada
  }, [pathname, aluno]);

  // 🚀 Lógica de Segurança movida para o useEffect
  useEffect(() => {
    // Redireciona o utilizador não autenticado após o componente montar
    if (aluno === undefined) return; // Não faz nada se ainda não carregou o AuthContext

    if (!aluno) {
      console.log('[HomeScreen] Nenhum aluno autenticado, redirecionando para LoginScreen');
      // Usa setTimeout para garantir que a navegação ocorre após a renderização
      const timer = setTimeout(() => {
        router.replace('/telas/login/LoginScreen');
      }, 0); 
      return () => clearTimeout(timer);
    }
  }, [aluno]); // Depende apenas do estado do aluno

  const toggleSidebar = useCallback(() => {
    console.log('[HomeScreen] Alternando sidebar, estado atual:', !isSidebarOpen);
    setIsSidebarOpen((prev) => !prev);
  }, [isSidebarOpen]);

  const handleServicoPress = useCallback(async (servico: Servico) => {
    console.log('[HomeScreen] Serviço pressionado:', servico.nome);
    setIsSidebarOpen(false);
    
    if (servico.nome === 'Logout') {
      console.log('[HomeScreen] Acionando logout');
      await logout();
      return;
    }
    
    const targetPath = SERVICO_ROTAS_DIRETAS[servico.nome];
    
    if (targetPath) {
      console.log('[HomeScreen] Navegando para:', targetPath);
      router.push({
        pathname: targetPath,
        params: { servico: JSON.stringify(servico) },
      });
    } else {
      console.log('[HomeScreen] Navegando para fallback:', FALLBACK_PAGAMENTO_PATH);
      router.push(FALLBACK_PAGAMENTO_PATH);
    }
  }, [logout]);

  const handleQuickAccessPress = useCallback((route: string) => {
    console.log('[HomeScreen] Atalho rápido pressionado:', route);
    setIsSidebarOpen(false);
    if (route) {
      router.push(route);
    }
  }, []);

  const handlePagarAgoraPress = useCallback(() => {
    console.log('[HomeScreen] Botão Pagar Agora pressionado');
    setIsSidebarOpen(false);
    router.push(SERVICO_ROTAS_DIRETAS['Propina']); // Redireciona para o serviço mais comum
  }, []);

  // Fallback de segurança: Mostra um loading enquanto o redirecionamento ocorre
  if (!aluno) {
    return (
        <View style={{ flex: 1, backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{ color: isDarkMode ? COLORS.textLight : COLORS.dark, marginTop: 10 }}>
                A verificar autenticação...
            </Text>
        </View>
    );
  }

  // O componente principal é renderizado APENAS se o aluno for válido
  return (
    <SafeAreaView style={styles.safeArea(isDarkMode)}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? COLORS.darkBackground : COLORS.lightBackground}
      />
      <View style={styles.header(isDarkMode)}>
        <View style={styles.logoAndGreetingContainer}>
          <View style={styles.logoContainer}>
            <Image source={LOGO_IMAGE} style={styles.logoImage} resizeMode="contain" />
          </View>
          <Text style={styles.greetingText(isDarkMode)} numberOfLines={1}>
            Olá, {aluno?.nome?.split(' ')[0] || 'Estudante'}!
          </Text>
        </View>
        <View style={styles.headerRightButtons}>
          <TouchableOpacity onPress={toggleTheme} style={styles.headerButton}>
            <Ionicons
              name={isDarkMode ? 'sunny' : 'moon'}
              size={26}
              color={styles.sectionTitle(isDarkMode).color}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleSidebar}
            style={styles.headerButton}
          >
            <Ionicons name="menu" size={30} color={styles.sectionTitle(isDarkMode).color} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer(isDarkMode)} showsVerticalScrollIndicator={false}>
        
        {/* --- Saldo e Botão Pagar --- */}
        <View style={styles.saldoContainer(isDarkMode)}>
          <View style={styles.balanceHeader}>
            <Text style={styles.saldoTitle(isDarkMode)}>Saldo Disponível</Text>
            <Ionicons name="eye-off-outline" size={20} color={isDarkMode ? COLORS.subText : COLORS.gray} />
          </View>
          <Text style={styles.saldoValue(isDarkMode)}>{formatCurrency(dashboardData.saldoDisponivel)}</Text>
          <TouchableOpacity style={styles.payButton(isDarkMode)} onPress={handlePagarAgoraPress}>
            <Text style={styles.payButtonText(isDarkMode)}>Pagar Propina e Taxas</Text>
          </TouchableOpacity>
        </View>
        
        {/* --- Serviços em Destaque --- */}
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
        
        {/* --- Outros Atalhos (Horizontal) --- */}
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
      
      {/* --- Sidebar --- */}
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
