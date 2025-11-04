// components/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Assumindo que 'api' está corretamente configurado para chamadas HTTP
import { api } from '../src/api/InsutecPayAPI'; 

interface Aluno {
  id: number;
  nome_completo?: string;
  nome?: string;
  email?: string;
  nr_estudante?: string;
  tipo_usuario: string;
  curso?: string;
  [key: string]: any;
}

interface AuthContextType {
  aluno: Aluno | null;
  signIn: (identificador: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState(true);

  // === CARREGA USUÁRIO SALVO AO INICIAR ===
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('@InsutecPay:user');
        if (stored) {
          const user = JSON.parse(stored);
          setAluno(user);
          console.log('[Auth] Usuário carregado:', user.nr_estudante);
        }
      } catch (error) {
        console.error('[Auth] Erro ao carregar usuário:', error);
      } finally {
        // ✅ Garante que o loading para o carregamento inicial termine
        setLoading(false); 
      }
    };

    loadStoredUser();
  }, []);

  // === LOGIN FLEXÍVEL (EMAIL OU NÚMERO) ===
  const signIn = async (identificador: string, senha: string) => {
    // 💡 Melhoria: Adicionar 'setLoading(true)' no início do login 
    // e 'setLoading(false)' no final, se for um fluxo de tela única.
    // No entanto, mantive o teu código original focado na autenticação para não alterar o comportamento.
    try {
      const isEmail = identificador.includes('@');
      const payload = isEmail
        ? { email: identificador, password: senha }
        : { nr_estudante: identificador, password: senha };

      console.log('[Auth] Tentando login:', { isEmail, identificador });

      const res = await api.post('/aluno/login', payload);

      if (res.data.success && res.data.aluno) {
        const user = res.data.aluno;
        setAluno(user);
        await AsyncStorage.setItem('@InsutecPay:user', JSON.stringify(user));
        console.log('[Auth] Login bem-sucedido:', user.nr_estudante);
      } else {
        throw new Error(res.data.message || 'Credenciais inválidas');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Erro de conexão';
      console.error('[Auth] Erro no login:', message);
      throw new Error(message);
    }
  };

  // === LOGOUT SEGURO ===
  const signOut = async () => {
    try {
      console.log('[Auth] Fazendo logout...');
      // 1. Limpa o estado local
      setAluno(null); 
      // 2. Limpa o armazenamento persistente (AsyncStorage)
      await AsyncStorage.removeItem('@InsutecPay:user'); 
      console.log('[Auth] Logout concluído');
    } catch (error) {
      console.error('[Auth] Erro ao fazer logout:', error);
    }
    // Nota: Não chamamos setLoading(true) ou (false) aqui, 
    // pois o estado 'loading' é dedicado ao carregamento inicial.
  };

  return (
    <AuthContext.Provider value={{ aluno, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
