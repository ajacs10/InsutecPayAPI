// app/telas/termos/SobreScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Dimensions, Animated, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const isSmall = width < 380;
const isLarge = width > 700;
const isPortrait = height > width;

// RESPONSIVO MELHORADO (ajusta para celular pequeno)
const radius = isSmall ? (isPortrait ? 120 : 140) : isLarge ? 260 : 200;
const hexSize = isSmall ? 85 : isLarge ? 140 : 115;
const gridSize = isSmall ? 320 : isLarge ? 700 : 520;

// ÍCONE
const SafeIcon = ({ name, size, x, y }: { name: string; size: number; x: number; y: number }) => {
  const map: Record<string, string> = {
    globe: 'globe-americas',
    shield: 'shield-alt',
    users: 'users-cog',
    mobile: 'mobile-alt',
    lightbulb: 'lightbulb',
    gears: 'cogs',
  };
  return (
    <G x={x} y={y}>
      <FontAwesome5 name={map[name] || name} size={size} color="#00d4ff" />
    </G>
  );
};

// HEXÁGONO
const Hexagon = ({ size, icon, innerText }: { size: number; icon: string; innerText: string }) => {
  const path = `M${size * 0.5},0 L${size},${size * 0.25} L${size},${size * 0.75} L${size * 0.5},${size} L0,${size * 0.75} L0,${size * 0.25} Z`;
  const iconSize = size * 0.35;
  const textSize = size * 0.10;
  const centerX = size / 2;
  const centerY = size / 2;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Path d={path} fill="#ffffff" />
      <Path d={path} fill="none" stroke="#00d4ff" strokeWidth={3.5} />
      <SafeIcon name={icon} size={iconSize} x={centerX - iconSize / 2} y={centerY - iconSize / 2 - textSize / 2} />
      <SvgText
        x={centerX}
        y={centerY + iconSize / 2 + textSize / 2}
        fontSize={textSize}
        fill="#0a1a2f"
        fontWeight="700"
        textAnchor="middle"
      >
        {innerText}
      </SvgText>
    </Svg>
  );
};

// CARD MODAL CENTRAL
const CenterCard = ({ title, explanation, isVisible, onClose }: { 
  title: string; 
  explanation: string; 
  isVisible: boolean; 
  onClose: () => void;
}) => {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 8, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scale, { toValue: 0.8, friction: 8, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Modal transparent visible={isVisible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modalCard, { transform: [{ scale }], opacity }]}>
              <Text style={styles.modalTitle}>{title}</Text>
              <Text style={styles.modalText}>{explanation}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeText}>Fechar</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// HEXÁGONO CLICÁVEL
const HexCard = ({ 
  icon, 
  title, 
  innerText, 
  explanation, 
  delay, 
  size,
  onPress 
}: { 
  icon: string; 
  title: string; 
  innerText: string; 
  explanation: string;
  delay: number; 
  size: number;
  onPress: () => void;
}) => {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 8,
      tension: 60,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <View style={{ alignItems: 'center' }}>
          <Hexagon size={size} icon={icon} innerText={innerText} />
          <Text style={styles.title}>{title}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// DADOS
const hexData = [
  { icon: 'globe', title: 'VISÃO', inner: 'barco', explanation: 'Visão global de inovação financeira em Angola.' },
  { icon: 'shield', title: 'MISSÃO', inner: 'barco', explanation: 'Proteger transações com segurança máxima.' },
  { icon: 'mobile', title: 'TECNOLOGIAS', inner: 'barco', explanation: 'React Native, Node.js e blockchain.' },
  { icon: 'users', title: 'DESENVOLVEDORES', inner: 'barco', explanation: 'Time angolano de alta performance.' },
  { icon: 'lightbulb', title: 'INOVAÇÃO', inner: 'porque é inovação', explanation: 'Pagamentos instantâneos, IA e carteiras digitais.' },
  { icon: 'gears', title: 'EFICIÊNCIA', inner: 'barco', explanation: '99.9% uptime e processos otimizados.' },
];

export default function SobreScreen() {
  const [selected, setSelected] = useState<{ title: string; explanation: string } | null>(null);

  const handlePress = (item: typeof hexData[0]) => {
    setSelected({ title: item.title, explanation: item.explanation });
  };

  const closeModal = () => setSelected(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEXÁGONOS */}
        <View style={[styles.grid, { width: gridSize, height: gridSize }]}>
          {hexData.map((item, i) => {
            const angle = (i * 60) * (Math.PI / 180);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  transform: [{ translateX: x }, { translateY: y }],
                }}
              >
                <HexCard
                  icon={item.icon}
                  title={item.title}
                  innerText={item.inner}
                  explanation={item.explanation}
                  delay={i * 100}
                  size={hexSize}
                  onPress={() => handlePress(item)}
                />
              </View>
            );
          })}
        </View>

        {/* RODAPÉ COM ASSINATURA + REDES SOCIAIS */}
        <View style={styles.footer}>
          <Text style={styles.signature}>Desenvolvido por Ana Sobrinho</Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity style={styles.socialButton} onPress={() => console.log('GitHub')}>
              <FontAwesome5 name="github" size={20} color="#00d4ff" />
              <Text style={styles.socialText}>GitHub</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => console.log('LinkedIn')}>
              <FontAwesome5 name="linkedin" size={20} color="#00d4ff" />
              <Text style={styles.socialText}>LinkedIn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => console.log('Instagram')}>
              <FontAwesome5 name="instagram" size={20} color="#00d4ff" />
              <Text style={styles.socialText}>Instagram</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CARD CENTRAL */}
        {selected && (
          <CenterCard
            title={selected.title}
            explanation={selected.explanation}
            isVisible={!!selected}
            onClose={closeModal}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// ESTILOS RESPONSIVOS
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a1a2f',
  },
  container: {
    flex: 1,
    backgroundColor: '#0a1a2f',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60, // Espaço para rodapé
  },
  grid: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 12,
    fontSize: isSmall ? 12 : 14,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1.2,
    textAlign: 'center',
    textShadowColor: '#00d4ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  // MODAL (mantido)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: width * 0.85,
    maxWidth: 400,
    backgroundColor: '#112240',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#00d4ff',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#00d4ff',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1.5,
  },
  modalText: {
    fontSize: 15,
    color: '#a0d8ff',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#00d4ff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeText: {
    color: '#0a1a2f',
    fontWeight: '700',
    fontSize: 16,
  },
  // RODAPÉ + REDES
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  signature: {
    fontSize: 14,
    color: '#a0d8ff',
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: isSmall ? '80%' : '60%',
  },
  socialButton: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  socialText: {
    color: '#a0d8ff',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});
