export interface Aluno {
  id: string;
  nome: string;
  nr_estudante: string;
  ano: number; // Year of study (1 to 4 for Engenharia Informática)
  programa: string; // e.g., "Engenharia Informática"
  email?: string; // Optional contact
  telefone?: string; // Optional contact
}

export interface Divida {
  id: string;
  descricao: string;
  valor_base: number;
  valor_total: number;
  data_vencimento: string; // ISO format (e.g., "2025-10-05")
  aluno_id: string; // Link to Aluno
}

export interface PagamentoTransacao {
  id_transacao_unica: string;
  descricao: string;
  valor: number;
  data_transacao: string; // ISO format (e.g., "2025-10-05T11:44:00Z")
  status: 'PAGO' | 'PENDENTE' | 'CANCELADO' | 'ERRO';
  aluno_id: string; // Link to Aluno
  servico_id?: string; // Optional link to Servico
}

export interface Servico {
  id: string;
  nome: string; // e.g., "Propina", "Declaração com nota"
  valor?: number; // Optional base value for services like Declaração
  pendente?: boolean | { [key: string]: boolean }; // Track pending status (e.g., months for Propina)
  icon: string;
  anos?: { [key: number]: number }; // Year-specific pricing (e.g., { 1: 45550, 2: 45550, ... })
  isSpecial?: boolean; // Optional flag for special services
  categoria?: 'Propina' | 'Declaração'; // Optional category for filtering
}
