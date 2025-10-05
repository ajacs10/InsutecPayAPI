-- ========================================
-- Base de Dados: InsutecPay
-- Ficheiro 1/3: SCHEMA (Tabelas e Funções)
-- Versão 5.0 - Suporte a Pagamento para Terceiros
-- ========================================

-- DROP TABLE IF EXISTS pagamentos_servicos, transacoes, servicos_devidos, alunos, emolumentos CASCADE;

-- =========================
-- 1. Tabelas de Estrutura e Preços (Tabelas Mestras)
-- =========================

-- Tabela: emolumentos (Sem Alterações)
CREATE TABLE IF NOT EXISTS emolumentos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL, 
    designacao VARCHAR(255) UNIQUE NOT NULL, 
    valor_base NUMERIC(10,2) NOT NULL,
    tipo_cobranca VARCHAR(50) NOT NULL
);

-- =========================
-- 2. Tabelas de Utilizadores e Dívidas
-- =========================

-- Tabela: alunos (Sem Alterações - Representa o Beneficiário/Devedor)
CREATE TABLE IF NOT EXISTS alunos (
    id SERIAL PRIMARY KEY,
    nr_estudante VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    curso VARCHAR(100),
    ano_academico INTEGER, 
    data_registo TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: servicos_devidos (Dívidas - Sem Alterações)
-- O aluno_id aqui é o ALUNO BENEFICIÁRIO, que deve o serviço.
CREATE TABLE IF NOT EXISTS servicos_devidos (
    id SERIAL PRIMARY KEY,
    aluno_id INTEGER REFERENCES alunos(id) ON DELETE CASCADE NOT NULL, -- ALUNO DEVEDOR/BENEFICIÁRIO
    emolumento_id INTEGER REFERENCES emolumentos(id) ON DELETE RESTRICT NOT NULL, 
    referencia VARCHAR(50) UNIQUE NOT NULL, 
    valor_devido NUMERIC(10,2) NOT NULL, 
    mes_referencia VARCHAR(20), 
    data_vencimento DATE NOT NULL, 
    multa_aplicada NUMERIC(10,2) DEFAULT 0.00, 
    esta_pago BOOLEAN DEFAULT FALSE,
    data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 3. Tabelas de Pagamento e Auditoria
-- =========================

-- Tabela: transacoes (ALTERADA)
-- A nova coluna 'pagador_aluno_id' registra quem iniciou a transação.
CREATE TABLE IF NOT EXISTS transacoes (
    id SERIAL PRIMARY KEY,
    id_transacao_unica VARCHAR(50) UNIQUE NOT NULL, 
    pagador_aluno_id INTEGER REFERENCES alunos(id) ON DELETE RESTRICT NOT NULL, -- NOVO: ALUNO LOGADO QUE FEZ O PAGAMENTO
    valor_liquido NUMERIC(10,2) NOT NULL, 
    valor_multa NUMERIC(10,2) DEFAULT 0.00, 
    valor_pago NUMERIC(10,2) NOT NULL, 
    metodo_pagamento VARCHAR(50), 
    status VARCHAR(20) NOT NULL, 
    data_confirmacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: pagamentos_servicos (Sem Alterações)
CREATE TABLE IF NOT EXISTS pagamentos_servicos (
    id SERIAL PRIMARY KEY,
    transacao_id INTEGER REFERENCES transacoes(id) ON DELETE CASCADE,
    servico_devido_id INTEGER REFERENCES servicos_devidos(id) ON DELETE RESTRICT,
    valor_pago NUMERIC(10,2) NOT NULL, 
    valor_base_servico NUMERIC(10,2) NOT NULL, 
    multa_aplicada NUMERIC(10,2) DEFAULT 0.00,
    UNIQUE (transacao_id, servico_devido_id)
);

-- =========================
-- 4. FUNÇÃO DE CÁLCULO DE MULTA (Sem Alterações)
-- =========================

CREATE OR REPLACE FUNCTION calcular_multa_propina(
    data_vencimento DATE,
    data_pagamento DATE
)
RETURNS NUMERIC AS $$
DECLARE
    dias_atraso INTEGER;
    multa NUMERIC(10,2) := 0.00;
BEGIN
    IF data_pagamento <= data_vencimento THEN
        RETURN 0.00;
    END IF;

    dias_atraso := data_pagamento - data_vencimento;

    IF dias_atraso <= 30 THEN
        multa := 5000.00;
    ELSE
        multa := 10000.00;
    END IF;

    RETURN multa;
END;
$$ LANGUAGE plpgsql;

