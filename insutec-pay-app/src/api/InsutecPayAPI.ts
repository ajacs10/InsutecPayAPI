import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Aluno, Divida, PagamentoTransacao } from './types'; // Assumindo que 'types' está na mesma pasta

// =========================================================================
// CONFIGURAÇÃO DA URL BASE DA API - CORRIGIDO PARA O ENDEREÇO PÚBLICO DO RENDER
// =========================================================================

// 🚨 ESTA LINHA FOI ATUALIZADA: Agora usa o domínio público do Render.
const DOMAIN_PUBLICO = 'https://insutecpayapi.onrender.com';

const API_BASE_URL = `${DOMAIN_PUBLICO}/api`;
export const DOCS_BASE_URL = `${DOMAIN_PUBLICO}/documentos_gerados`;

console.log(`[API] URL Base da API: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
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
    const response = await api.post('/aluno/login', { nr_estudante, password });
    
    // Se o backend não envia token, usamos o nr_estudante como um token temporário.
    const token = response.data.token || nr_estudante; 
    
    if (response.data.success && response.data.aluno) {
      return { aluno: response.data.aluno as Aluno, token };
    }
    throw new Error(response.data.message || 'Falha desconhecida no Login.');
  } catch (error: any) {
    // A mensagem de erro agora refere-se ao Render
    const msg = error.response?.data?.message || `Não foi possível conectar ao servidor (${DOMAIN_PUBLICO}).`;
    throw new Error(msg);
  }
};

// --------------------- REGISTRO (Mantido, mas deve ser removido se não for usado) ---------------------
export const register = async (data: {
  nome: string;
  nr_estudante: string;
  email: string;
  password: string;
}): Promise<{ aluno: Aluno, token: string }> => {
  try {
    const response = await api.post('/aluno/register', data);
    const token = response.data.token || data.nr_estudante;
    
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
    return response.data as PagamentoTransacao[];
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Não foi possível carregar o histórico.';
    throw new Error(msg);
  }
};

export const getTransacoesRecentes = async (alunoId: string): Promise<PagamentoTransacao[]> => {
  return getHistoricoTransacoes(alunoId);
};
