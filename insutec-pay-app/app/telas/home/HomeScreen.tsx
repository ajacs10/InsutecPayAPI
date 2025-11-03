import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  ActivityIndicator,
  Animated,
  Easing,
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native'
import Svg, { Path, G, Text as SvgText } from 'react-native-svg'
import { useSafeAreaInsets, EdgeInsets } from 'react-native-safe-area-context'
import { FontAwesome, Ionicons, FontAwesome5 } from '@expo/vector-icons'
import { router, usePathname } from 'expo-router'

import { useAuth } from '../../../components/AuthContext'
import { useTheme } from '../ThemeContext/ThemeContext'
import { useFinance } from '../../../components/FinanceContext'
import { styles, COLORS } from '../../../styles/_HomeStyles'
import { formatCurrency } from '../../../src/utils/formatters'
import { Servico } from '../../../src/types'

const LOGO_IMAGE = require('../../../assets/images/logo.png')
const FALLBACK_PAGAMENTO_PATH = '/telas/ServicoPagamento/ServicoPagamentoScreen'
const WINDOW_HEIGHT = Dimensions.get('window').height

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
}

const SERVICOS_MENU_LATERAL: Servico[] = [
  { id: '6', nome: 'Comprovativo', icon: 'file-text-o', isMenu: true },
  { id: '7', nome: 'Perfil', icon: 'user', isMenu: true },
  { id: '8', nome: 'Ajuda', icon: 'question-circle', isMenu: true },
  { id: '10', nome: 'Sobre o App', icon: 'info-circle', isMenu: true },
  { id: '11', nome: 'Contactar Suporte', icon: 'phone', isMenu: true },
  { id: '99', nome: 'Logout', icon: 'sign-out', isMenu: true, isDestructive: true },
]

const SERVICOS_DESTAQUE: Servico[] = [
  { id: '1', nome: 'Propina', icon: 'money' },
  { id: '2', nome: 'Declaração com Notas', icon: 'file-text' },
  { id: '3', nome: 'Declaração sem Notas', icon: 'file-o' },
  { id: '4', nome: 'Folha de Prova', icon: 'book' },
]

const getInitials = (name: string | undefined): string => {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0][0].toUpperCase()
}

const HexagonServices = React.memo(({ services, onPress, isDarkMode }: {
  services: Servico[]
  onPress: (servico: Servico) => void
  isDarkMode: boolean
}) => {
  const { width } = Dimensions.get('window')
  const isSmall = width < 600
  const isLarge = width > 700
  const radius = isSmall ? 90 : isLarge ? 240 : 160
  const hexSize = isSmall ? 80 : isLarge ? 130 : 110

  const pulseAnim = useRef(new Animated.Value(1)).current
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    )
    pulse.start()
    return () => pulse.stop()
  }, [pulseAnim])

  const particles = useMemo(() =>
    Array.from({ length: 6 }).map((_, i) => {
      const anim = new Animated.Value(0)
      Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: 3000 + i * 500,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      ).start()
      return { anim, delay: i * 300 }
    }), []
  )

  const SafeIcon = ({ name, size, x, y }: { name: string; size: number; x: number; y: number }) => {
    const map: Record<string, string> = {
      money: 'money-bill-wave',
      'file-text': 'file-alt',
      'file-o': 'file',
      book: 'book-open',
    }
    return (
      <G x={x} y={y}>
        <FontAwesome5 name={map[name] || name} size={size} color={COLORS.primary} />
      </G>
    )
  }

  const Hexagon = ({ size, icon, innerText, onPress }: { size: number; icon: string; innerText: string; onPress: () => void }) => {
    const path = `M${size * 0.5},0 L${size},${size * 0.25} L${size},${size * 0.75} L${size * 0.5},${size} L0,${size * 0.75} L0,${size * 0.25} Z`
    const iconSize = size * 0.35
    const textSize = size * 0.11
    const centerX = size / 2
    const centerY = size / 2

    const glowAnim = useRef(new Animated.Value(0)).current
    const handlePressIn = () => {
      Animated.spring(glowAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start()
    }
    const handlePressOut = () => {
      Animated.spring(glowAnim, { toValue: 0, friction: 3, useNativeDriver: true }).start()
    }

    return (
      <TouchableOpacity activeOpacity={1} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
        <Animated.View style={{ transform: [{ scale: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) }] }}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <Path d={path} fill={COLORS.white} />
            <Path d={path} fill="none" stroke={COLORS.primary} strokeWidth={2.5} />
            <SafeIcon name={icon} size={iconSize} x={centerX - iconSize / 2} y={centerY - iconSize / 2 - textSize / 2} />
            <SvgText
              x={centerX}
              y={centerY + iconSize / 2 + textSize / 2}
              fontSize={textSize}
              fill={COLORS.primary}
              fontWeight="700"
              textAnchor="middle"
            >
              {innerText}
            </SvgText>
          </Svg>
        </Animated.View>
      </TouchableOpacity>
    )
  }

  const HexCard = ({ item, index }: { item: Servico; index: number }) => {
    const scale = useRef(new Animated.Value(0)).current
    const angle = (index * 90) * (Math.PI / 180)
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    useEffect(() => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        delay: index * 100,
        useNativeDriver: true,
      }).start()
    }, [])

    return (
      <Animated.View style={{ transform: [{ scale }, { translateX: x }, { translateY: y }], position: 'absolute' }}>
        <View style={{ alignItems: 'center', width: hexSize + 20 }}>
          <Hexagon size={hexSize} icon={item.icon} innerText={item.nome.split(' ')[0]} onPress={() => onPress(item)} />
          <Text style={{
            marginTop: 8,
            fontSize: isSmall ? 11 : 13,
            fontWeight: '700',
            color: COLORS.primaryLight,
            textAlign: 'center',
            textShadowColor: COLORS.primaryLight + '60',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 8,
          }}>
            {item.nome}
          </Text>
        </View>
      </Animated.View>
    )
  }

  return (
    <View style={{
      ...styles.serviceListContainer({ isDarkMode }),
      height: radius * 2 + 140,
      paddingVertical: 80,
      marginTop: -1,
      borderWidth: 1.2,
      borderColor: COLORS.primary,
      position: 'relative',
      overflow: 'hidden',
      ...Platform.select({
        ios: { shadowColor: COLORS.primaryLight, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 40 },
        android: { elevation: 12 },
        web: { boxShadow: `0 0 8px 0.8px ${COLORS.primaryLight + '99'}` },
      }),
    }}>
      <Animated.View style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.primary + '13',
        transform: [{ scale: pulseAnim }],
      }} />

      {particles.map((p, i) => {
        const translateY = p.anim.interpolate({ inputRange: [0, 1], outputRange: [radius * 2, -radius * 2] })
        const translateX = p.anim.interpolate({ inputRange: [0, 1], outputRange: [-50, 50] })
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: COLORS.primaryLight,
              opacity: 0.7,
              transform: [{ translateX }, { translateY }],
              left: '50%',
              top: WINDOW_HEIGHT / 2,
            }}
          />
        )
      })}

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {services.map((item, i) => (
          <HexCard key={item.id} item={item} index={i} />
        ))}
      </View>
    </View>
  )
})

const SidebarContent: React.FC<{
  isOpen: boolean
  onClose: () => void
  logout: () => Promise<void>
  isDarkMode: boolean
  services: Servico[]
  insets: EdgeInsets
}> = ({ isOpen, onClose, logout, isDarkMode, services, insets }) => {
  const { aluno } = useAuth()
  const windowWidth = Dimensions.get('window').width
  const SIDEBAR_WIDTH = Math.min(windowWidth * 0.80, 360)

  const leftOffset = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current
  const overlayOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(leftOffset, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start()
    return () => {
      Animated.timing(leftOffset, {
        toValue: -SIDEBAR_WIDTH,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start()
    }
  }, [])

  useEffect(() => {
    Animated.timing(overlayOpacity, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [isOpen])

  const handleLogout = useCallback(async () => {
    try {
      onClose()
      await new Promise(resolve => setTimeout(resolve, 150))
      await logout()
    } catch (error) {
      console.error("Erro ao tentar logout:", error)
      Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.')
    }
  }, [logout, onClose])

  const handleServicoPress = useCallback((servico: Servico) => {
    if (servico.nome === 'Logout') {
      Alert.alert('Confirmação', 'Tem certeza que deseja sair da sua conta?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: handleLogout, style: 'destructive' },
      ])
      return
    }
    const targetPath = SERVICO_ROTAS_DIRETAS[servico.nome]
    if (targetPath) { onClose(); router.push(targetPath as any) }
    else { Alert.alert('Aviso', `Funcionalidade "${servico.nome}" em desenvolvimento`); onClose() }
  }, [handleLogout, onClose])

  const renderItem = useCallback((servico: Servico) => (
    <TouchableOpacity
      key={servico.id}
      style={styles.sidebarItem({ isDarkMode })}
      onPress={() => handleServicoPress(servico)}
      activeOpacity={0.7}
    >
      <FontAwesome
        name={servico.icon as any}
        size={20}
        color={servico.nome === 'Logout' ? COLORS.danger : styles.sidebarText({ isDarkMode }).color}
        style={{ width: 30 }}
      />
      <Text
        style={[
          styles.sidebarText({ isDarkMode }),
          servico.nome === 'Logout' && { color: COLORS.danger, fontWeight: '800' }
        ]}
      >
        {servico.nome}
      </Text>
    </TouchableOpacity>
  ), [isDarkMode, handleServicoPress])

  return (
    <View style={{ ...StyleSheet.absoluteFillObject, zIndex: 999 }}>
      <Animated.View style={[styles.sidebarOverlay, { opacity: overlayOpacity, pointerEvents: isOpen ? 'auto' : 'none' }]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} activeOpacity={1} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sidebar({ isDarkMode, width: SIDEBAR_WIDTH, insets }),
          { transform: [{ translateX: leftOffset }] }
        ]}
      >
        <View style={styles.sidebarHeader({ isDarkMode, insets })}>
          <TouchableOpacity onPress={() => handleServicoPress({ id: '7', nome: 'Perfil', icon: 'user' })} activeOpacity={0.7}>
            <View style={styles.sidebarAvatar({ isDarkMode })}>
              <Text style={styles.sidebarAvatarText({ isDarkMode })}>{getInitials(aluno?.nome)}</Text>
            </View>
            <Text style={styles.sidebarHeaderText({ isDarkMode })} numberOfLines={1}>{aluno?.nome || 'Utilizador'}</Text>
            <Text style={styles.sidebarHeaderSubtitle({ isDarkMode })}>{aluno?.nr_estudante || 'Sem ID'}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ paddingVertical: 10 }} showsVerticalScrollIndicator={false}>
          {services.filter(s => s.nome !== 'Logout').map(renderItem)}
          <View style={styles.sidebarFooter}>{services.filter(s => s.nome === 'Logout').map(renderItem)}</View>
        </ScrollView>
      </Animated.View>
    </View>
  )
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  const { aluno, signOut: logout } = useAuth()
  const { isDarkMode } = useTheme()
  const { saldo } = useFinance()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    setIsSidebarOpen(false)
    if (aluno === undefined) { setIsLoading(true); return }
    if (!aluno) { router.replace('/telas/login/LoginScreen'); setIsLoading(false); return }
    setIsLoading(false)
  }, [aluno, pathname])

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), [])
  const toggleBalanceVisibility = useCallback(() => setIsBalanceVisible(prev => !prev), [])

  const navigateToService = useCallback((servicoNome: string) => {
    const targetPath = SERVICO_ROTAS_DIRETAS[servicoNome]
    if (targetPath) router.push(targetPath as any)
    else {
      Alert.alert('Aviso', `Funcionalidade "${servicoNome}" em desenvolvimento`)
      if (servicoNome !== 'Home') router.push(FALLBACK_PAGAMENTO_PATH as any)
    }
    setIsSidebarOpen(false)
  }, [])

  const handleMainServicoPress = useCallback((servico: Servico) => navigateToService(servico.nome), [navigateToService])
  const handleBottomNavPress = useCallback((servicoNome: string) => navigateToService(servicoNome), [navigateToService])

  const firstName = aluno?.nome?.split(' ')[0] || 'Utilizador'
  const currentDate = useMemo(() => new Date().toLocaleString('pt-AO', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  }), [])

  if (isLoading || !aluno) {
    return (
      <SafeAreaView style={styles.safeArea({ isDarkMode })}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ color: isDarkMode ? COLORS.textLight : COLORS.textDark, marginTop: 10 }}>
            {isLoading ? 'A verificar autenticação...' : 'Redirecionando para login...'}
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea({ isDarkMode })} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />

      <ScrollView
        style={styles.mainScrollView({ isDarkMode, insets })}
        contentContainerStyle={{
          ...styles.contentContainer({ isDarkMode, insets }),
          // Garantindo espaço para a nav bar (assumida 60px) + a área de segurança.
          paddingBottom: 60 + insets.bottom + 40, 
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.saldoContainer({ isDarkMode })}>
          <Text style={styles.paymentSubtitle({ isDarkMode })}>Pagamento de Serviços para Alunos</Text>
          <View style={styles.balanceHeader}>
            <Text style={styles.saldoTitle({ isDarkMode })}>Saldo Disponível</Text>
            <TouchableOpacity onPress={toggleBalanceVisibility} activeOpacity={0.7}>
              <Ionicons name={isBalanceVisible ? 'eye-outline' : 'eye-off-outline'} size={22} color={isDarkMode ? COLORS.subText : COLORS.gray} />
            </TouchableOpacity>
          </View>
          <Text style={styles.saldoValue({ isDarkMode })}>
            {isBalanceVisible ? formatCurrency(saldo) : '***,** Kz'}
          </Text>
          <TouchableOpacity style={styles.payButton({ isDarkMode })} onPress={() => handleMainServicoPress(SERVICOS_DESTAQUE[0])} activeOpacity={0.7}>
            <Text style={styles.payButtonText()}>Pagar Propina</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer()}>
          <Text style={styles.sectionTitle({ isDarkMode })}>Serviços Essenciais</Text>
          <HexagonServices services={SERVICOS_DESTAQUE} onPress={handleMainServicoPress} isDarkMode={isDarkMode} />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={[styles.header({ isDarkMode, insets }), styles.headerWithZIndex]}>
        <TouchableOpacity style={styles.logoAndGreetingContainer} onPress={toggleSidebar} activeOpacity={0.8}>
          <View style={styles.logoContainer}>
            <Image source={LOGO_IMAGE} style={styles.logoImage} resizeMode="contain" />
          </View>
          <View style={styles.greetingTextWrapper}>
            <Text style={styles.appGreeting({ isDarkMode })} numberOfLines={1}>Olá, {firstName}</Text>
            {/* CORREÇÃO APLICADA AQUI: Removido 'INSU TEC PAY | ' */}
            <Text style={styles.dateText({ isDarkMode })} numberOfLines={1}>{currentDate}</Text>
          </View>
        </TouchableOpacity>
       
      </View>

      <View style={styles.bottomNavBar({ isDarkMode, insets })}>
        <TouchableOpacity style={styles.navBarItem} onPress={() => handleBottomNavPress('Home')} activeOpacity={0.7}>
          <Ionicons name={pathname === SERVICO_ROTAS_DIRETAS.Home ? 'home' : 'home-outline'} size={26} color={pathname === SERVICO_ROTAS_DIRETAS.Home ? COLORS.primary : (isDarkMode ? COLORS.textLight : COLORS.gray)} />
          <Text style={[styles.navBarText({ isDarkMode }), { color: pathname === SERVICO_ROTAS_DIRETAS.Home ? COLORS.primary : (isDarkMode ? COLORS.textLight : COLORS.gray) }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBarItem} onPress={() => handleBottomNavPress('Carteira')} activeOpacity={0.7}>
          <Ionicons name={pathname === SERVICO_ROTAS_DIRETAS.Carteira ? 'wallet' : 'wallet-outline'} size={26} color={pathname === SERVICO_ROTAS_DIRETAS.Carteira ? COLORS.primary : (isDarkMode ? COLORS.textLight : COLORS.gray)} />
          <Text style={[styles.navBarText({ isDarkMode }), { color: pathname === SERVICO_ROTAS_DIRETAS.Carteira ? COLORS.primary : (isDarkMode ? COLORS.textLight : COLORS.gray) }]}>Carteira</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBarItem} onPress={() => handleBottomNavPress('Perfil')} activeOpacity={0.7}>
          <Ionicons name={pathname === SERVICO_ROTAS_DIRETAS.Perfil ? 'person' : 'person-outline'} size={26} color={pathname === SERVICO_ROTAS_DIRETAS.Perfil ? COLORS.primary : (isDarkMode ? COLORS.textLight : COLORS.gray)} />
          <Text style={[styles.navBarText({ isDarkMode }), { color: pathname === SERVICO_ROTAS_DIRETAS.Perfil ? COLORS.primary : (isDarkMode ? COLORS.textLight : COLORS.gray) }]}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBarItem} onPress={() => handleBottomNavPress('Histórico')} activeOpacity={0.7}>
          <Ionicons name={pathname === SERVICO_ROTAS_DIRETAS.Histórico ? 'time' : 'time-outline'} size={26} color={pathname === SERVICO_ROTAS_DIRETAS.Histórico ? COLORS.primary : (isDarkMode ? COLORS.textLight : COLORS.gray)} />
          <Text style={[styles.navBarText({ isDarkMode }), { color: pathname === SERVICO_ROTAS_DIRETAS.Histórico ? COLORS.primary : (isDarkMode ? COLORS.textLight : COLORS.gray) }]}>Histórico</Text>
        </TouchableOpacity>
      </View>

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
  )
}
