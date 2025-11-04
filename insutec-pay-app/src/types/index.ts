// components/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
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
  isAuthenticated: boolean;
  signIn: (nr_estudante: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (data: RegisterData) => Promise<void>;
  updateAluno: (alunoData: Partial<Aluno>) => void;
}

interface RegisterData {
  id: string;
  usuario_id: number;  // ← OBRIGATÓRIO
  nr_estudante: string;
  nome: string;
  curso: string;
  ano_academico: number;
  programa?: string;
  telefone?: string;
}

// =========================================================================
// 2. Criação do Contexto
// =========================================================================
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// =========================================================================
// 3. Provedor do Contexto
// =========================================================================
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estado computado para verificar autenticação
  const isAuthenticated = useMemo(() => !!aluno, [aluno]);

  // Carrega os dados do aluno e o token ao iniciar a aplicação
  useEffect(() => {
    const loadAlunoData = async () => {
      console.log('[AuthProvider] Iniciando carregamento de dados persistidos');
      try {
        const [alunoData, token] = await Promise.all([
          AsyncStorage.getItem('@InsutecPay:alunoData'),
          AsyncStorage.getItem('@InsutecPay:authToken')
        ]);

        if (alunoData && token) {
          const parsedAluno = JSON.parse(alunoData) as Aluno;
          setAluno(parsedAluno);
          console.log(`[AuthProvider] Aluno carregado: ${parsedAluno.nr_estudante} (${parsedAluno.nome})`);
        } else {
          console.log('[AuthProvider] Nenhum dado de aluno ou token encontrado');
          // Limpa dados inconsistentes
          if (alunoData && !token) {
            await AsyncStorage.removeItem('@InsutecPay:alunoData');
            console.log('[AuthProvider] Dados de aluno inconsistentes removidos');
          }
        }
      } catch (error) {
        console.error('[AuthProvider] Erro ao carregar dados persistidos:', error);
        // Em caso de erro, limpa dados possivelmente corrompidos
        await AsyncStorage.multiRemove(['@InsutecPay:alunoData', '@InsutecPay:authToken']);
      } finally {
        setIsLoading(false);
        console.log('[AuthProvider] Carregamento concluído, isLoading: false');
      }
    };

    loadAlunoData();
  }, []);

  const signIn = async (nr_estudante: string, password: string): Promise<void> => {
    console.log('[AuthProvider] Iniciando signIn para:', nr_estudante);
    
    if (!nr_estudante.trim() || !password.trim()) {
      throw new Error('Número de estudante e senha são obrigatórios');
    }

    setIsLoading(true);
    try {
      const { aluno: newAluno, token } = await login(nr_estudante, password);
      
      // Salva dados de forma atômica
      await Promise.all([
        AsyncStorage.setItem('@InsutecPay:alunoData', JSON.stringify(newAluno)),
        AsyncStorage.setItem('@InsutecPay:authToken', token)
      ]);
      
      setAluno(newAluno);
      console.log(`[AuthProvider] Login bem-sucedido para ${newAluno.nr_estudante}`);
      
      // Navega para a tela inicial
      router.replace('/telas/home/HomeScreen');
    } catch (error: any) {
      console.error('[AuthProvider] Erro no signIn:', error.message);
      
      // Limpa dados em caso de erro
      await AsyncStorage.multiRemove(['@InsutecPay:alunoData', '@InsutecPay:authToken']);
      
      throw new Error(error.message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
      console.log('[AuthProvider] signIn concluído');
    }
  };

  const signOut = async (): Promise<void> => {
    console.log('[AuthProvider] Iniciando signOut');
    setIsLoading(true);
    
    try {
      // Remove todos os dados de autenticação de forma atômica
      await AsyncStorage.multiRemove([
        '@InsutecPay:authToken',
        '@InsutecPay:alunoData'
      ]);
      
      setAluno(null);
      console.log('[AuthProvider] Logout bem-sucedido');
      
      // Navega para a tela de login
      router.replace('/telas/login/LoginScreen');
    } catch (error) {
      console.error('[AuthProvider] Erro ao fazer logout:', error);
      throw new Error('Erro ao fazer logout. Tente novamente.');
    } finally {
      setIsLoading(false);
      console.log('[AuthProvider] signOut concluído');
    }
  };

  const signUp = async (data: RegisterData): Promise<void> => {
    console.log('[AuthProvider] Iniciando signUp para:', data.nr_estudante);
    
    // Validação básica dos dados
    if (!data.nome?.trim() || !data.nr_estudante?.trim() || !data.email?.trim() || !data.password) {
      throw new Error('Todos os campos obrigatórios devem ser preenchidos');
    }

    if (data.password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }

    setIsLoading(true);
    try {
      const { aluno: newAluno, token } = await register(data);
      
      // Salva dados de forma atômica
      await Promise.all([
        AsyncStorage.setItem('@InsutecPay:alunoData', JSON.stringify(newAluno)),
        AsyncStorage.setItem('@InsutecPay:authToken', token)
      ]);
      
      setAluno(newAluno);
      console.log(`[AuthProvider] Registro bem-sucedido para ${newAluno.nr_estudante}`);
      
      // Navega para a tela inicial
      router.replace('/telas/home/HomeScreen');
    } catch (error: any) {
      console.error('[AuthProvider] Erro no signUp:', error.message);
      
      // Limpa dados em caso de erro
      await AsyncStorage.multiRemove(['@InsutecPay:alunoData', '@InsutecPay:authToken']);
      
      throw new Error(error.message || 'Falha no registro. Tente novamente.');
    } finally {
      setIsLoading(false);
      console.log('[AuthProvider] signUp concluído');
    }
  };

  const updateAluno = (alunoData: Partial<Aluno>): void => {
    if (!aluno) {
      console.warn('[AuthProvider] Tentativa de atualizar aluno sem aluno definido');
      return;
    }

    const updatedAluno = { ...aluno, ...alunoData };
    setAluno(updatedAluno);
    
    // Atualiza também no AsyncStorage
    AsyncStorage.setItem('@InsutecPay:alunoData', JSON.stringify(updatedAluno))
      .then(() => {
        console.log('[AuthProvider] Dados do aluno atualizados no storage');
      })
      .catch(error => {
        console.error('[AuthProvider] Erro ao atualizar dados do aluno no storage:', error);
      });
  };

  // Valor do contexto memoizado para otimização
  const contextValue = useMemo((): AuthContextProps => ({
    aluno,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    signUp,
    updateAluno,
  }), [aluno, isLoading, isAuthenticated]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// =========================================================================
// 4. Hook de Uso
// =========================================================================
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export interface Divida { /* ... */ }
export interface PagamentoTransacao { /* ... */ }
export interface Notificacao { /* ... */ }
export interface Servico { /* ... */ }
