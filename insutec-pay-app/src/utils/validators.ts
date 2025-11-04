// src/utils/validators.ts
export const ValidationRules = {
  identificador: (value: string): { isValid: boolean; message: string } => {
    if (!value) {
      return { isValid: false, message: 'Campo obrigatório' };
    }
    const isEmail = value.includes('@');
    if (isEmail) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return { isValid: false, message: 'Email inválido' };
      }
    } else {
      if (!/^\d{6}$/.test(value)) {
        return { isValid: false, message: 'Deve ter exatamente 6 dígitos' };
      }
    }
    return { isValid: true, message: '' };
  },

  senha: (value: string): { isValid: boolean; message: string } => {
    if (!value) {
      return { isValid: false, message: 'A senha é obrigatória' };
    }
    if (value.length < 6) {
      return { isValid: false, message: 'Mínimo 6 caracteres' };
    }
    return { isValid: true, message: '' };
  },
};
