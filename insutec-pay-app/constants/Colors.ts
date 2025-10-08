// constants/Colors.ts

// =========================================================================
// CORES ESTÁTICAS DE USO GERAL (Para botões, ícones, alertas, etc.)
// =========================================================================
export const COMMON_COLORS = {
  // Cor Principal (Primary): Azul forte para botões e navegação
  primary: '#007AFF',
  primaryDark: '#005ACF',

  // Cor Secundária (Success): Verde para sucesso ou transações positivas
  secondary: '#34C759', 

  // Alerta/Erro/Sair
  danger: '#FF3B30', 
  
  // Cores Neutras
  white: '#FFFFFF',
  black: '#000000',
  red: '#FF3B30', 
};


// =========================================================================
// CORES DE TEMA (Baseado nos seus estilos de fundo e texto)
// =========================================================================

// Cores de Tinta (Tint) para elementos de destaque
const tintColorLight = COMMON_COLORS.primary; 
const tintColorDark = COMMON_COLORS.white;

export const THEME_COLORS = {
  light: {
    text: COMMON_COLORS.black,
    background: '#F9F9F9', // Um branco suave
    tint: tintColorLight,
    tabIconDefault: '#8e8e93', // Cinza iOS padrão
    tabIconSelected: tintColorLight,
    
    // Nível de Cinza para Backgrounds secundários (Ex: Itens de Ajuda)
    lightGray: '#E5E5EA', 
    darkGray: '#D1D1D6', 
  },
  dark: {
    text: COMMON_COLORS.white,
    background: '#1C1C1E', // Um preto quase escuro (Dark Mode iOS)
    tint: tintColorDark,
    tabIconDefault: '#8e8e93',
    tabIconSelected: tintColorDark,

    // Nível de Cinza para Backgrounds secundários (Ex: Itens de Ajuda)
    lightGray: '#3A3A3C', 
    darkGray: '#48484A', 
  },
};


// =========================================================================
// EXPORTAÇÃO UNIFICADA (Para ser usado em todos os arquivos de estilos)
// =========================================================================
export const COLORS = {
  ...COMMON_COLORS,
  // Para compatibilidade com seus arquivos de estilo customizados
  darkBackground: THEME_COLORS.dark.background,
  lightBackground: THEME_COLORS.light.background,
  textLight: THEME_COLORS.dark.text, // Texto para fundo escuro
  textDark: THEME_COLORS.light.text, // Texto para fundo claro
  lightGray: THEME_COLORS.light.lightGray, // Usado em _VerAjuda.styles.ts
  darkGray: THEME_COLORS.dark.darkGray, // Usado em _VerAjuda.styles.ts
};

// Se você tiver um hook useColorScheme do Expo que espera esta estrutura
export default THEME_COLORS;
