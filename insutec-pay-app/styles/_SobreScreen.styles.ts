// styles/_SobreScreen.styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmall = width < 380;

export const COLORS = {
  primary: '#1a4a6d',
  primaryLight: '#2a5a8d',
  primaryDark: '#0d2a45',
  white: '#fff',
  textDark: '#333',
  textLight: '#eee',
  darkBackground: '#1c1c1c',
  lightBackground: '#f5f5f5',
  cardDark: '#2a2a2a',
  cardLight: '#fff',
};

const GRADIENTS = {
  primary: ['#1a4a6d', '#2a5a8d'],
  payButton: ['#1a4a6d', '#0d2a45'],
  headerLight: ['#e6f7ff', '#f0f8ff'],
  headerDark: ['#1e3a5f', '#2a4a7a'],
  cardLight: ['#f8f9ff', '#e6eeff'],
  cardDark: ['#2a3a50', '#1e2a40'],
};

export const GRADIENT = {
  header: (dark: boolean) => (dark ? GRADIENTS.headerDark : GRADIENTS.headerLight),
  payButton: (dark: boolean) => (dark ? GRADIENTS.payButton : GRADIENTS.primary),
  card: (dark: boolean) => (dark ? GRADIENTS.cardDark : GRADIENTS.cardLight),
};

export const createSobreStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    header: {
      paddingTop: 20,
      paddingBottom: 30,
      overflow: 'hidden',
    },
    headerGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 160,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    logoContainer: {},
    logo: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#fff',
    },
    subLogo: {
      fontSize: 14,
      color: '#fff',
      opacity: 0.9,
    },
    versionBadge: {
      backgroundColor: '#ffffff30',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    versionText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    },
    scrollContent: {
      paddingHorizontal: isSmall ? 12 : 16,
      paddingBottom: 30,
    },
    hero: {
      alignItems: 'center',
      marginBottom: 30,
      paddingHorizontal: 20,
    },
    appIcon: {
      width: 80,
      height: 80,
      borderRadius: 24,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
    },
    appIconText: {
      fontSize: 36,
    },
    heroTitle: (dark: boolean) => ({
      fontSize: 26,
      fontWeight: 'bold',
      color: dark ? '#fff' : COLORS.textDark,
      textAlign: 'center',
      marginBottom: 8,
    }),
    heroSubtitle: (dark: boolean) => ({
      fontSize: 16,
      color: dark ? '#ccc' : '#555',
      textAlign: 'center',
      marginBottom: 12,
    }),
    heroDescription: (dark: boolean) => ({
      fontSize: 14,
      color: dark ? '#aaa' : '#666',
      textAlign: 'center',
      lineHeight: 20,
    }),
    cardsSection: {
      marginBottom: 30,
    },
    infoCard: {
      marginBottom: 16,
      borderRadius: 20,
      overflow: 'hidden',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
    },
    infoCardGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    infoCardContent: {
      padding: 20,
    },
    infoIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    infoIconText: {
      fontSize: 24,
    },
    infoTitle: (dark: boolean) => ({
      fontSize: 18,
      fontWeight: '700',
      color: dark ? '#fff' : COLORS.textDark,
      marginBottom: 8,
    }),
    infoDescription: (dark: boolean) => ({
      fontSize: 14,
      color: dark ? '#bbb' : '#666',
      lineHeight: 20,
    }),
    section: {
      marginBottom: 30,
    },
    sectionTitle: (dark: boolean) => ({
      fontSize: 20,
      fontWeight: '700',
      color: dark ? '#fff' : COLORS.textDark,
      marginBottom: 16,
    }),
    featuresGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '48%',
      backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f8f8',
      padding: 14,
      borderRadius: 16,
      elevation: 2,
    },
    featureIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: COLORS.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    featureIcon: {
      fontSize: 20,
    },
    featureText: (dark: boolean) => ({
      flex: 1,
      fontSize: 14,
      color: dark ? '#eee' : '#333',
      fontWeight: '600',
    }),
    statsSection: {
      marginBottom: 30,
      padding: 20,
      backgroundColor: isDarkMode ? '#222' : '#f0f8ff',
      borderRadius: 20,
    },
    statsTitle: (dark: boolean) => ({
      fontSize: 20,
      fontWeight: '700',
      color: dark ? '#fff' : COLORS.primary,
      textAlign: 'center',
      marginBottom: 20,
    }),
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      color: COLORS.primary,
    },
    statLabel: (dark: boolean) => ({
      fontSize: 13,
      color: dark ? '#ccc' : '#555',
      marginTop: 4,
    }),
    teamSection: {
      marginBottom: 30,
    },
    teamTitle: (dark: boolean) => ({
      fontSize: 20,
      fontWeight: '700',
      color: dark ? '#fff' : COLORS.textDark,
      marginBottom: 16,
    }),
    teamCard: {
      backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
      borderRadius: 20,
      padding: 20,
      elevation: 4,
    },
    teamMember: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: COLORS.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    avatarText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    memberInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    memberName: (dark: boolean) => ({
      fontSize: 16,
      fontWeight: '600',
      color: dark ? '#fff' : COLORS.textDark,
    }),
    memberRole: (dark: boolean) => ({
      fontSize: 13,
      color: dark ? '#aaa' : '#666',
    }),
    memberEmail: (dark: boolean) => ({
      fontSize: 13,
      color: COLORS.primary,
      marginTop: 2,
    }),
    techSection: {
      marginBottom: 30,
    },
    techTitle: (dark: boolean) => ({
      fontSize: 20,
      fontWeight: '700',
      color: dark ? '#fff' : COLORS.textDark,
      marginBottom: 16,
    }),
    techGrid: {
      gap: 12,
    },
    techItem: {
      backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f8f8',
      padding: 16,
      borderRadius: 16,
      elevation: 2,
    },
    techName: (dark: boolean) => ({
      fontSize: 15,
      fontWeight: '600',
      color: dark ? '#fff' : COLORS.textDark,
    }),
    techDesc: (dark: boolean) => ({
      fontSize: 13,
      color: dark ? '#aaa' : '#666',
      marginTop: 4,
    }),
    contactSection: {
      marginBottom: 30,
    },
    contactTitle: (dark: boolean) => ({
      fontSize: 20,
      fontWeight: '700',
      color: dark ? '#fff' : COLORS.textDark,
      marginBottom: 16,
    }),
    contactButton: {
      marginBottom: 12,
      borderRadius: 16,
      overflow: 'hidden',
      elevation: 3,
    },
    contactGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    contactContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    contactIcon: {
      fontSize: 24,
      marginRight: 16,
    },
    contactLabel: (dark: boolean) => ({
      fontSize: 14,
      color: dark ? '#ccc' : '#555',
    }),
    contactValue: (dark: boolean) => ({
      fontSize: 15,
      fontWeight: '600',
      color: dark ? '#fff' : COLORS.textDark,
    }),
    footer: {
      alignItems: 'center',
      paddingVertical: 20,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#333' : '#ddd',
    },
    footerText: (dark: boolean) => ({
      fontSize: 13,
      color: dark ? '#aaa' : '#666',
      textAlign: 'center',
    }),
    footerSub: (dark: boolean) => ({
      fontSize: 12,
      color: COLORS.primary,
      marginTop: 8,
    }),
    footerNote: (dark: boolean) => ({
      fontSize: 11,
      color: dark ? '#888' : '#777',
      marginTop: 8,
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
