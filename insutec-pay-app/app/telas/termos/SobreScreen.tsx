// app/telas/termos/SobreScreen.tsx
import React, { useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StatusBar,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import {
  createSobreStyles,
  sharedStyles,
  COLORS,
  GRADIENT,
} from '../../../styles/_SobreScreen.styles';

const { width } = Dimensions.get('window');
const isSmall = width < 380;
const isLarge = width > 700;

// ÍCONE SEGURO
const SafeIcon = ({ name, size = 24, color = COLORS.primary }: { name: string; size?: number; color?: string }) => {
  const map: Record<string, string> = {
    zap: 'bolt',
    target: 'bullseye',
    'graduation-cap': 'graduation-cap',
    'chart-line': 'chart-line',
    'shield-alt': 'shield-alt',
    'mobile-alt': 'mobile-alt',
    headset: 'headset',
    github: 'github',
    linkedin: 'linkedin-in',
    instagram: 'instagram',
    envelope: 'envelope',
  };
  const faName = map[name] || name;
  return <FontAwesome5 name={faName} size={size} color={color} />;
};

// CARD ANIMADO
const AnimatedInfoCard = ({ icon, title, description, index }: { icon: string; title: string; description: string; index: number }) => {
  const { isDarkMode } = useTheme();
  const styles = useMemo(() => createSobreStyles(isDarkMode), [isDarkMode]);
  const anim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      friction: 8,
      delay: index * 120,
      useNativeDriver: true,
    }).start();
  }, [index]);

  return (
    <Animated.View style={{ opacity: anim, transform: [{ scale: anim }] }}>
      <View style={styles.infoCard}>
        <LinearGradient colors={GRADIENT.card(isDarkMode)} style={styles.infoCardGradient} />
        <View style={styles.infoCardContent}>
          <View style={styles.infoIcon}>
            <SafeIcon name={icon} size={isLarge ? 28 : 24} />
          </View>
          <Text style={styles.infoTitle(isDarkMode)}>{title}</Text>
          <Text style={styles.infoDescription(isDarkMode)}>{description}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

// CARD DO DESENVOLVEDOR
const DeveloperCard = ({ isDarkMode, styles }: { isDarkMode: boolean; styles: any }) => {
  const name = "Ana Juliana Avelino da Costa Sobrinho";
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2);

  const socialLinks = [
    { icon: 'github', url: 'https://github.com/asobrinh', label: 'GitHub' },
    { icon: 'linkedin', url: 'https://www.linkedin.com/in/ana-juliana-avelino-da-costa-sobrinho-a97926211/', label: 'LinkedIn' },
    { icon: 'instagram', url: 'https://www.instagram.com/ajacst/', label: 'Instagram' },
    { icon: 'envelope', url: 'mailto:julianacostaana120702@gmail.com', label: 'Email' },
  ];

  return (
    <View style={styles.teamSection}>
      <Text style={styles.teamTitle(isDarkMode)}>Equipe de Desenvolvimento</Text>
      <View style={styles.teamCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName(isDarkMode)}>{name}</Text>
          <Text style={styles.memberRole(isDarkMode)}>Desenvolvedora Full Stack</Text>
          <View style={styles.memberLinks}>
            {socialLinks.map((link, i) => (
              <TouchableOpacity key={i} style={styles.linkButton} onPress={() => Linking.openURL(link.url)}>
                <SafeIcon name={link.icon} size={15} />
                <Text style={styles.linkText}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

// TELA PRINCIPAL
export default function SobreScreen() {
  const { isDarkMode } = useTheme();
  const styles = useMemo(() => createSobreStyles(isDarkMode), [isDarkMode]);
  const shared = useMemo(() => sharedStyles(isDarkMode), [isDarkMode]);

  const features = [
    { icon: 'zap', text: 'Pagamentos Rápidos e Seguros' },
    { icon: 'graduation-cap', text: 'Gestão de Propinas Universitárias' },
    { icon: 'chart-line', text: 'Histórico de Transações Detalhado' },
    { icon: 'shield-alt', text: 'Proteção de Dados Avançada' },
    { icon: 'mobile-alt', text: 'Interface Intuitiva e Moderna' },
    { icon: 'headset', text: 'Suporte 24/7' },
  ];

  return (
    <SafeAreaView style={shared.safeArea}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} translucent />

      {/* HEADER COM LOGO E GRADIENTE */}
      <View style={styles.header}>
        <LinearGradient colors={GRADIENT.header(isDarkMode)} style={styles.headerGradient} />
        <View style={styles.headerContent}>
         
          <View style={styles.logoTextContainer}>
            <Text style={styles.logo}>INSUTEC PAY</Text>
            <Text style={styles.subLogo}>Sobre a Aplicação</Text>
          </View>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>v2.0.1</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HERO COM LOGO */}
        <View style={styles.hero}>
          
          <Text style={styles.heroTitle(isDarkMode)}>Insutec Pay</Text>
          <Text style={styles.heroSubtitle(isDarkMode)}>
            Revolucionando os pagamentos universitários em Angola
          </Text>
          <Text style={styles.heroDescription(isDarkMode)}>
            Uma solução inovadora, segura e eficiente para a comunidade académica da Universidade INSUTEC.
          </Text>
        </View>

        {/* MISSÃO, VISÃO, VALORES */}
        <View style={styles.cardsSection}>
          <AnimatedInfoCard
            icon="target"
            title="Missão"
            description="Simplificar e modernizar os pagamentos académicos com segurança, rapidez e transparência."
            index={0}
          />
          <AnimatedInfoCard
            icon="eye"
            title="Visão"
            description="Ser a plataforma de referência em pagamentos digitais no setor educativo angolano."
            index={1}
          />
          <AnimatedInfoCard
            icon="star"
            title="Valores"
            description="Inovação, Segurança, Transparência, Excelência e Compromisso com a comunidade."
            index={2}
          />
        </View>

        {/* FUNCIONALIDADES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle(isDarkMode)}>Funcionalidades Principais</Text>
          <View style={styles.featuresGrid}>
            {features.map((f, i) => (
              <TouchableOpacity key={i} style={styles.featureItem} activeOpacity={0.8}>
                <View style={styles.featureIconContainer}>
                  <SafeIcon name={f.icon} size={22} />
                </View>
                <Text style={styles.featureText(isDarkMode)}>{f.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* EQUIPE */}
        <DeveloperCard isDarkMode={isDarkMode} styles={styles} />

        {/* RODAPÉ */}
        <View style={styles.footer}>
          <Text style={styles.footerText(isDarkMode)}>© 2025 Insutec Pay. Todos os direitos reservados.</Text>
          
          <Text style={styles.footerNote(isDarkMode)}>
            Universidade INSUTEC • {new Date().toLocaleDateString('pt-AO', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
