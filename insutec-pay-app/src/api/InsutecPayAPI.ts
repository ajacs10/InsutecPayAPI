// src/api/InsutecPayAPI.ts - VERSÃO FINAL CORRIGIDA
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// === CONFIGURAÇÃO DA API ===
const DOMAIN_PUBLICO = 'https://insutecpayapi.onrender.com';
const API_BASE_URL = `${DOMAIN_PUBLICO}/api`;
export const DOCS_BASE_URL = `${DOMAIN_PUBLICO}/documentos_gerados`;

// Cria instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// === INTERCEPTOR: ADICIONA TOKEN E USER ID ===
api.interceptors.request.use(
  async (config) => {
    try {
      const stored = await AsyncStorage.getItem('@InsutecPay:user');
      if (stored) {
        const user = JSON.parse(stored);
        if (user.id) {
          config.headers['X-User-Id'] = user.id;
          config.params = config.params || {};
          config.params.current_user_id = user.id;
        }
      }
    } catch (error) {
      console.warn('Erro ao ler usuário do AsyncStorage:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { api };

// === TIPOS ===
export interface Aluno {
  id: number;
  nome_completo: string;
  email: string;
  tipo_usuario: 'ALUNO' | 'ADMIN';
}

export interface Divida {
  id: string;
  tipo: string;
  descricao: string;
  mes: string;
  valor_base: string;
  data_vencimento: string;
  multa: string;
  valor_total: string;
  is_atraso: boolean;
  valor_liquidado: string;
}

export interface PagamentoTransacao {
  id_transacao_unica: string;
  descricao: string;
  valor: number;
  status: string;
  data_transacao: string;
}

export interface ServicoDevido {
  id: string;
  descricao: string;
  valor_liquidado: number;
}

// === FUNÇÕES DA API ===

// --- LOGIN (POR EMAIL) ---
export const login = async (email: string, senha: string): Promise<{ aluno: Aluno; token: string }> => {
  const response = await api.post('/aluno/login', { email, senha });
  const { success, aluno, token } = response.data;

  if (!success || !aluno?.id) {
    throw new Error(response.data.message || 'Falha no login');
  }

  // Salva usuário localmente
  await AsyncStorage.setItem('@InsutecPay:user', JSON.stringify(aluno));
  return { aluno, token };
};

// --- REGISTRO ---
export const register = async (nome_completo: string, email: string, senha: string): Promise<{ aluno: Aluno; token: string }> => {
  const response = await api.post('/aluno/register', { nome_completo, email, senha });
  const { success, aluno, token } = response.data;

  if (!success || !aluno?.id) {
    throw new Error(response.data.message || 'Falha no registro');
  }

  await AsyncStorage.setItem('@InsutecPay:user', JSON.stringify(aluno));
  return { aluno, token };
};

// --- DÍVIDAS ---
export const getDividas = async (alunoId: number): Promise<Divida[]> => {
  const res = await api.get(`/aluno/${alunoId}/dividas`);
  return res.data.dividas || [];
};

// --- HISTÓRICO ---
export const getHistoricoTransacoes = async (alunoId: number): Promise<PagamentoTransacao[]> => {
  const res = await api.get(`/aluno/${alunoId}/historico`);
  return res.data || [];
};

// --- SALDO ---
export const getSaldo = async (alunoId: number): Promise<number> => {
  const res = await api.get(`/aluno/${alunoId}/saldo`);
  return res.data.saldo || 500000;
};

// --- INICIAR PAGAMENTO ---
export const initiatePayment = async (alunoId: number, servicos: ServicoDevido[]) => {
  const res = await api.post('/pagamento/iniciar', { alunoId, servicos });
  return res.data;
};

// --- VERIFICAR STATUS ---
export const verificarStatusPagamento = async (id_transacao_unica: string) => {
  const res = await api.get(`/transacao/${id_transacao_unica}/status`);
  return res.data;
};

// --- PROCESSAR PAGAMENTO (CARTEIRA) ---
export const processarPagamento = async (transacaoId: string) => {
  const res = await api.post('/pagamento/processar', { transacaoId });
  return res.data;
};

// --- ADMIN: LISTAR ALUNOS ---
export const getAlunosAdmin = async (): Promise<Aluno[]> => {
  const res = await api.get('/admin/alunos');
  return res.data;
};

// --- ADMIN: EXCLUIR ALUNO ---
export const deleteAluno = async (id: number): Promise<void> => {
  await api.delete(`/admin/aluno/${id}`);
};

// === FUNÇÃO AUXILIAR: LIMPAR SESSÃO ===
export const logoutLocal = async () => {
  await AsyncStorage.multiRemove(['@InsutecPay:user']);
};
