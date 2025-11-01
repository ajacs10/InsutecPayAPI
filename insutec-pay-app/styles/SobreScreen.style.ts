// styles/_SobreScreen.styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmall = width < 380;
const isLarge = width > 700;

export const COLORS = {
  primary: '#1a4a6d',
  primaryLight: '#2a5a8d',
  primaryDark: '#0d2a45',
  white: '#fff',
  textDark: '#333',
  textLight: '#eee',
  darkBackground: '#1c1c1c',
  lightBackground: '#f5f5f5',
};

const GRADIENTS = {
  headerLight: ['#e6f7ff', '#f0f8ff'],
  headerDark: ['#1e3a5f', '#2a4a7a'],
  cardLight: ['#f8f9ff', '#e6eeff'],
  cardDark: ['#2a3a50', '#1e2a40'],
};

export const GRADIENT = {
  header: (dark: boolean) => (dark ? GRADIENTS.headerDark : GRADIENTS.headerLight),
  card: (dark: boolean) => (dark ? GRADIENTS.cardDark : GRADIENTS.cardLight),
};

export const createSobreStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    header: {
      paddingTop: isLarge ? 60 : 40,
      paddingBottom: isLarge ? 50 : 30,
      overflow: 'hidden',
    },
    headerGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: isLarge ? 240 : 200,
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: isLarge ? 50 : 24,
    },
    logoImage: {
      width: isLarge ? 1 : 1,
      height: isLarge ? 20 : 20,
      borderRadius: 16,
      marginRight: 18,
    },
    logoTextContainer: { flex: 1 },
    logo: {
      fontSize: isLarge ? 30 : 26,
      fontWeight: 'bold',
      color: '#fff',
    },
    subLogo: {
      fontSize: isLarge ? 20 : 30,
      color: '#fff',
      opacity: 0.9,
    },
    versionBadge: {
      backgroundColor: '#ffffff30',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 24,
    },
    versionText: { color: '#fff', fontSize: 14, fontWeight: '600' },

    scrollContent: {
      paddingHorizontal: isLarge ? 60 : (isSmall ? 18 : 24),
      paddingBottom: 50,
    },

    hero: {
      alignItems: 'center',
      marginBottom: isLarge ? 60 : 40,
      paddingHorizontal: 20,
    },
    appIcon: {
      width: isLarge ? 130 : 110,
      height: isLarge ? 130 : 110,
      borderRadius: isLarge ? 34 : 28,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
      elevation: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.22,
      shadowRadius: 20,
    },
    appIconImage: { width: '72%', height: '72%' },
    heroTitle: (dark: boolean) => ({
      fontSize: isLarge ? 36 : 30,
      fontWeight: 'bold',
      color: dark ? '#fff' : COLORS.textDark,
      textAlign: 'center',
      marginBottom: 12,
    }),
    heroSubtitle: (dark: boolean) => ({
      fontSize: isLarge ? 22 : 18,
      color: dark ? '#ddd' : '#555',
      textAlign: 'center',
      marginBottom: 14,
    }),
    heroDescription: (dark: boolean) => ({
      fontSize: isLarge ? 18 : 15,
      color: dark ? '#bbb' : '#666',
      textAlign: 'center',
      lineHeight: 24,
    }),

    cardsSection: {
      marginBottom: isLarge ? 60 : 40,
      flexDirection: isLarge ? 'row' : 'column',
      gap: isLarge ? 30 : 0,
    },
    infoCard: {
      marginBottom: isLarge ? 0 : 20,
      borderRadius: 28,
      overflow: 'hidden',
      elevation: 8,
      width: isLarge ? '31%' : '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.16,
      shadowRadius: 16,
    },
    infoCardGradient: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    infoCardContent: { padding: isLarge ? 32 : 26 },
    infoIcon: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    infoTitle: (dark: boolean) => ({
      fontSize: isLarge ? 22 : 20,
      fontWeight: '700',
      color: dark ? '#fff' : COLORS.textDark,
      marginBottom: 12,
    }),
    infoDescription: (dark: boolean) => ({
      fontSize: isLarge ? 16 : 15,
      color: dark ? '#ccc' : '#666',
      lineHeight: 24,
    }),

    section: { marginBottom: isLarge ? 60 : 40 },
    sectionTitle: (dark: boolean) => ({
      fontSize: isLarge ? 28 : 24,
      fontWeight: '700',
      color: dark ? '#fff' : COLORS.textDark,
      marginBottom: 20,
      textAlign: isLarge ? 'center' : 'left',
    }),
    featuresGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 16,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      width: isLarge ? '32%' : (isSmall ? '100%' : '48%'),
      backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f8f8',
      padding: isLarge ? 22 : 18,
      borderRadius: 20,
      elevation: 4,
      marginBottom: isLarge ? 18 : 0,
    },
    featureIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: COLORS.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    featureText: (dark: boolean) => ({
      flex: 1,
      fontSize: 16,
      color: dark ? '#eee' : '#333',
      fontWeight: '600',
    }),

    // EQUIPE
    teamSection: {
      marginBottom: isLarge ? 60 : 40,
      padding: isLarge ? 40 : 30,
      backgroundColor: isDarkMode ? '#222' : '#f0f8ff',
      borderRadius: 28,
      alignItems: 'center',
    },
    teamTitle: (dark: boolean) => ({
      fontSize: isLarge ? 28 : 24,
      fontWeight: '700',
      color: dark ? '#fff' : COLORS.primary,
      marginBottom: 24,
      textAlign: 'center',
    }),
    teamCard: {
      flexDirection: 'row',
      backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
      borderRadius: 24,
      padding: isLarge ? 32 : 26,
      elevation: 10,
      width: isLarge ? '70%' : '100%',
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.22,
      shadowRadius: 16,
    },
    avatar: {
      width: isLarge ? 88 : 72,
      height: isLarge ? 88 : 72,
      borderRadius: isLarge ? 44 : 36,
      backgroundColor: COLORS.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 20,
    },
    avatarText: {
      color: '#fff',
      fontSize: isLarge ? 26 : 20,
      fontWeight: 'bold',
    },
    memberInfo: { flex: 1, justifyContent: 'center' },
    memberName: (dark: boolean) => ({
      fontSize: isLarge ? 21 : 19,
      fontWeight: '700',
      color: dark ? '#fff' : COLORS.textDark,
    }),
    memberRole: (dark: boolean) => ({
      fontSize: isLarge ? 16 : 15,
      color: dark ? '#aaa' : '#666',
      marginTop: 6,
    }),
    memberLinks: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 18,
      marginTop: 14,
    },
    linkButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    linkText: {
      color: COLORS.primary,
      fontSize: 15,
      fontWeight: '600',
    },

    // RODAPÉ
    footer: {
      alignItems: 'center',
      paddingVertical: 30,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#333' : '#ddd',
    },
    footerText: (dark: boolean) => ({
      fontSize: 15,
      color: dark ? '#aaa' : '#666',
      textAlign: 'center',
    }),
    footerSub: (dark: boolean) => ({
      fontSize: 14,
      color: dark ? '#999' : '#777',
      marginTop: 8,
      fontWeight: '500',
    }),
    footerNote: (dark: boolean) => ({
      fontSize: 13,
      color: dark ? '#888' : '#888',
      marginTop: 10,
      fontStyle: 'italic',
    }),
  });

export const sharedStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
    },
  });
