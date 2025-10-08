// app/telas/termos/SobreScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Linking,
  StatusBar,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { styles } from '../../../styles/_SobreScreen.styles';

const { width } = Dimensions.get('window');

// =========================================================================
// Componentes de UI
// =========================================================================

interface InfoCardProps {
  icon: string;
  title: string;
  description: string;
  isDarkMode: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, description, isDarkMode }) => {
  return (
    <View style={styles.infoCard(isDarkMode)}>
      <Text style={styles.infoCardIcon}>{icon}</Text>
      <Text style={styles.infoCardTitle(isDarkMode)}>{title}</Text>
      <Text style={styles.infoCardDescription(isDarkMode)}>{description}</Text>
    </View>
  );
};

interface FeatureItemProps {
  icon: string;
  text: string;
  isDarkMode: boolean;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text, isDarkMode }) => {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText(isDarkMode)}>{text}</Text>
    </View>
  );
};

const TeamCard: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <View style={styles.teamCard(isDarkMode)}>
      <Text style={styles.teamTitle(isDarkMode)}>Equipe de Desenvolvimento</Text>
      
      <View style={styles.teamMember}>
        <View style={styles.memberAvatar}>
          <Text style={styles.avatarText}>AJ</Text>
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName(isDarkMode)}>Ana Juliana Avelino da Costa Sobrinho</Text>
          <Text style={styles.memberRole(isDarkMode)}>Desenvolvedora Full Stack</Text>
          <Text style={styles.memberContact(isDarkMode)}>ana.juliana@insutec.ao</Text>
        </View>
      </View>

      <View style={styles.teamMember}>
        <View style={styles.memberAvatar}>
          <Text style={styles.avatarText}>OC</Text>
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName(isDarkMode)}>OCSY TIC</Text>
          <Text style={styles.memberRole(isDarkMode)}>Parceiro Tecnológico</Text>
          <Text style={styles.memberContact(isDarkMode)}>ocsy@tic.ao</Text>
        </View>
      </View>
    </View>
  );
};

const ContactSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const contactMethods = [
    { icon: '📧', label: 'Email', value: 'suporte@insutecpay.ao', action: () => Linking.openURL('mailto:suporte@insutecpay.ao') },
    { icon: '📞', label: 'Telefone', value: '+244 945 944 747', action: () => Linking.openURL('tel:+244945944747') },
    { icon: '🌐', label: 'Website', value: 'www.insutec.ao', action: () => Linking.openURL('https://www.insutec.ao') },
    { icon: '📱', label: 'WhatsApp', value: '+244 931 285 822', action: () => Linking.openURL('https://wa.me/244931285822') },
  ];

  return (
    <View style={styles.contactSection(isDarkMode)}>
      <Text style={styles.contactTitle(isDarkMode)}>Contacte-nos</Text>
      
      <View style={styles.contactGrid}>
        {contactMethods.map((method, index) => (
          <TouchableOpacity
            key={index}
            style={styles.contactMethod(isDarkMode)}
            onPress={method.action}
            activeOpacity={0.7}
          >
            <Text style={styles.contactIcon}>{method.icon}</Text>
            <Text style={styles.contactLabel(isDarkMode)}>{method.label}</Text>
            <Text style={styles.contactValue(isDarkMode)}>{method.value}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// =========================================================================
// Tela Principal
// =========================================================================

export default function SobreScreen() {
  // Usar light mode como padrão - pode integrar com ThemeContext depois
  const isDarkMode = false;

  const appFeatures = [
    { icon: '⚡', text: 'Pagamentos Rápidos e Seguros' },
    { icon: '🎓', text: 'Gestão de Propinas Universitárias' },
    { icon: '📊', text: 'Histórico de Transações Detalhado' },
    { icon: '🔒', text: 'Proteção de Dados Avançada' },
    { icon: '📱', text: 'Interface Intuitiva e Moderna' },
    { icon: '🕒', text: 'Suporte 24/7' },
  ];

  const techStack = [
    { name: 'React Native', description: 'Framework mobile cross-platform' },
    { name: 'TypeScript', description: 'Linguagem tipada para maior segurança' },
    { name: 'Expo', description: 'Plataforma de desenvolvimento React Native' },
    { name: 'Node.js', description: 'Backend escalável e eficiente' },
    { name: 'PostgreSQL', description: 'Base de dados relacional segura' },
    { name: 'AWS', description: 'Infraestrutura em cloud' },
  ];

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent"
        translucent
      />
      
      {/* Header */}
      <View style={styles.header(isDarkMode)}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>INSUTEC PAY</Text>
          <Text style={styles.subLogo}>Sobre a Aplicação</Text>
        </View>
        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>v2.0.1</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection(isDarkMode)}>
          <View style={styles.appIcon}>
            <Text style={styles.appIconText}>💎</Text>
          </View>
          <Text style={styles.heroTitle(isDarkMode)}>Insutec Pay</Text>
          <Text style={styles.heroSubtitle(isDarkMode)}>
            Revolucionando os pagamentos universitários em Angola
          </Text>
          <Text style={styles.heroDescription(isDarkMode)}>
            Uma solução moderna e segura desenvolvida para facilitar as transações financeiras 
            da comunidade académica da Universidade INSUTEC.
          </Text>
        </View>

        {/* Info Cards */}
        <View style={styles.cardsContainer}>
          <InfoCard
            icon="🎯"
            title="Missão"
            description="Simplificar e modernizar o processo de pagamentos académicos, oferecendo uma experiência segura, rápida e intuitiva para estudantes, professores e funcionários."
            isDarkMode={isDarkMode}
          />
          
          <InfoCard
            icon="👁️"
            title="Visão"
            description="Ser a plataforma de referência em pagamentos digitais no sector educativo angolano, promovendo a inclusão financeira e tecnológica."
            isDarkMode={isDarkMode}
          />
          
          <InfoCard
            icon="⭐"
            title="Valores"
            description="Inovação, Segurança, Transparência, Eficiência e Compromisso com a excelência no atendimento à comunidade académica."
            isDarkMode={isDarkMode}
          />
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle(isDarkMode)}>Funcionalidades Principais</Text>
          <View style={styles.featuresGrid}>
            {appFeatures.map((feature, index) => (
              <FeatureItem
                key={index}
                icon={feature.icon}
                text={feature.text}
                isDarkMode={isDarkMode}
              />
            ))}
          </View>
        </View>

        {/* Statistics Section */}
        <View style={styles.statsSection(isDarkMode)}>
          <Text style={styles.statsTitle(isDarkMode)}>Em Números</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5,000+</Text>
              <Text style={styles.statLabel(isDarkMode)}>Utilizadores</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50,000+</Text>
              <Text style={styles.statLabel(isDarkMode)}>Transações</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>99.9%</Text>
              <Text style={styles.statLabel(isDarkMode)}>Uptime</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel(isDarkMode)}>Suporte</Text>
            </View>
          </View>
        </View>

        {/* Team Section */}
        <TeamCard isDarkMode={isDarkMode} />

        {/* Technology Stack */}
        <View style={styles.techSection(isDarkMode)}>
          <Text style={styles.techTitle(isDarkMode)}>Tecnologias Utilizadas</Text>
          <View style={styles.techGrid}>
            {techStack.map((tech, index) => (
              <View key={index} style={styles.techItem(isDarkMode)}>
                <Text style={styles.techName(isDarkMode)}>{tech.name}</Text>
                <Text style={styles.techDescription(isDarkMode)}>{tech.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact Section */}
        <ContactSection isDarkMode={isDarkMode} />

        {/* Footer */}
        <View style={styles.footer(isDarkMode)}>
          <Text style={styles.footerText(isDarkMode)}>
            © 2025 Insutec Pay. Todos os direitos reservados.
          </Text>
          <Text style={styles.footerSubText(isDarkMode)}>
            Desenvolvido com ❤️ por Ana Juliana A. C. Sobrinho
          </Text>
          <Text style={styles.footerNote(isDarkMode)}>
            Universidade INSUTEC - Transformando o futuro através da tecnologia
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
