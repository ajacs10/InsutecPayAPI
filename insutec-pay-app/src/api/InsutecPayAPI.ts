import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Aluno, Divida, PagamentoTransacao, Notificacao, Servico } from '../src/types';

// =========================================================================
// CONFIGURAÇÃO DA URL BASE DA API
// =========================================================================
const DOMAIN_PUBLICO = 'https://insutecpayapi.onrender.com';
const API_BASE_URL = `${DOMAIN_PUBLICO}/api`;
// URL para acesso aos documentos (comprovativos)
export const DOCS_BASE_URL = `${DOMAIN_PUBLICO}/documentos_gerados`; 

console.log(`[API] URL Base da API: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, // 15 segundos
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
// FUNÇÕES DE API - EXPORTAÇÕES NOMEADAS
// =========================================================================

// --------------------- LOGIN ---------------------
export const login = async (nr_estudante: string, password: string): Promise<{ aluno: Aluno; token: string }> => {
  try {
    console.log('[API] Chamando login para:', { nr_estudante });
    const response = await api.post('/aluno/login', { nr_estudante, password });

    const token = response.data.token;
    // Verifica o sucesso e a presença de dados essenciais
    if (response.data.success && response.data.aluno && token) {
      return { aluno: response.data.aluno as Aluno, token };
    }

    throw new Error(response.data.message || 'Dados de login incompletos ou inválidos.');
  } catch (error: any) {
    console.error('[API] Erro no login:', error.response?.data?.message || error.message);
    const msg = error.response?.data?.message || `Não foi possível conectar ao servidor (${DOMAIN_PUBLICO}).`;
    throw new Error(msg);
  }
};

// --------------------- REGISTRO ---------------------
// Definição do tipo de dados de entrada para o registro
interface RegisterData {
  nome: string;
  nr_estudante: string;
  email: string;
  password: string;
  ano?: number;
  programa?: string;
  telefone?: string;
}

export const register = async (data: RegisterData): Promise<{ aluno: Aluno; token: string }> => {
  try {
    const response = await api.post('/aluno/register', data);
    const token = response.data.token; // O token deve vir da API
    if (response.data.success && response.data.aluno && token) {
      return { aluno: response.data.aluno as Aluno, token };
    }
    throw new Error(response.data.message || 'Falha desconhecida no Registro.');
  } catch (error: any) {
    console.error('[API] Erro no registro:', error.response?.data?.message || error.message);
    const msg = error.response?.data?.message || 'Não foi possível conectar ao servidor.';
    throw new Error(msg);
  }
};

// --------------------- OBTER DÍVIDAS ---------------------
export const getDividas = async (alunoId: string): Promise<Divida[]> => {
  try {
    const response = await api.get(`/aluno/${alunoId}/dividas`);
    // Assumindo que a API retorna um array diretamente ou sob a chave 'dividas'
    const dividas = response.data.dividas || response.data;
    if (!Array.isArray(dividas)) {
        throw new Error('Formato de dados de dívidas inválido.');
    }
    return dividas as Divida[];
  } catch (error: any) {
    console.error('[API] Erro ao carregar dívidas:', error.response?.data?.message || error.message);
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
      // Retorna um objeto PagamentoTransacao para a interface do usuário
      return {
        id_transacao_unica: response.data.id_transacao_unica,
        descricao: response.data.descricao || 'Pagamento de serviços',
        valor: parseFloat(response.data.valor_total),
        data_transacao: new Date().toISOString(),
        status: 'PENDENTE',
        aluno_id: alunoId,
        servico_id: services[0]?.id,
      } as PagamentoTransacao;
    }
    throw new Error('Falha ao iniciar transação.');
  } catch (error: any) {
    console.error('[API] Erro ao iniciar pagamento:', error.response?.data?.message || error.message);
    const msg = error.response?.data?.message || 'Falha ao comunicar com o sistema de pagamento.';
    throw new Error(msg);
  }
};

// --------------------- SIMULAR WEBHOOK (Para testes) ---------------------
export const simularWebhook = async (id_transacao_unica: string, status: 'PAGO' | 'CANCELADO'): Promise<void> => {
  try {
    const response = await api.post('/pagamento/webhook', { id_transacao_unica, status });
    console.log(`[Webhook] ${response.data.message}`);
  } catch (error: any) {
    console.error(`[Webhook] Falha para ${id_transacao_unica}:`, error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Falha ao simular webhook.');
  }
};

// --------------------- VERIFICAR STATUS ---------------------
export const verificarStatusPagamento = async (
  id_transacao_unica: string
): Promise<{ status: 'PAGO' | 'PENDENTE' | 'CANCELADO' | 'ERRO'; caminho_documento: string }> => {
  try {
    const response = await api.get(`/transacao/${id_transacao_unica}/status`);
    return {
      status: response.data.status,
      caminho_documento: response.data.caminho_documento,
    };
  } catch (error: any) {
    console.error('[API] Erro ao verificar status:', error.response?.data?.message || error.message);
    const msg = error.response?.data?.message || 'Falha ao verificar status da transação.';
    throw new Error(msg);
  }
};

// --------------------- HISTÓRICO DE TRANSAÇÕES ---------------------
export const getHistoricoTransacoes = async (alunoId: string): Promise<PagamentoTransacao[]> => {
  try {
    const response = await api.get(`/aluno/${alunoId}/historico`);
    const historico = response.data.historico || response.data;
    if (!Array.isArray(historico)) {
      console.warn('[API] Resposta de histórico inesperada:', response.data);
      throw new Error('Formato de dados de histórico inválido.');
    }
    return historico as PagamentoTransacao[];
  } catch (error: any) {
    console.error('[API] Erro ao carregar histórico:', error.response?.data?.message || error.message);
    const msg = error.response?.data?.message || 'Não foi possível carregar o histórico.';
    throw new Error(msg);
  }
};

// --------------------- TRANSAÇÕES RECENTES ---------------------
export const getTransacoesRecentes = async (alunoId: string): Promise<PagamentoTransacao[]> => {
  // Simplesmente chama o histórico e espera que a UI filtre/limite, 
  // ou você pode adicionar um parâmetro `?limit=5` na rota.
  return getHistoricoTransacoes(alunoId);
};

// --------------------- OBTER NOTIFICAÇÕES ---------------------
export const getNotificacoes = async (alunoId: string): Promise<Notificacao[]> => {
  try {
    const response = await api.get(`/aluno/${alunoId}/notificacoes`);
    const notificacoes = response.data.notificacoes || response.data;
    if (!Array.isArray(notificacoes)) {
      console.warn('[API] Resposta de notificações inesperada:', response.data);
      throw new Error('Formato de dados de notificações inválido.');
    }
    return notificacoes as Notificacao[];
  } catch (error: any) {
    console.error('[API] Erro ao carregar notificações:', error.response?.data?.message || error.message);
    const msg = error.response?.data?.message || 'Não foi possível carregar as notificações.';
    throw new Error(msg);
  }
};

// --------------------- ADICIONAR NOTIFICAÇÃO ---------------------
export const addNotificacao = async (notificacao: Notificacao): Promise<void> => {
  try {
    console.log('[API] Adicionando notificação:', notificacao);
    
    const response = await api.post('/notificacoes', notificacao);
    
    if (response.data.success) {
      console.log('[API] Notificação adicionada com sucesso');
      return;
    }
    
    throw new Error(response.data.message || 'Falha ao adicionar notificação');
  } catch (error: any) {
    console.error('[API] Erro ao adicionar notificação:', error.response?.data?.message || error.message);
    const msg = error.response?.data?.message || 'Não foi possível adicionar a notificação.';
    throw new Error(msg);
  }
};

// --------------------- MARCAR NOTIFICAÇÃO COMO LIDA ---------------------
export const marcarNotificacaoComoLida = async (notificacaoId: string): Promise<void> => {
  try {
    const response = await api.put(`/notificacoes/${notificacaoId}/lida`);
    
    if (response.data.success) {
      console.log('[API] Notificação marcada como lida');
      return;
    }
    
    throw new Error(response.data.message || 'Falha ao marcar notificação como lida');
  } catch (error: any) {
    console.error('[API] Erro ao marcar notificação como lida:', error.response?.data?.message || error.message);
    const msg = error.response?.data?.message || 'Não foi possível marcar a notificação como lida.';
    throw new Error(msg);
  }
};

// --------------------- OBTER SERVIÇOS DISPONÍVEIS ---------------------
export const getServicos = async (): Promise<Servico[]> => {
  try {
    const response = await api.get('/servicos');
    const servicos = response.data.servicos || response.data;
    if (!Array.isArray(servicos)) {
      console.warn('[API] Resposta de serviços inesperada:', response.data);
      throw new Error('Formato de dados de serviços inválido.');
    }
    return servicos as Servico[];
  } catch (error: any) {
    console.error('[API] Erro ao carregar serviços:', error.response?.data?.message || error.message);
    const msg = error.response?.data?.message || 'Não foi possível carregar os serviços.';
    throw new Error(msg);
  }
};

// --------------------- ATUALIZAR PERFIL DO ALUNO ---------------------
export const updateAluno = async (alunoId: string, data: Partial<Aluno>): Promise<Aluno> => {
  try {
    const response = await api.put(`/aluno/${alunoId}`, data);
    if (response.data.success && response.data.aluno) {
      // Retorna o objeto aluno atualizado para ser salvo no AsyncStorage/Context
      return response.data.aluno as Aluno; 
    }
    throw new Error(response.data.message || 'Falha ao atualizar perfil.');
  } catch (error: any) {
    console.error('[API] Erro ao atualizar aluno:', error.response?.data?.message || error.message);
    const msg = error.response?.data?.message || 'Não foi possível atualizar o perfil.';
    throw new Error(msg);
  }
};
