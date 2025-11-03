// styles/_SobreScreen.styles.ts
import { StyleSheet, Dimensions, Platform } from 'react-native';

export const COLORS = {
  accent: '#00d4ff',
  primary: '#6e48aa',
  white: '#ffffff',
  darkBackground: '#0a1a2f',
  cardDark: '#112240',
};

export const createSobreStyles = (isDarkMode: boolean) => {
  const { width } = Dimensions.get('window');
  const isSmall = width < 380;
  const isLarge = width > 700;

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.darkBackground,
    },
    scrollContent: {
      flexGrow: 1,
      paddingVertical: isLarge ? 100 : 80,
      alignItems: 'center',
    },

    // FUNDO COM CIRCUITO
    circuitBackground: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.12,
    },

    // LOGO CENTRAL
    heroContainer: {
      alignItems: 'center',
      marginBottom: isLarge ? 110 : 90,
      zIndex: 10,
    },
    brandText: {
      fontSize: isLarge ? 68 : 56,
      fontWeight: '900',
      color: COLORS.primary,
      letterSpacing: 6,
      textAlign: 'center',
      textShadowColor: COLORS.primary,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 25,
      ...Platform.select({
        web: {
          filter: 'drop-shadow(0 0 28px #6e48aa)',
          WebkitTextStroke: '1px #9d50bb',
        },
      }),
    },
    brandSubText: {
      fontSize: isLarge ? 62 : 50,
      fontWeight: '900',
      color: COLORS.accent,
      letterSpacing: 5,
      marginTop: -16,
      textAlign: 'center',
      textShadowColor: COLORS.accent,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 32,
      ...Platform.select({
        web: {
          filter: 'drop-shadow(0 0 32px #00d4ff)',
          WebkitTextStroke: '1px #00ffff',
        },
      }),
    },

    // GRID DE HEXÁGONOS
    hexGrid: {
      position: 'relative',
      width: isLarge ? 600 : isSmall ? 380 : 520,
      height: isLarge ? 660 : isSmall ? 380 : 520,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },

    // RODAPÉ
    footer: {
      marginTop: 140,
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    footerText: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
    },
    footerTag: {
      fontSize: 16,
      color: COLORS.accent,
      marginTop: 8,
      fontWeight: '700',
      letterSpacing: 1,
    },
  });
};
