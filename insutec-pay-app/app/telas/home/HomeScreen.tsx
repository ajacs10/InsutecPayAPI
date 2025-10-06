// app/telas/home/HomeScreen.tsx (CORRIGIDO E COMPLETO)

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
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';

// Caminho para a imagem do logo (Verifique se o caminho está correto)
const LOGO_IMAGE = require('../../../assets/images/logo.png');

// Contextos e Estilos
import { useAuth } from '../../../components/AuthContext'; // Importação CORRETA do AuthContext
import { useTheme } from '../ThemeContext/ThemeContext';
// Assumindo que você tem este ficheiro de estilos
import { styles, COLORS } from '../../../styles/_HomeStyles'; 
// Assumindo que você tem estes ficheiros de dados
import { Servico, SERVICOS_MENU_LATERAL, SERVICOS_DESTAQUE } from '../../../src/constants/services';
import { formatCurrency } from '../../../src/utils/formatters';

// =========================================================================
// MOCKS / DADOS E ROTAS
// =========================================================================
const getDashboardData = () => ({
  saldoDisponivel: 150000.0,
  dividasPendentes: 0,
  totalDivida: 0.0,
});

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

// Componentes auxiliares (ServiceCard e QuickAccessCard) mantidos, pois estavam corretos.
// ... (ServiceCard e QuickAccessCard) ...

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
  logout: () => Promise<void>; // Assinatura atualizada para corresponder ao AuthContext
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
      useNativeDriver: true,
    }).start();
  }, [isOpen, rightOffset, SIDEBAR_WIDTH]);

  // CORREÇÃO: Função handleLogout agora usa o 'logout' passado via props (do useAuth)
  const handleLogout = useCallback(async () => {
    console.log('[Sidebar] Iniciando logout e fechamento');
    onClose();
    await logout(); // Chama o logout do AuthContext
    router.replace('/telas/login/LoginScreen');
  }, [onClose, logout]);

  const renderItem = (servico: Servico) => (
    <TouchableOpacity
      key={servico.id}
      style={styles.sidebarItem(isDarkMode)}
      onPress={() => {
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
          {/* Mapeia todos, exceto o botão de Logout */}
          {SERVICOS_MENU_LATERAL.filter((s) => s.nome !== 'Logout').map(renderItem)} 
          
          <View style={styles.sidebarFooter}>
            {/* Mapeia APENAS o botão de Logout para o footer */}
            {SERVICOS_MENU_LATERAL.filter((s) => s.nome === 'Logout').map(renderItem)}
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
  // CORREÇÃO ESSENCIAL: Destruturação do 'logout' do useAuth
  const { aluno, signOut: logout } = useAuth(); 
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const dashboardData = getDashboardData();

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleServicoPress = useCallback(async (servico: Servico) => {
    setIsSidebarOpen(false); // Fecha a barra lateral antes de navegar
    
    if (servico.nome === 'Logout') {
      // CORREÇÃO: Chama o logout diretamente do useAuth (alias 'logout')
      await logout(); 
      router.replace('/telas/login/LoginScreen');
      return;
    }
    
    const targetPath = SERVICO_ROTAS_DIRETAS[servico.nome];
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
  }, [logout]); // Adiciona 'logout' como dependência

  const handleQuickAccessPress = useCallback((route: string) => {
    setIsSidebarOpen(false); 
    if (route) {
      router.push(route);
    }
  }, []);

  const handlePagarAgoraPress = useCallback(() => {
    setIsSidebarOpen(false);
    router.push(FALLBACK_PAGAMENTO_PATH);
  }, []);

  useEffect(() => {
    // Garante que a barra lateral esteja fechada ao navegar para esta tela
    setIsSidebarOpen(false); 
  }, [pathname]);

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
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        onServicoPress={handleServicoPress}
        // Passa a função 'logout' do useAuth para a Sidebar
        logout={logout} 
        isDarkMode={isDarkMode}
      />
    </SafeAreaView>
  );
}
