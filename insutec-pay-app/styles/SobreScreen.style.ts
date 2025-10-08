// styles/_SobreScreen.styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Cores para o Insutec Pay
const COLORS = {
  primary: '#2563eb',
  secondary: '#1e40af',
  accent: '#3b82f6',
  white: '#ffffff',
  black: '#000000',
  gray: '#6b7280',
  lightGray: '#f3f4f6',
  darkGray: '#374151',
  lightBackground: '#ffffff',
  darkBackground: '#111827',
  textLight: '#ffffff',
  textDark: '#1f2937',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

const FONT_SIZES = {
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 18,
  p: 16,
  small: 14,
  xsmall: 12,
};

export const styles = {
  // Container Principal
  container: (isDarkMode: boolean) => ({
    flex: 1,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
  }),

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  // Header
  header: (isDarkMode: boolean) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  }),

  logoContainer: {
    flex: 1,
  },

  logo: {
    fontSize: FONT_SIZES.h1,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 2,
  },

  subLogo: {
    fontSize: FONT_SIZES.small,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
  },

  versionBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  versionText: {
    fontSize: FONT_SIZES.xsmall,
    fontWeight: '600',
    color: COLORS.white,
  },

  // Hero Section
  heroSection: (isDarkMode: boolean) => ({
    alignItems: 'center',
    padding: 30,
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(59, 130, 246, 0.05)',
    margin: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(59, 130, 246, 0.1)',
  }),

  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  appIconText: {
    fontSize: 40,
  },

  heroTitle: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.h1,
    fontWeight: '800',
    color: isDarkMode ? COLORS.textLight : COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  }),

  heroSubtitle: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.h3,
    fontWeight: '600',
    color: isDarkMode ? 'rgba(255,255,255,0.8)' : COLORS.gray,
    marginBottom: 16,
    textAlign: 'center',
  }),

  heroDescription: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.p,
    lineHeight: 24,
    color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.textDark,
    textAlign: 'center',
  }),

  // Cards Container
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },

  infoCard: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : COLORS.white,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  }),

  infoCardIcon: {
    fontSize: 32,
    marginBottom: 12,
  },

  infoCardTitle: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.h3,
    fontWeight: '700',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 8,
  }),

  infoCardDescription: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.p,
    lineHeight: 22,
    color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.gray,
  }),

  // Sections
  section: {
    paddingHorizontal: 20,
    marginTop: 32,
  },

  sectionTitle: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.h2,
    fontWeight: '700',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 20,
    textAlign: 'center',
  }),

  // Features
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },

  featureItem: {
    width: (width - 60) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    marginBottom: 8,
  },

  featureIcon: {
    fontSize: 20,
    marginRight: 8,
  },

  featureText: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
    color: isDarkMode ? COLORS.textLight : COLORS.primary,
    flex: 1,
  }),

  // Statistics
  statsSection: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(59, 130, 246, 0.05)',
    margin: 20,
    padding: 24,
    borderRadius: 20,
    marginTop: 32,
  }),

  statsTitle: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.h2,
    fontWeight: '700',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 20,
    textAlign: 'center',
  }),

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  statItem: {
    width: (width - 80) / 2,
    alignItems: 'center',
    marginBottom: 20,
  },

  statNumber: {
    fontSize: FONT_SIZES.h1,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },

  statLabel: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
    color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.gray,
    textAlign: 'center',
  }),

  // Team Section
  teamCard: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : COLORS.white,
    margin: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 8,
    elevation: 6,
  }),

  teamTitle: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.h2,
    fontWeight: '700',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 20,
    textAlign: 'center',
  }),

  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  memberAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  avatarText: {
    fontSize: FONT_SIZES.h4,
    fontWeight: '700',
    color: COLORS.white,
  },

  memberInfo: {
    flex: 1,
  },

  memberName: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.p,
    fontWeight: '600',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 4,
  }),

  memberRole: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.small,
    color: isDarkMode ? 'rgba(255,255,255,0.6)' : COLORS.gray,
    marginBottom: 2,
  }),

  memberContact: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.xsmall,
    color: COLORS.primary,
    fontWeight: '500',
  }),

  // Technology Section
  techSection: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(59, 130, 246, 0.05)',
    margin: 20,
    padding: 24,
    borderRadius: 20,
  }),

  techTitle: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.h2,
    fontWeight: '700',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 20,
    textAlign: 'center',
  }),

  techGrid: {
    gap: 12,
  },

  techItem: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : COLORS.white,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  }),

  techName: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.p,
    fontWeight: '600',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 4,
  }),

  techDescription: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.small,
    color: isDarkMode ? 'rgba(255,255,255,0.6)' : COLORS.gray,
  }),

  // Contact Section
  contactSection: (isDarkMode: boolean) => ({
    margin: 20,
    padding: 24,
    borderRadius: 20,
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 8,
    elevation: 6,
  }),

  contactTitle: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.h2,
    fontWeight: '700',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 20,
    textAlign: 'center',
  }),

  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },

  contactMethod: (isDarkMode: boolean) => ({
    width: (width - 80) / 2,
    alignItems: 'center',
    padding: 16,
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(59, 130, 246, 0.2)',
  }),

  contactIcon: {
    fontSize: 24,
    marginBottom: 8,
  },

  contactLabel: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 4,
  }),

  contactValue: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.xsmall,
    color: isDarkMode ? 'rgba(255,255,255,0.6)' : COLORS.gray,
    textAlign: 'center',
  }),

  // Footer
  footer: (isDarkMode: boolean) => ({
    padding: 24,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    marginTop: 20,
  }),

  footerText: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 8,
    textAlign: 'center',
  }),

  footerSubText: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.xsmall,
    color: isDarkMode ? 'rgba(255,255,255,0.6)' : COLORS.gray,
    marginBottom: 8,
    textAlign: 'center',
  }),

  footerNote: (isDarkMode: boolean) => ({
    fontSize: FONT_SIZES.xsmall,
    color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
    fontStyle: 'italic',
    textAlign: 'center',
  }),
};
