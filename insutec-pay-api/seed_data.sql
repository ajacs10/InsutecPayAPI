-- ========================================
-- Base de Dados: InsutecPay
-- Ficheiro 3/3: DADOS DE TESTE (Apenas Usuário)
-- Versão 5.2
-- ========================================

-- Variáveis de configuração
\set nr_estudante_ana '220428'
\set nome_ana 'Ana Sobrinho'
\set curso_ana 'Engenharia Informática e Sistemas de Informação'
\set ano_academico_ana 4

-- 1. Aluna de Teste: Ana Sobrinho
-- Nr. Estudante: 220428
-- Senha (hash): 120702
INSERT INTO alunos (nr_estudante, password_hash, nome, curso, ano_academico)
VALUES (:'nr_estudante_ana', 'hash_120702', :'nome_ana', :'curso_ana', :'ano_academico_ana')
ON CONFLICT (nr_estudante) DO NOTHING;

-- NOTA: Como você solicitou, nenhuma dívida (servicos_devidos) será inserida para esta aluna.

