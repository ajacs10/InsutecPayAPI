import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const COLORS = {
  primary: '#39FF14',
  success: '#00C853',
  danger: '#FF5252',
  white: '#FFFFFF',
  darkBackground: '#0F0F0F',
  lightBackground: '#F0F2F5',
  cardDark: '#1F1F1F',
  cardLight: '#FFFFFF',
  textDark: '#1C1C1C',
  textLight: '#E0E0E0',
  subText: '#888888',
  gray: '#9E9E9E',
  lightGray: '#E0E0E0',
  greenLight: 'rgba(0, 200, 83, 0.1)',
  redLight: 'rgba(255, 82, 82, 0.1)',
};

export const styles = StyleSheet.create({
  // Container Principal
  safeArea: (isDarkMode: boolean) => ({
    flex: 1,
    backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground,
  }),

  // Botões no Topo
  headerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },

  smallButton: (isDarkMode: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: isDarkMode ? COLORS.gray : COLORS.lightGray,
    backgroundColor: 'transparent',
    gap: 6,
  }),

  smallPrimaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    gap: 6,
  },

  smallButtonText: (isDarkMode: boolean) => ({
    fontSize: 12,
    fontWeight: '600',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
  }),

  smallPrimaryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },

  // Lista
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  listContainer: {
    flexGrow: 1,
    padding: 16,
  },

  listHeader: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },

  listTitle: (isDarkMode: boolean) => ({
    fontSize: 22,
    fontWeight: 'bold',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 4,
  }),

  listSubtitle: (isDarkMode: boolean) => ({
    fontSize: 14,
    color: isDarkMode ? COLORS.subText : COLORS.gray,
    marginBottom: 8,
  }),

  instructionText: (isDarkMode: boolean) => ({
    fontSize: 11,
    color: isDarkMode ? COLORS.subText : COLORS.gray,
    fontStyle: 'italic',
  }),

  // Item de Comprovativo
  comprovativoCard: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    shadowColor: isDarkMode ? '#000' : COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  }),

  comprovativoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  comprovativoInfo: {
    flex: 1,
    marginRight: 12,
  },

  comprovativoTitle: (isDarkMode: boolean) => ({
    fontSize: 15,
    fontWeight: '600',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    lineHeight: 20,
    marginBottom: 4,
  }),

  valueContainer: {
    alignItems: 'flex-end',
    gap: 8,
  },

  comprovativoValue: (isDarkMode: boolean) => ({
    fontSize: 16,
    fontWeight: 'bold',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
  }),

  downloadButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
  },

  comprovativoDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  comprovativoDate: (isDarkMode: boolean) => ({
    fontSize: 12,
    color: isDarkMode ? COLORS.subText : COLORS.gray,
    marginLeft: 6,
  }),

  statusContainer: {
    flexShrink: 0,
  },

  statusBadge: (tipo: string) => ({
    backgroundColor: tipo === 'Débito' ? COLORS.redLight : COLORS.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  }),

  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  serviceType: (isDarkMode: boolean) => ({
    fontSize: 11,
    color: isDarkMode ? COLORS.subText : COLORS.gray,
    fontStyle: 'italic',
  }),

  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  paymentMethodText: (isDarkMode: boolean) => ({
    fontSize: 10,
    color: isDarkMode ? COLORS.subText : COLORS.gray,
    marginLeft: 6,
    fontStyle: 'italic',
  }),

  // Estado Vazio
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  title: (isDarkMode: boolean) => ({
    fontSize: 24,
    fontWeight: 'bold',
    color: isDarkMode ? COLORS.textLight : COLORS.textDark,
    marginBottom: 8,
    textAlign: 'center',
  }),

  emptyText: (isDarkMode: boolean) => ({
    fontSize: 14,
    color: isDarkMode ? COLORS.subText : COLORS.gray,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  }),

  emptySubtext: (isDarkMode: boolean) => ({
    fontSize: 12,
    color: isDarkMode ? COLORS.subText : COLORS.gray,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  }),
});
