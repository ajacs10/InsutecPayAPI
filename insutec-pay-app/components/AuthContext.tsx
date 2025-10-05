import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Aluno } from './types'; 
import { login, register } from '../src/api/InsutecPayAPI'; 

// 1. Definição de Tipos
interface AuthContextProps {
  aluno: Aluno | null;
  isLoading: boolean;
  signIn: (nr_estudante: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (data: any) => Promise<void>;
}

// 2. Criação do Contexto
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// 3. Provedor do Contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega os dados do aluno e o 'token' ao iniciar a aplicação
  useEffect(() => {
    const loadAlunoData = async () => {
      try {
        const alunoData = await AsyncStorage.getItem('@InsutecPay:alunoData');
        const token = await AsyncStorage.getItem('@InsutecPay:authToken');

        if (alunoData && token) {
          const parsedAluno = JSON.parse(alunoData) as Aluno;
          setAluno(parsedAluno);
          console.log(`[Auth] Aluno ${parsedAluno.nr_estudante} logado via persistência.`);
        }
      } catch (e) {
        console.error("Erro ao carregar dados persistidos:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadAlunoData();
  }, []);

  const signIn = async (nr_estudante: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('[Auth] Iniciando signIn com:', { nr_estudante }); // Log para depuração
      const { aluno: newAluno, token } = await login(nr_estudante, password);

      await AsyncStorage.setItem('@InsutecPay:alunoData', JSON.stringify(newAluno));
      await AsyncStorage.setItem('@InsutecPay:authToken', token);
      
      setAluno(newAluno);
      console.log(`[Auth] Login bem-sucedido para ${newAluno.nr_estudante}`);
    } catch (error: any) {
      console.error('[Auth] Erro no signIn:', error.message); // Log para depuração
      throw new Error(error.message); 
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('@InsutecPay:authToken');
      await AsyncStorage.removeItem('@InsutecPay:alunoData');
      setAluno(null);
      console.log('[Auth] Logout bem-sucedido.');
    } catch (e) {
      console.error("Erro ao fazer logout:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: any) => {
    setIsLoading(true);
    try {
      const { aluno: newAluno, token } = await register(data);
      
      await AsyncStorage.setItem('@InsutecPay:alunoData', JSON.stringify(newAluno));
      await AsyncStorage.setItem('@InsutecPay:authToken', token);

      setAluno(newAluno);
      console.log(`[Auth] Registo bem-sucedido para ${newAluno.nr_estudante}`);
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ aluno, isLoading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Hook de Uso
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
