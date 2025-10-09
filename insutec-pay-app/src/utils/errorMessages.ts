export class ErrorMessages {
  static getLoginErrorMessage(error: any): string {
    console.log('[ErrorMessages] Erro original:', error);
    
    const errorMessage = error.message || '';
    
    // Mapeamento de mensagens específicas da API
    if (errorMessage.includes('Número de estudante ou palavra-passe inválidos')) {
      return 'Número de estudante ou senha incorretos. Verifique suas credenciais.';
    }
    
    if (errorMessage.includes('Credenciais inválidas') || 
        errorMessage.includes('incorretos') || 
        errorMessage.includes('incorreta') ||
        errorMessage.includes('inválido') ||
        errorMessage.includes('não encontrado')) {
      return 'Número de estudante ou senha incorretos. Verifique suas credenciais.';
    }
    
    if (errorMessage.includes('rede') || 
        errorMessage.includes('conexão') || 
        errorMessage.includes('conectar') ||
        errorMessage.includes('network') ||
        errorMessage.includes('timeout')) {
      return 'Problema de conexão. Verifique sua internet e tente novamente.';
    }
    
    if (errorMessage.includes('servidor') || 
        errorMessage.includes('server') || 
        errorMessage.includes('indisponível')) {
      return 'Servidor temporariamente indisponível. Tente novamente em alguns minutos.';
    }
    
    // Mensagem genérica para outros erros
    return 'Ocorreu um erro ao fazer login. Tente novamente.';
  }

  static getRegisterErrorMessage(error: any): string {
    const errorMessage = error.message || '';
    
    if (errorMessage.includes('já existe') || errorMessage.includes('já está em uso')) {
      return 'Este número de estudante já está registrado.';
    }
    
    if (errorMessage.includes('Email já existe')) {
      return 'Este email já está em uso.';
    }
    
    if (errorMessage.includes('rede') || errorMessage.includes('conexão')) {
      return 'Problema de conexão. Verifique sua internet.';
    }
    
    return 'Erro ao criar conta. Tente novamente.';
  }

  static getLogoutErrorMessage(error: any): string {
    return 'Erro ao fazer logout. Tente novamente.';
  }
}
