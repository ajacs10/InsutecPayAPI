import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Linking,
  Animated,
  Easing,
  Dimensions,
  StatusBar
} from 'react-native';
import { useTheme } from '../ThemeContext/ThemeContext';
import { useRouter } from 'expo-router';
import { styles } from '../../../styles/_VerAjuda.styles';

const { width, height } = Dimensions.get('window');

// =========================================================================
// Dados de Contato Angolanos
// =========================================================================
const CONTACT_INFO = {
  PHONE: '923456789',
  WHATSAPP: '244923456789',
  EMAIL: 'suporte@insutec.co.ao',
};

// =========================================================================
// Componentes Inovadores
// =========================================================================

interface AnimatedHelpItemProps {
  icon: string;
  text: string;
  subtitle?: string;
  onPress: () => void;
  isDarkMode: boolean;
  index: number;
  gradient?: string[];
}

const AnimatedHelpItem: React.FC<AnimatedHelpItemProps> = ({ 
  icon, 
  text, 
  subtitle,
  onPress, 
  isDarkMode, 
  index,
  gradient 
}) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.helpItemContainer(isDarkMode, gradient)}
      >
        <View style={styles.helpItemIconContainer}>
          <Text style={styles.helpItemIcon}>{icon}</Text>
        </View>
        
        <View style={styles.helpItemTextContainer}>
          <Text style={styles.helpItemText(isDarkMode)}>{text}</Text>
          {subtitle && (
            <Text style={styles.helpItemSubtitle(isDarkMode)}>{subtitle}</Text>
          )}
        </View>
        
        <View style={styles.helpItemArrowContainer}>
          <View style={styles.helpItemArrowCircle(isDarkMode)}>
            <Text style={styles.helpItemArrow}>{'›'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Componente de Header com Gradiente Animado - DEFINIDO CORRETAMENTE
const AnimatedHeader: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.headerContainer(isDarkMode),
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <View style={styles.headerBackground} />
      
      <View style={styles.headerContent}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>💎</Text>
        </View>
        
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle(isDarkMode)}>
            Central de Ajuda
          </Text>
          <Text style={styles.headerSubtitle(isDarkMode)}>
            Suporte 24/7 para você
          </Text>
        </View>
        
        <View style={styles.headerDecoration}>
          <View style={styles.decorationCircle} />
          <View style={styles.decorationCircle} />
          <View style={styles.decorationCircle} />
        </View>
      </View>
    </Animated.View>
  );
};

// Componente de Search Bar
const SearchBar: React.FC<{ 
  isDarkMode: boolean; 
  searchQuery: string;
  onSearchChange: (text: string) => void;
}> = ({ isDarkMode, searchQuery, onSearchChange }) => {
  return (
    <View style={styles.searchContainer(isDarkMode)}>
      <View style={styles.searchIcon}>
        <Text style={styles.searchIconText}>🔍</Text>
      </View>
      <Text style={styles.searchInput(isDarkMode)}>
        {searchQuery || 'Buscar ajuda...'}
      </Text>
    </View>
  );
};

// Componente de Contact Quick Actions
const QuickContactActions: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const quickActions = [
    { icon: '📱', label: 'WhatsApp', onPress: () => handleWhatsApp() },
    { icon: '📞', label: 'Ligar', onPress: () => handleCall() },
    { icon: '📧', label: 'Email', onPress: () => handleEmail() },
  ];

  const handleCall = () => {
    Linking.openURL(`tel:+244${CONTACT_INFO.PHONE}`);
  };

  const handleWhatsApp = () => {
    const message = 'Olá, preciso de ajuda com a app Insutec Pay.';
    const url = `whatsapp://send?phone=${CONTACT_INFO.WHATSAPP}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      alert('Por favor, instale o WhatsApp ou ligue para o suporte.');
    });
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${CONTACT_INFO.EMAIL}`);
  };

  return (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.quickActionsTitle(isDarkMode)}>Contato Rápido</Text>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickActionButton(isDarkMode)}
            onPress={action.onPress}
            activeOpacity={0.7}
          >
            <Text style={styles.quickActionIcon}>{action.icon}</Text>
            <Text style={styles.quickActionLabel(isDarkMode)}>{action.label}</Text>
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
  const [activeSection, setActiveSection] = useState<'help' | 'info'>('help');

  // Função de navegação
  const navigateTo = (screen: string) => {
    console.log(`[NAV] Navegar para: ${screen}`);
    router.push(screen as any);
  };

  // Dados das seções
  const helpSections = [
    {
      title: 'Suporte Imediato',
      items: [
        { 
          icon: '💬', 
          text: 'Perguntas Frequentes', 
          subtitle: 'Respostas rápidas para dúvidas comuns',
          onPress: () => navigateTo('/telas/verAjuda/FaqScreen'),
          gradient: ['#667eea', '#764ba2']
        },
        { 
          icon: '🎫', 
          text: 'Abrir Ticket de Suporte', 
          subtitle: 'Problemas específicos? Vamos ajudar',
          onPress: () => navigateTo('/telas/verAjuda/NovoTicketScreen'),
          gradient: ['#f093fb', '#f5576c']
        },
      ]
    },
    {
      title: 'Canais de Atendimento',
      items: [
        { 
          icon: '📱', 
          text: 'WhatsApp Business', 
          subtitle: 'Suporte rápido via mensagem',
          onPress: () => handleWhatsApp(),
          gradient: ['#4facfe', '#00f2fe']
        },
        { 
          icon: '📞', 
          text: 'Telefone Direto', 
          subtitle: `+244 ${CONTACT_INFO.PHONE}`,
          onPress: () => handleCall(),
          gradient: ['#43e97b', '#38f9d7']
        },
        { 
          icon: '📧', 
          text: 'Email Corporativo', 
          subtitle: CONTACT_INFO.EMAIL,
          onPress: () => handleEmail(),
          gradient: ['#fa709a', '#fee140']
        },
      ]
    }
  ];

  const infoSections = [
    {
      title: 'Informações do App',
      items: [
        { 
          icon: 'ℹ️', 
          text: 'Sobre o Aplicativo', 
          subtitle: 'Versão 52 • Insutec Pay',
          onPress: () => navigateTo('/telas/termos/SobreScreen'),
          gradient: ['#a8edea', '#fed6e3']
        },
        { 
          icon: '⚖️', 
          text: 'Termos e Privacidade', 
          subtitle: 'Nossas políticas e termos de uso',
          onPress: () => navigateTo('/telas/termos/TermosScreen'),
          gradient: ['#d4fc79', '#96e6a1']
        },
      ]
    }
  ];

  const handleCall = () => {
    Linking.openURL(`tel:+244${CONTACT_INFO.PHONE}`);
  };

  const handleWhatsApp = () => {
    const message = 'Olá, preciso de ajuda com a app Insutec Pay.';
    const url = `whatsapp://send?phone=${CONTACT_INFO.WHATSAPP}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      alert('Por favor, instale o WhatsApp ou ligue para o suporte.');
    });
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${CONTACT_INFO.EMAIL}`);
  };

  return (
    <View style={styles.container(isDarkMode)}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent"
        translucent
      />
      
      <AnimatedHeader isDarkMode={isDarkMode} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Barra de Pesquisa */}
        <SearchBar 
          isDarkMode={isDarkMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Ações Rápidas */}
        <QuickContactActions isDarkMode={isDarkMode} />

        {/* Navegação entre Seções */}
        <View style={styles.sectionSelectorContainer}>
          <TouchableOpacity
            style={styles.sectionSelectorButton(activeSection === 'help', isDarkMode)}
            onPress={() => setActiveSection('help')}
          >
            <Text style={styles.sectionSelectorText(activeSection === 'help', isDarkMode)}>
              Ajuda & Suporte
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.sectionSelectorButton(activeSection === 'info', isDarkMode)}
            onPress={() => setActiveSection('info')}
          >
            <Text style={styles.sectionSelectorText(activeSection === 'info', isDarkMode)}>
              Informações
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo Dinâmico */}
        {activeSection === 'help' ? (
          <>
            {helpSections.map((section, sectionIndex) => (
              <View key={sectionIndex} style={styles.sectionContainer}>
                <Text style={styles.sectionTitle(isDarkMode)}>{section.title}</Text>
                {section.items.map((item, itemIndex) => (
                  <AnimatedHelpItem
                    key={itemIndex}
                    icon={item.icon}
                    text={item.text}
                    subtitle={item.subtitle}
                    onPress={item.onPress}
                    isDarkMode={isDarkMode}
                    index={itemIndex}
                    gradient={item.gradient}
                  />
                ))}
              </View>
            ))}
          </>
        ) : (
          <>
            {infoSections.map((section, sectionIndex) => (
              <View key={sectionIndex} style={styles.sectionContainer}>
                <Text style={styles.sectionTitle(isDarkMode)}>{section.title}</Text>
                {section.items.map((item, itemIndex) => (
                  <AnimatedHelpItem
                    key={itemIndex}
                    icon={item.icon}
                    text={item.text}
                    subtitle={item.subtitle}
                    onPress={item.onPress}
                    isDarkMode={isDarkMode}
                    index={itemIndex}
                    gradient={item.gradient}
                  />
                ))}
              </View>
            ))}
          </>
        )}

        {/* Espaço extra no final */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}
