// src/utils/validators.ts
export const ValidationRules = {
  numeroEstudante: (value: string): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: 'O número de estudante é obrigatório' };
    }

    const cleanValue = value.replace(/\s/g, '');
    
    if (!/^\d+$/.test(cleanValue)) {
      return { isValid: false, message: 'Apenas números são permitidos no número de estudante' };
    }

    if (cleanValue.length !== 6) {
      return { isValid: false, message: 'O número de estudante deve ter exatamente 6 dígitos' };
    }

    return { isValid: true, message: '' };
  },

  senha: (value: string): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: 'A senha é obrigatória' };
    }

    if (/\s/.test(value)) {
      return { isValid: false, message: 'A senha não pode conter espaços' };
    }

    if (value.length < 6) {
      return { isValid: false, message: 'A senha deve ter pelo menos 6 caracteres' };
    }

    return { isValid: true, message: '' };
  },
};

export const formatNumeroEstudante = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers.slice(0, 6);
};

export const cleanSenha = (value: string): string => {
  return value.replace(/\s/g, '');
};
