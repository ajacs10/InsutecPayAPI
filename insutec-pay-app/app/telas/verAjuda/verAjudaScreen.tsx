// app/telas/verAjuda/VerAjudaScreen.tsx
import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  Keyboard,
  Alert,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // ÍCONES REAIS
import { useTheme } from '../ThemeContext/ThemeContext';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import {
  createAjudaStyles,
  sharedStyles,
  COLORS,
  GRADIENT,
} from '../../../styles/_VerAjuda.styles';

const { width } = Dimensions.get('window');
const isSmall = width < 380;

// =========================================================================
// Contato Oficial
// =========================================================================
const CONTACT = {
  PHONE: '923456789',
  WHATSAPP: '244923456789',
  EMAIL: 'suporte@insutec.co.ao',
};

// =========================================================================
// Componentes com Ícones Reais
// =========================================================================

const AnimatedHeader = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const styles = useMemo(() => createAjudaStyles(isDarkMode), [isDarkMode]);

  return (
    <Animated.View
      style={[
        styles.headerContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <LinearGradient
        colors={GRADIENT.header(isDarkMode)}
        style={styles.headerGradient}
      />
      <View style={styles.headerContent}>
        <View style={styles.headerIcon}>
          <FontAwesome5 name="headset" size={28} color="#fff" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Central de Ajuda</Text>
          <Text style={styles.headerSubtitle}>Suporte 24/7 • Rápido e Eficaz</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const SearchBar = ({
  searchQuery,
  onSearchChange,
  isDarkMode,
}: {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  isDarkMode: boolean;
}) => {
  const [focused, setFocused] = useState(false);
  const styles = useMemo(() => createAjudaStyles(isDarkMode), [isDarkMode]);

  return (
    <View style={[styles.searchContainer, focused && styles.searchFocused]}>
      <FontAwesome5 name="search" size={18} color={focused ? COLORS.primary : '#888'} />
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar ajuda, dúvidas, serviços..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={onSearchChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="search"
        onSubmitEditing={Keyboard.dismiss}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => onSearchChange('')}>
          <FontAwesome5 name="times-circle" size={18} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const AnimatedHelpCard = ({
  icon, // agora é string do FontAwesome5
  title,
  subtitle,
  onPress,
  gradient,
  index,
  isDarkMode,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  gradient?: string[];
  index: number;
  isDarkMode: boolean;
}) => {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 120),
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, friction: 8, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }).start();
  };

  const styles = useMemo(() => createAjudaStyles(isDarkMode), [isDarkMode]);

  return (
    <Animated.View style={{ opacity: opacityAnim, transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={0.9}
        style={styles.cardContainer}
      >
        <LinearGradient
          colors={gradient || GRADIENT.card(isDarkMode)}
          style={styles.cardGradient}
        />
        <View style={styles.cardContent}>
          <View style={styles.cardIcon}>
            <FontAwesome5 name={icon} size={22} color={COLORS.primary} />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle(isDarkMode)}>{title}</Text>
            {subtitle && <Text style={styles.cardSubtitle(isDarkMode)}>{subtitle}</Text>}
          </View>
          <FontAwesome5 name="chevron-right" size={18} color={isDarkMode ? '#ccc' : '#666'} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const QuickContact = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const styles = useMemo(() => createAjudaStyles(isDarkMode), [isDarkMode]);

  const actions = [
    {
      icon: 'whatsapp',
      label: 'WhatsApp',
      color: '#25D366',
      onPress: () => {
        const msg = 'Olá, preciso de ajuda com o Insutec Pay.';
        Linking.openURL(`whatsapp://send?phone=${CONTACT.WHATSAPP}&text=${encodeURIComponent(msg)}`).catch(() => {
          Alert.alert('Erro', 'WhatsApp não instalado.');
        });
      },
    },
    {
      icon: 'phone',
      label: 'Ligar',
      color: COLORS.primary,
      onPress: () => Linking.openURL(`tel:+244${CONTACT.PHONE}`),
    },
    {
      icon: 'envelope',
      label: 'Email',
      color: '#e74c3c',
      onPress: () => Linking.openURL(`mailto:${CONTACT.EMAIL}`),
    },
  ];

  return (
    <View style={styles.quickSection}>
      <Text style={styles.sectionTitle(isDarkMode)}>Contato Imediato</Text>
      <View style={styles.quickGrid}>
        {actions.map((action, i) => (
          <TouchableOpacity key={i} style={styles.quickButton} onPress={action.onPress}>
            <LinearGradient
              colors={[action.color + '20', action.color + '40']}
              style={styles.quickButtonGradient}
            />
            <FontAwesome5 name={action.icon} size={24} color={action.color} />
            <Text style={styles.quickLabel(isDarkMode)}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// =========================================================================
// Tela Principal
// =========================================================================

export default function VerAjudaScreen() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'help' | 'info'>('help');

  const styles = useMemo(() => createAjudaStyles(isDarkMode), [isDarkMode]);
  const shared = useMemo(() => sharedStyles(isDarkMode), [isDarkMode]);

  const navigate = (path: string) => router.push(path);

  const helpData = [
    {
      title: 'Suporte Rápido',
      items: [
        {
          icon: 'question-circle', // ÍCONE REAL
          title: 'Perguntas Frequentes',
          subtitle: 'Dúvidas comuns resolvidas',
          onPress: () => navigate('/telas/verAjuda/FaqScreen'),
          gradient: ['#667eea', '#764ba2'],
        },
        {
          icon: 'ticket-alt', // ÍCONE REAL
          title: 'Abrir Ticket',
          subtitle: 'Suporte personalizado',
          onPress: () => navigate('/telas/verAjuda/NovoTicketScreen'),
          gradient: ['#f093fb', '#f5576c'],
        },
      ],
    },
  ];

  const infoData = [
    {
      title: 'Sobre o App',
      items: [
        {
          icon: 'info-circle', // ÍCONE REAL
          title: 'Sobre o Insutec Pay',
          subtitle: 'Versão 52 • 2025',
          onPress: () => navigate('/telas/termos/SobreScreen'),
          gradient: ['#a8edea', '#fed6e3'],
        },
        {
          icon: 'shield-alt', // ÍCONE REAL
          title: 'Termos e Privacidade',
          subtitle: 'Segurança e conformidade',
          onPress: () => navigate('/telas/termos/TermosScreen'),
          gradient: ['#d4fc79', '#96e6a1'],
        },
      ],
    },
  ];

  const filteredHelp = helpData[0].items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredInfo = infoData[0].items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={shared.safeArea}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.container}>
        <AnimatedHeader isDarkMode={isDarkMode} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isDarkMode={isDarkMode}
          />

          <QuickContact isDarkMode={isDarkMode} />

          {/* Abas */}
          <View style={styles.tabContainer}>
            {(['help', 'info'] as const).map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive(isDarkMode)]}>
                  {tab === 'help' ? 'Ajuda' : 'Informações'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Conteúdo */}
          {activeTab === 'help' ? (
            <View>
              {filteredHelp.length > 0 ? (
                filteredHelp.map((item, i) => (
                  <AnimatedHelpCard
                    key={i}
                    icon={item.icon} // ÍCONE REAL
                    title={item.title}
                    subtitle={item.subtitle}
                    onPress={item.onPress}
                    gradient={item.gradient}
                    index={i}
                    isDarkMode={isDarkMode}
                  />
                ))
              ) : (
                <Text style={styles.emptyText(isDarkMode)}>
                  Nenhum resultado encontrado para "{searchQuery}"
                </Text>
              )}
            </View>
          ) : (
            <View>
              {filteredInfo.map((item, i) => (
                <AnimatedHelpCard
                  key={i}
                  icon={item.icon} // ÍCONE REAL
                  title={item.title}
                  subtitle={item.subtitle}
                  onPress={item.onPress}
                  gradient={item.gradient}
                  index={i}
                  isDarkMode={isDarkMode}
                />
              ))}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
