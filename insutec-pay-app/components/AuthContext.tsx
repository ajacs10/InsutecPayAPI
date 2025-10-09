import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Aluno } from '../src/types';
import { login, register } from '../src/api/InsutecPayAPI';
import { ErrorMessages } from '../src/utils/errorMessages';
import { ValidationRules } from '../src/utils/validators';

// =========================================================================
// 1. Definição de Tipos
// =========================================================================
interface AuthContextProps {
    aluno: Aluno | null;
    isLoading: boolean;
    userToken: string | null;
    isAuthenticated: boolean;
    signIn: (nr_estudante: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    signUp: (data: any) => Promise<void>;
    refreshAlunoData: () => Promise<void>;
}

// =========================================================================
// 2. Criação do Contexto
// =========================================================================
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// =========================================================================
// 3. Provedor do Contexto
// =========================================================================
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [aluno, setAluno] = useState<Aluno | null>(null);
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Função para carregar dados do aluno do AsyncStorage
    const loadAlunoData = async () => {
        console.log('[AuthProvider] Iniciando carregamento de dados persistidos');
        try {
            const [alunoData, token] = await Promise.all([
                AsyncStorage.getItem('@InsutecPay:alunoData'),
                AsyncStorage.getItem('@InsutecPay:authToken')
            ]);

            console.log('[AuthProvider] Dados recuperados:', { 
                hasAlunoData: !!alunoData, 
                hasToken: !!token 
            });

            if (alunoData && token) {
                const parsedAluno = JSON.parse(alunoData) as Aluno;
                setAluno(parsedAluno);
                setUserToken(token);
                setIsAuthenticated(true);
                console.log(`[AuthProvider] Aluno carregado: ${parsedAluno.nr_estudante}`);
            } else {
                console.log('[AuthProvider] Nenhum dado de aluno ou token encontrado');
                setAluno(null);
                setUserToken(null);
                setIsAuthenticated(false);
            }
        } catch (e) {
            console.error('[AuthProvider] Erro ao carregar dados persistidos:', e);
            setAluno(null);
            setUserToken(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
            console.log('[AuthProvider] Carregamento concluído, isLoading: false');
        }
    };

    // Carrega os dados do aluno e o token ao iniciar a aplicação
    useEffect(() => {
        loadAlunoData();
    }, []);

    // Função para atualizar dados do aluno
    const refreshAlunoData = async () => {
        console.log('[AuthProvider] Atualizando dados do aluno');
        try {
            const alunoData = await AsyncStorage.getItem('@InsutecPay:alunoData');
            if (alunoData) {
                const parsedAluno = JSON.parse(alunoData) as Aluno;
                setAluno(parsedAluno);
                console.log(`[AuthProvider] Dados do aluno atualizados: ${parsedAluno.nr_estudante}`);
            }
        } catch (error) {
            console.error('[AuthProvider] Erro ao atualizar dados do aluno:', error);
        }
    };

    const signIn = async (nr_estudante: string, password: string) => {
        console.log('[AuthProvider] Iniciando signIn:', { nr_estudante });
        setIsLoading(true);
        
        try {
            // Validação usando as regras que criamos
            const validNumero = ValidationRules.numeroEstudante(nr_estudante);
            const validSenha = ValidationRules.senha(password);

            if (!validNumero.isValid) {
                throw new Error(validNumero.message);
            }

            if (!validSenha.isValid) {
                throw new Error(validSenha.message);
            }

            // Chama a API real
            const { aluno: newAluno, token } = await login(nr_estudante, password);
            
            console.log('[AuthProvider] Resposta da API:', { 
                aluno: newAluno, 
                hasToken: !!token 
            });

            // Valida se os dados necessários estão presentes
            if (!newAluno?.nr_estudante) {
                throw new Error('Dados do aluno incompletos na resposta da API');
            }

            if (!token) {
                throw new Error('Token não recebido da API');
            }

            // Atualiza estado
            setAluno(newAluno);
            setUserToken(token);
            setIsAuthenticated(true);
            
            // Salva no AsyncStorage
            await Promise.all([
                AsyncStorage.setItem('@InsutecPay:alunoData', JSON.stringify(newAluno)),
                AsyncStorage.setItem('@InsutecPay:authToken', token)
            ]);
            
            console.log(`[AuthProvider] Login bem-sucedido para ${newAluno.nr_estudante}`);
            
        } catch (error: any) {
            console.error('[AuthProvider] Erro no signIn:', error);
            
            // Usa o utilitário de mensagens amigáveis
            const friendlyMessage = ErrorMessages.getLoginErrorMessage(error);
            
            // Limpa dados em caso de erro de autenticação
            const shouldClearData = 
                error.message?.includes('Credenciais') || 
                error.message?.includes('incorretos') || 
                error.message?.includes('não encontrado') ||
                error.message?.includes('inválido') ||
                error.message?.includes('incorreta') ||
                error.message?.includes('Número de estudante ou palavra-passe inválidos');
                
            if (shouldClearData) {
                console.log('[AuthProvider] Limpando dados devido a erro de autenticação');
                await AsyncStorage.multiRemove(['@InsutecPay:authToken', '@InsutecPay:alunoData']);
                setAluno(null);
                setUserToken(null);
                setIsAuthenticated(false);
            }
            
            throw new Error(friendlyMessage);
        } finally {
            setIsLoading(false);
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
            setIsAuthenticated(false);
            
            console.log('[AuthProvider] Logout bem-sucedido');
            
            // Redireciona para login
            router.replace('/telas/login/LoginScreen');
            
        } catch (error: any) {
            console.error('[AuthProvider] Erro ao fazer logout:', error);
            
            // Mensagem amigável para logout
            const friendlyMessage = ErrorMessages.getLogoutErrorMessage(error);
            throw new Error(friendlyMessage);
            
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (data: any) => {
        console.log('[AuthProvider] Iniciando signUp:', data);
        setIsLoading(true);
        
        try {
            // Validação básica
            if (!data.nr_estudante || !data.password || !data.email) {
                throw new Error('Preencha todos os campos obrigatórios');
            }

            // Valida número de estudante
            const validNumero = ValidationRules.numeroEstudante(data.nr_estudante);
            if (!validNumero.isValid) {
                throw new Error(validNumero.message);
            }

            // Valida senha
            const validSenha = ValidationRules.senha(data.password);
            if (!validSenha.isValid) {
                throw new Error(validSenha.message);
            }

            // Chama a API real
            const { aluno: newAluno, token } = await register(data);
            
            console.log('[AuthProvider] Resposta do registro:', { 
                aluno: newAluno, 
                hasToken: !!token 
            });

            // Valida dados
            if (!newAluno?.nr_estudante) {
                throw new Error('Dados do aluno incompletos na resposta do registro');
            }

            if (!token) {
                throw new Error('Token não recebido do registro');
            }

            // Atualiza estado e storage
            setAluno(newAluno);
            setUserToken(token);
            setIsAuthenticated(true);
            await Promise.all([
                AsyncStorage.setItem('@InsutecPay:alunoData', JSON.stringify(newAluno)),
                AsyncStorage.setItem('@InsutecPay:authToken', token)
            ]);
            
            console.log(`[AuthProvider] Registro bem-sucedido para ${newAluno.nr_estudante}`);
            
        } catch (error: any) {
            console.error('[AuthProvider] Erro no signUp:', error);
            
            // Mensagem amigável para registro
            const friendlyMessage = ErrorMessages.getRegisterErrorMessage(error);
            
            // Limpa dados em caso de erro
            await AsyncStorage.multiRemove(['@InsutecPay:authToken', '@InsutecPay:alunoData']);
            setAluno(null);
            setUserToken(null);
            setIsAuthenticated(false);
            
            throw new Error(friendlyMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const contextValue = useMemo(() => ({
        aluno,
        userToken,
        isLoading,
        isAuthenticated,
        signIn,
        signOut,
        signUp,
        refreshAlunoData,
    }), [aluno, userToken, isLoading, isAuthenticated]);

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
