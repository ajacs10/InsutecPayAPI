import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode, FC } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Aluno } from '../src/types';
import { login, register } from '../src/api/InsutecPayAPI';

// =========================================================================
// 1. Definição de Tipos
// =========================================================================
interface AuthContextProps {
  aluno: Aluno | null;
  isLoading: boolean;
  userToken: string | null;
  signIn: (nr_estudante: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (data: any) => Promise<void>;
}

// =========================================================================
// 2. Criação do Contexto
// =========================================================================
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// =========================================================================
// 3. Provedor do Contexto
// =========================================================================
export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega os dados do aluno e o token ao iniciar a aplicação
  useEffect(() => {
    const loadAlunoData = async () => {
      console.log('[AuthProvider] Iniciando carregamento de dados persistidos');
      try {
        const alunoData = await AsyncStorage.getItem('@InsutecPay:alunoData');
        const token = await AsyncStorage.getItem('@InsutecPay:authToken');

        if (alunoData && token) {
          const parsedAluno = JSON.parse(alunoData) as Aluno;
          setAluno(parsedAluno);
          setUserToken(token);
          console.log(`[AuthProvider] Aluno carregado: ${parsedAluno.nr_estudante}`);
        } else {
          console.log('[AuthProvider] Nenhum dado de aluno ou token encontrado');
          setAluno(null);
          setUserToken(null);
        }
      } catch (e) {
        console.error('[AuthProvider] Erro ao carregar dados persistidos:', e);
        setAluno(null);
        setUserToken(null);
      } finally {
        setIsLoading(false);
        console.log('[AuthProvider] Carregamento concluído, isLoading: false');
      }
    };
    loadAlunoData();
  }, []);

  const signIn = async (nr_estudante: string, password: string) => {
    console.log('[AuthProvider] Iniciando signIn:', { nr_estudante });
    setIsLoading(true);
    try {
      const { aluno: newAluno, token } = await login(nr_estudante, password);
      setAluno(newAluno);
      setUserToken(token);
      await AsyncStorage.setItem('@InsutecPay:alunoData', JSON.stringify(newAluno));
      await AsyncStorage.setItem('@InsutecPay:authToken', token);
      console.log(`[AuthProvider] Login bem-sucedido para ${newAluno.nr_estudante}`);
      router.replace('/telas/home/HomeScreen');
    } catch (error: any) {
      console.error('[AuthProvider] Erro no signIn:', error.message);
      throw new Error(error.message || 'Falha no login');
    } finally {
      setIsLoading(false);
      console.log('[AuthProvider] signIn concluído, isLoading: false');
    }
  };

  const signOut = async () => {
    console.log('[AuthProvider] Iniciando signOut');
    setIsLoading(true);
    try {
      // Limpar AsyncStorage primeiro
      await AsyncStorage.multiRemove(['@InsutecPay:authToken', '@InsutecPay:alunoData']);
      
      // Resetar estado
      setAluno(null);
      setUserToken(null);
      
      console.log('[AuthProvider] Logout bem-sucedido');
      
      // CORREÇÃO: Redirecionar para a tela de login
      // Use replace para evitar voltar para o perfil com back button
      router.replace('/telas/login/LoginScreen');
      
    } catch (e) {
      console.error('[AuthProvider] Erro ao fazer logout:', e);
      throw new Error('Erro ao fazer logout');
    } finally {
      setIsLoading(false);
      console.log('[AuthProvider] signOut concluído, isLoading: false');
    }
  };

  const signUp = async (data: any) => {
    console.log('[AuthProvider] Iniciando signUp:', data);
    setIsLoading(true);
    try {
      const { aluno: newAluno, token } = await register(data);
      setAluno(newAluno);
      setUserToken(token);
      await AsyncStorage.setItem('@InsutecPay:alunoData', JSON.stringify(newAluno));
      await AsyncStorage.setItem('@InsutecPay:authToken', token);
      console.log(`[AuthProvider] Registro bem-sucedido para ${newAluno.nr_estudante}`);
      router.replace('/telas/home/HomeScreen');
    } catch (error: any) {
      console.error('[AuthProvider] Erro no signUp:', error.message);
      throw new Error(error.message || 'Falha no registro');
    } finally {
      setIsLoading(false);
      console.log('[AuthProvider] signUp concluído, isLoading: false');
    }
  };

  // Otimização: usa useMemo para evitar que o objeto de valor do contexto seja recriado
  const contextValue = useMemo(() => ({
    aluno,
    userToken,
    isLoading,
    signIn,
    signOut,
    signUp,
  }), [aluno, userToken, isLoading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// =========================================================================
// 4. Hook de Uso
// =========================================================================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
