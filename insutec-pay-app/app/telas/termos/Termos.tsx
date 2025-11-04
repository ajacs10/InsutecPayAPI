// app/telas/termos/TermosScreen.tsx
import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Animated,
  Linking,
  StatusBar,
  Dimensions,
  SafeAreaView
} from 'react-native';

// SOLUÇÃO: Remover o ThemeContext temporariamente para evitar erros
// import { useTheme } from '../ThemeContext/ThemeContext';
import { styles } from '../../../styles/_TermosScreen.styles';

const { width, height } = Dimensions.get('window');

// =========================================================================
// Componentes de UI
// =========================================================================

interface SectionProps {
  title: string;
  content: string;
  isExpanded: boolean;
  onPress: () => void;
  isDarkMode: boolean;
  index: number;
}

const PolicySection: React.FC<SectionProps> = ({ 
  title, 
  content, 
  isExpanded, 
  onPress, 
  isDarkMode,
  index 
}) => {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isExpanded) {
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isExpanded]);

  const contentHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  const arrowRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity
        style={styles.sectionHeader(isDarkMode)}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.sectionNumber}>
          <Text style={styles.sectionNumberText}>{index}</Text>
        </View>
        <Text style={styles.sectionTitle(isDarkMode)}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
          <Text style={styles.sectionArrow}>▼</Text>
        </Animated.View>
      </TouchableOpacity>

      <Animated.View 
        style={[
          styles.sectionContent,
          {
            maxHeight: contentHeight,
            opacity: opacityAnim,
          }
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionText(isDarkMode)}>{content}</Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const ContactCard: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <View style={styles.contactCard(isDarkMode)}>
      <Text style={styles.contactTitle(isDarkMode)}>Suporte Insutec Pay</Text>
      
      <View style={styles.contactItem}>
        <Text style={styles.contactIcon}>📧</Text>
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel(isDarkMode)}>Email de Suporte</Text>
          <Text style={styles.contactValue(isDarkMode)}>suporte@insutecpay.ao</Text>
        </View>
      </View>

      <View style={styles.contactItem}>
        <Text style={styles.contactIcon}>🏫</Text>
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel(isDarkMode)}>Universidade INSUTEC</Text>
          <Text style={styles.contactValue(isDarkMode)}>geral@insutec.ao</Text>
        </View>
      </View>

      <View style={styles.contactItem}>
        <Text style={styles.contactIcon}>📞</Text>
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel(isDarkMode)}>Telefones</Text>
          <Text style={styles.contactValue(isDarkMode)}>+244 931 285 822</Text>
          <Text style={styles.contactValue(isDarkMode)}>+244 945 944 747</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.contactButton}
        onPress={() => Linking.openURL('mailto:suporte@insutecpay.ao')}
      >
        <Text style={styles.contactButtonText}>Contactar Suporte</Text>
      </TouchableOpacity>
    </View>
  );
};

// =========================================================================
// Tela Principal
// =========================================================================

export default function TermosScreen() {
  // SOLUÇÃO: Definir isDarkMode como false temporariamente
  const isDarkMode = false;
  
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const policySections = [
    {
      title: "Sobre o Insutec Pay",
      content: `O Insutec Pay é uma aplicação móvel desenvolvida por Ana Juliana Avelino da Costa Sobrinho para facilitar os pagamentos de recursos e serviços da Universidade INSUTEC. A aplicação permite que estudantes, professores e funcionários realizem transações financeiras de forma segura e eficiente.`
    },
    {
      title: "Finalidade da Aplicação",
      content: `O Insutec Pay foi criado com os seguintes objetivos:

• Facilitar o pagamento de propinas universitárias
• Permitir pagamento de serviços académicos
• Agilizar transações financeiras internas
• Reduzir filas e tempo de espera
• Oferecer uma experiência de pagamento moderna e segura`
    },
    {
      title: "Dados Recolhidos",
      content: `Para proporcionar os nossos serviços, recolhemos as seguintes informações:

• Dados de identificação (nome, número de estudante)
• Informações de contacto (email, telefone)
• Dados de transações financeiras
• Histórico de pagamentos
• Informações do dispositivo para segurança`
    },
    {
      title: "Segurança das Transações",
      content: `O Insutec Pay implementa as mais avançadas medidas de segurança:

• Criptografia de ponta a ponta em todas as transações
• Autenticação de dois fatores
• Monitorização contínua de atividades suspeitas
• Conformidade com regulamentos de proteção de dados
• Backup seguro de todas as informações

Todas as transações são processadas através de gateways de pagamento seguros e certificados.`
    },
    {
      title: "Política de Privacidade",
      content: `O Insutec Pay compromete-se a proteger a sua privacidade:

• Os seus dados são utilizados apenas para fornecer os serviços
• Não compartilhamos informações com terceiros não autorizados
• Pode solicitar a eliminação dos seus dados a qualquer momento
• Mantemos registos de transações conforme exigido por lei
• Implementamos medidas técnicas avançadas de proteção`
    },
    {
      title: "Direitos do Utilizador",
      content: `Como utilizador do Insutec Pay, tem o direito de:

• Aceder aos seus dados pessoais
• Corrigir informações incorretas
• Solicitar a eliminação da sua conta
• Exportar os seus dados de transações
• Ser informado sobre alterações nos termos
• Reportar problemas de segurança

Para exercer estes direitos, contacte: suporte@insutecpay.ao`
    },
    {
      title: "Transações e Pagamentos",
      content: `Funcionalidades de pagamento disponíveis:

• Pagamento de propinas e taxas académicas
• Pagamento de serviços universitários
• Histórico completo de transações
• Recibos digitais automáticos
• Notificações de confirmação
• Suporte a múltiplos métodos de pagamento

Todas as transações são processadas em tempo real.`
    },
    {
      title: "Responsabilidades",
      content: `Responsabilidades do utilizador:

• Manter a confidencialidade da sua conta
• Reportar atividades suspeitas imediatamente
• Verificar as informações antes de confirmar pagamentos
• Manter a aplicação atualizada
• Utilizar métodos de pagamento válidos

O Insutec Pay não se responsabiliza por perdas resultantes de negligência do utilizador.`
    },
    {
      title: "Suporte Técnico",
      content: `Canais de suporte disponíveis:

• Email: suporte@insutecpay.ao
• Telefone: +244 945 944 747
• Horário: Segunda a Sexta, 8h00-18h00
• Resposta em até 24 horas úteis

Estamos sempre disponíveis para ajudar com qualquer problema técnico ou dúvida sobre a aplicação.`
    },
    {
      title: "Atualizações da Aplicação",
      content: `O Insutec Pay será atualizado regularmente para:

• Melhorar a segurança
• Adicionar novas funcionalidades
• Corrigir problemas identificados
• Manter a compatibilidade com sistemas

Os utilizadores serão notificados sobre atualizações importantes através da aplicação.`
    },
    {
      title: "Propriedade Intelectual",
      content: `Todos os direitos sobre o Insutec Pay são reservados:

• Desenvolvido por: Ana Juliana Avelino da Costa Sobrinho
• Propriedade: INSUTEC
• Licença: Uso exclusivo para a comunidade INSUTEC
• Ano: 2025

É proibida a reprodução ou distribuição não autorizada.`
    },
    {
      title: "Contactos de Emergência",
      content: `Em caso de problemas urgentes:

• Perda ou roubo do dispositivo: +244 931 285 822
• Transações não autorizadas: +244 945 944 747
• Problemas de segurança: segurança@insutecpay.ao
• Suporte técnico 24/7 para emergências

Mantenha estes contactos guardados em local seguro.`
    }
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
          <Text style={styles.subLogo}>Termos e Políticas</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.badgeText}>v2.0</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card de Introdução */}
        <View style={styles.introCard(isDarkMode)}>
          <Text style={styles.introTitle(isDarkMode)}>
            Bem-vindo ao Insutec Pay
          </Text>
          <Text style={styles.introText(isDarkMode)}>
            Aplicação oficial de pagamentos da Universidade INSUTEC. Desenvolvida para facilitar suas transações académicas de forma segura e eficiente.
          </Text>
          <View style={styles.updateInfo}>
            <Text style={styles.updateLabel(isDarkMode)}>Desenvolvedora:</Text>
            <Text style={styles.updateDate}>Ana Juliana A. C. Sobrinho</Text>
          </View>
        </View>

        {/* Seções da Política */}
        <View style={styles.sectionsContainer}>
          <Text style={styles.sectionsTitle(isDarkMode)}>
            Termos de Utilização
          </Text>
          
          {policySections.map((section, index) => (
            <PolicySection
              key={index}
              title={section.title}
              content={section.content}
              isExpanded={expandedSection === index}
              onPress={() => toggleSection(index)}
              isDarkMode={isDarkMode}
              index={index + 1}
            />
          ))}
        </View>

        {/* Card de Contacto */}
        <ContactCard isDarkMode={isDarkMode} />

        {/* Footer */}
        <View style={styles.footer(isDarkMode)}>
          <Text style={styles.footerText(isDarkMode)}>
            © 2025 Todos Direitos Reservados INSUTEC PAY
          </Text>
          <Text style={styles.footerSubText(isDarkMode)}>
            Desenvolvido por Ana Juliana Avelino da Costa Sobrinho
          </Text>
          
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text style={styles.footerLink(isDarkMode)}>Política de Privacidade</Text>
            </TouchableOpacity>
            <Text style={styles.footerSeparator}>|</Text>
            <TouchableOpacity>
              <Text style={styles.footerLink(isDarkMode)}>Termos de Utilização</Text>
            </TouchableOpacity>
            <Text style={styles.footerSeparator}>|</Text>
            <TouchableOpacity>
              <Text style={styles.footerLink(isDarkMode)}>Suporte Técnico</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
