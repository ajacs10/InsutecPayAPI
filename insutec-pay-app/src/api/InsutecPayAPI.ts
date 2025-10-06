// src/api/InsutecPayAPI.ts

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
// Certifique-se de que o caminho para 'types' está correto
import { Aluno, Divida, PagamentoTransacao } from './types'; 

// =========================================================================
// CONFIGURAÇÃO DA URL BASE DA API
// =========================================================================

const DOMAIN_PUBLICO = 'https://insutecpayapi.onrender.com';

const API_BASE_URL = `${DOMAIN_PUBLICO}/api`;
export const DOCS_BASE_URL = `${DOMAIN_PUBLICO}/documentos_gerados`;

console.log(`[API] URL Base da API: ${API_BASE_URL}`);

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    // 💡 OBSERVAÇÃO: Mantenha em 15s por enquanto, mas aumente se houver timeouts recorrentes.
    timeout: 15000, 
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('@InsutecPay:authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// =========================================================================
// FUNÇÕES DE API
// =========================================================================

// --------------------- LOGIN ---------------------
export const login = async (nr_estudante: string, password: string): Promise<{ aluno: Aluno, token: string }> => {
    try {
        console.log('[API] Chamando login para:', { nr_estudante });
        const response = await api.post('/aluno/login', { nr_estudante, password });
        
        const token = response.data.token; 
        
        // 💡 CORREÇÃO: Força a existência de um token válido e do objeto aluno
        if (response.data.success && response.data.aluno && token) {
            return { aluno: response.data.aluno as Aluno, token };
        }
        
        throw new Error(response.data.message || 'Dados de login incompletos ou inválidos.');
        
    } catch (error: any) {
        console.error('[API] Erro no login:', error.response?.data || error.message);
        const msg = error.response?.data?.message || `Não foi possível conectar ao servidor (${DOMAIN_PUBLICO}).`;
        throw new Error(msg);
    }
};

// --------------------- REGISTRO ---------------------
export const register = async (data: {
    nome: string;
    nr_estudante: string;
    email: string;
    password: string;
}): Promise<{ aluno: Aluno, token: string }> => {
    try {
        const response = await api.post('/aluno/register', data);
        const token = response.data.token || data.nr_estudante; // Token pode ser um ID de sessão temporário
        
        if (response.data.success && response.data.aluno) {
            return { aluno: response.data.aluno as Aluno, token };
        }
        throw new Error(response.data.message || 'Falha desconhecida no Registro.');
    } catch (error: any) {
        const msg = error.response?.data?.message || 'Não foi possível conectar ao servidor.';
        throw new Error(msg);
    }
};

// --------------------- OBTER DÍVIDAS ---------------------
export const getDividas = async (alunoId: string): Promise<{ dividas: Divida[] }> => {
    try {
        const response = await api.get(`/aluno/${alunoId}/dividas`);
        return { dividas: response.data.dividas as Divida[] };
    } catch (error: any) {
        const msg = error.response?.data?.message || 'Não foi possível carregar as dívidas.';
        throw new Error(msg);
    }
};

// --------------------- INICIAR PAGAMENTO ---------------------
export const initiatePayment = async (
    alunoId: string,
    services: { id: string; valor_liquidado: number }[]
): Promise<PagamentoTransacao> => {
    try {
        const response = await api.post('/pagamento/iniciar', { alunoId, services });
        if (response.data.success) {
            return {
                id_transacao_unica: response.data.id_transacao_unica,
                valor: parseFloat(response.data.valor_total),
            };
        }
        throw new Error('Falha ao iniciar transação.');
    } catch (error: any) {
        const msg = error.response?.data?.message || 'Falha ao comunicar com o sistema de pagamento.';
        throw new Error(msg);
        
    }
};

// --------------------- SIMULAR WEBHOOK (Para testes) ---------------------
export const simularWebhook = async (id_transacao_unica: string, status: 'PAGO' | 'CANCELADO') => {
    try {
        const response = await api.post('/pagamento/webhook', { id_transacao_unica, status });
        console.log(`[Webhook] ${response.data.message}`);
    } catch (error) {
        console.error(`[Webhook] Falha para ${id_transacao_unica}:`, error);
    }
};

// --------------------- VERIFICAR STATUS ---------------------
export const verificarStatusPagamento = async (id_transacao_unica: string): Promise<{status: string, caminho_documento: string}> => {
    try {
        const response = await api.get(`/transacao/${id_transacao_unica}/status`);
        return { status: response.data.status, caminho_documento: response.data.caminho_documento };
    } catch (error: any) {
        const msg = error.response?.data?.message || 'Falha ao verificar status da transação.';
        throw new Error(msg);
    }
};

// --------------------- HISTÓRICO DE TRANSAÇÕES ---------------------
export const getHistoricoTransacoes = async (alunoId: string): Promise<PagamentoTransacao[]> => {
    try {
        const response = await api.get(`/aluno/${alunoId}/historico`);
        
        // Extração robusta do array de transações
        const historico = response.data.historico || response.data;
        
        if (Array.isArray(historico)) {
            return historico as PagamentoTransacao[];
        }
        
        console.warn('[API] Resposta de histórico inesperada:', response.data);
        throw new Error('Formato de dados de histórico inválido.');
        
    } catch (error: any) {
        console.error('[API] Erro ao carregar histórico:', error.response?.data || error.message);
        const msg = error.response?.data?.message || 'Não foi possível carregar o histórico.';
        throw new Error(msg);
    }
};

export const getTransacoesRecentes = async (alunoId: string): Promise<PagamentoTransacao[]> => {
    return getHistoricoTransacoes(alunoId);
};
