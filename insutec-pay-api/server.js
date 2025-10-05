// server_pg.js - Versão Completa, Segura (bcrypt) para o POC usando PostgreSQL
const express = require('express');
const { Pool } = require('pg'); 
const cors = require('cors'); // ✅ MANTER APENAS ESTA DECLARAÇÃO
const pdfkit = require('pdfkit'); 
const fs = require('fs');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0'; // ESSENCIAL: Permite conexões do Expo Go via Host/Port Forwarding
const MEU_IP_DA_VM = '10.12.1.2'; // Variável definida para uso no log e Frontend
const TAXA_MULTA_SIMULADA = 0.02; 
const SALT_ROUNDS = 10; 

// ------------------------------------------
// 1. Configuração do Servidor
// ------------------------------------------

app.use(cors()); // ✅ O MIDDLEWARE CORS ESTÁ CORRETO
app.use(express.json()); 
app.use('/documentos_gerados', express.static('documentos_gerados'));

if (!fs.existsSync('./documentos_gerados')) {
    fs.mkdirSync('./documentos_gerados');
    console.log('Diretório documentos_gerados criado.');
}

// ------------------------------------------
// 2. Configuração do PostgreSQL
// ------------------------------------------

// 🚨 ATUALIZE ESTA SENHA PARA A SUA SENHA REAL DO POSTGRESQL 🚨
const pool = new Pool({
    user: 'ajacs',
    host: 'localhost',
    database: 'insutecpay',
    password: 'Beijodela@120702', // ⚠️ SUA SENHA
    port: 5432,
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('🔴 ERRO: Falha ao conectar ao PostgreSQL.', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
        release();
        if (err) {
            return console.error('Erro ao executar query de teste:', err.stack);
        }
        console.log('✅ Conectado ao PostgreSQL (insutecpay). Tempo do servidor:', result.rows[0].now);
    });
});

// ------------------------------------------
// 3. Funções de Suporte (Geração de PDF)
// ------------------------------------------

/**
 * Gera um documento PDF de "Declaração de Serviço Liquidado".
 */
function gerarPDF(id_transacao_unica, aluno, servicos_pagos, valor_total) {
    const caminho_ficheiro = `/documentos_gerados/${id_transacao_unica}.pdf`; 
    const caminho_fisico = `./documentos_gerados/${id_transacao_unica}.pdf`; 
    const doc = new pdfkit();
    doc.pipe(fs.createWriteStream(caminho_fisico));

    doc.fontSize(18).text('INSTITUTO SUPERIOR TÉCNICO', { align: 'center' });
    doc.fontSize(14).text('INSUTEC - PROVA DE CONCEITO', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(16).fillColor('#007bff').text('RECIBO / DECLARAÇÃO DE SERVIÇO(S) LIQUIDADO(S)', { align: 'center' });
    doc.fillColor('#000000').moveDown();

    // Detalhes do Aluno
    doc.fontSize(12).text(`Aluno: ${aluno.nome}`);
    doc.text(`Nº Estudante: ${aluno.nr_estudante}`);
    doc.moveDown();

    // Tabela de Serviços Pagos
    doc.fontSize(12).text('--- Serviços Liquidados ---');
    servicos_pagos.forEach(s => {
        // Corrigido para garantir que o valor_devido é um número antes de calcular a multa
        const valorBase = parseFloat(s.valor_devido) || 0;
        let multa = s.is_atraso ? valorBase * TAXA_MULTA_SIMULADA : 0;
        doc.text(`- ${s.descricao} (${s.mes_referencia || 'Serviço Único'})`);
        doc.text(`  Valor Base: ${valorBase.toFixed(2)} Kz`, { indent: 10 });
        if (multa > 0) {
            doc.fillColor('#dc3545').text(`  Multa (Simulada): + ${multa.toFixed(2)} Kz`, { indent: 10 });
        }
        doc.fillColor('#000000');
    });

    doc.moveDown(0.5);
    doc.fontSize(14).text(`VALOR PAGO TOTAL: ${valor_total.toFixed(2)} Kz`, { weight: 'bold' });
    doc.moveDown();
    
    // Auditabilidade
    doc.fontSize(10).text(`Confirmado em: ${new Date().toLocaleString()}`, { align: 'left' });
    doc.text(`ID Único da Transação (Chave de Auditoria): ${id_transacao_unica}`, { align: 'left' });

    doc.moveDown(2);
    doc.fontSize(14).text('CÓDIGO DE AUDITABILIDADE INSUTEC PAY', { align: 'center' });
    doc.fontSize(10).text('(Este código garante a autenticidade e liquidação imediata na Secretaria)', { align: 'center' });
    
    doc.end();
    return caminho_ficheiro;
}


// ------------------------------------------
// 4. Rotas da API (Endpoints)
// ------------------------------------------

// Rota de REGISTO (POST /api/aluno/register)
app.post('/api/aluno/register', async (req, res) => {
    const { nome, nr_estudante, password } = req.body;
    if (!nome || !nr_estudante || !password) {
        return res.status(400).json({ success: false, message: 'Número de estudante, nome e palavra-passe são obrigatórios.' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const query = 'INSERT INTO alunos (nome, nr_estudante, password_hash) VALUES ($1, $2, $3) RETURNING id, nome, nr_estudante';
        const result = await pool.query(query, [nome, nr_estudante, hashedPassword]);
        const aluno = result.rows[0];
        res.status(201).json({ success: true, message: 'Registo bem-sucedido.', aluno });
    } catch (err) {
        if (err.code === '23505') { 
            return res.status(409).json({ success: false, message: 'Número de estudante já registado.' });
        }
        console.error("Erro no registo:", err.message);
        res.status(500).json({ error: 'Erro interno do servidor durante o registo.' });
    }
});


// Rota de Login CORRIGIDA (POST /api/aluno/login) - Usa bcrypt
app.post('/api/aluno/login', async (req, res) => {
    const { nr_estudante, password } = req.body;
    if (!nr_estudante || !password) {
        return res.status(400).json({ success: false, message: 'Dados de login em falta.' });
    }
    try {
        const query = 'SELECT id, nome, nr_estudante, password_hash FROM alunos WHERE nr_estudante = $1';
        const result = await pool.query(query, [nr_estudante]);
        const alunoDB = result.rows[0]; 

        if (alunoDB) {
            const isMatch = await bcrypt.compare(password, alunoDB.password_hash);
            if (isMatch) {
                const alunoFiltrado = { 
                    id: alunoDB.id, 
                    nome: alunoDB.nome, 
                    nr_estudante: alunoDB.nr_estudante 
                };
                res.json({ success: true, message: 'Login bem-sucedido', aluno: alunoFiltrado });
            } else {
                res.status(401).json({ success: false, message: 'Número de estudante ou palavra-passe inválidos.' });
            }
        } else {
            res.status(401).json({ success: false, message: 'Número de estudante ou palavra-passe inválidos.' });
        }
    } catch (err) {
        console.error("Erro na base de dados durante o login:", err.message);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Rota de Dívidas e Serviços (GET /api/aluno/:alunoId/dividas)
app.get('/api/aluno/:alunoId/dividas', async (req, res) => {
    const alunoId = parseInt(req.params.alunoId);
    try {
        const query = `
             SELECT 
                 sd.id, 
                 e.descricao, 
                 sd.valor_devido, 
                 sd.mes_referencia, 
                 sd.data_vencimento
             FROM servicos_devidos sd
             JOIN emolumentos e ON sd.emolumento_id = e.id
             WHERE sd.aluno_id = $1 AND sd.esta_pago = FALSE
             ORDER BY sd.data_vencimento ASC
         `;
        const result = await pool.query(query, [alunoId]);
        const dividas = result.rows;
        
        const dividasComMulta = dividas.map(servico => {
            let valor_total = parseFloat(servico.valor_devido);
            let multa = 0;
            let is_atraso = false;
            if (servico.descricao.includes('Propina') && new Date(servico.data_vencimento) < new Date()) {
                multa = valor_total * TAXA_MULTA_SIMULADA; 
                valor_total += multa;
                is_atraso = true;
            }
            return {
                id: servico.id,
                tipo: servico.descricao.includes('Propina') ? 'Propina' : 'Serviço Único',
                descricao: servico.descricao,
                mes: servico.mes_referencia,
                valor_base: parseFloat(servico.valor_devido).toFixed(2),
                data_vencimento: servico.data_vencimento,
                multa: parseFloat(multa.toFixed(2)),
                valor_total: parseFloat(valor_total.toFixed(2)),
                is_atraso: is_atraso,
                descricao_completa: is_atraso 
                    ? `${servico.descricao} (COM Multa de ${multa.toFixed(2)} Kz)` 
                    : `${servico.descricao} (${servico.mes_referencia || 'Serviço Único'})`
            };
        });

        res.json({ success: true, dividas: dividasComMulta });

    } catch (err) {
        console.error("Erro ao obter dívidas:", err.message);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar dívidas.' });
    }
});

// 💡 Rota de HISTÓRICO DE TRANSAÇÕES (GET /api/aluno/:alunoId/historico)
app.get('/api/aluno/:alunoId/historico', async (req, res) => {
    const alunoId = parseInt(req.params.alunoId);
    console.log(`[API] Solicitando histórico para Aluno ID: ${alunoId}`);

    try {
        const query = `
            SELECT
                t.id_transacao_unica,
                t.valor_total_pago AS valor,
                t.status,
                t.data_confirmacao AS data_transacao,
                ARRAY_AGG(e.descricao) AS descricoes_servicos
            FROM transacoes t
            JOIN pagamentos_servicos ps ON t.id = ps.transacao_id
            JOIN servicos_devidos sd ON ps.servico_devido_id = sd.id
            JOIN emolumentos e ON sd.emolumento_id = e.id
            WHERE t.pagador_aluno_id = $1 AND t.status = 'PAGO'
            GROUP BY t.id
            ORDER BY t.data_confirmacao DESC;
        `;
        const result = await pool.query(query, [alunoId]);
        const transacoes = result.rows;

        const historicoFormatado = transacoes.map(t => ({
            id_transacao_unica: t.id_transacao_unica,
            descricao: t.descricoes_servicos.length > 1 
                ? `${t.descricoes_servicos.length} Serviços Pagos (Ex: ${t.descricoes_servicos[0]}...)`
                : t.descricoes_servicos[0] || 'Pagamento Único',
            valor: parseFloat(t.valor),
            status: t.status,
            data_transacao: t.data_transacao,
        }));
        
        res.status(200).json(historicoFormatado);

    } catch (err) {
        console.error("Erro ao obter histórico:", err.message);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar histórico.' });
    }
});


// Rota para iniciar o processo de pagamento (POST /api/pagamento/iniciar)
app.post('/api/pagamento/iniciar', async (req, res) => {
    const { servicos, alunoId } = req.body; 

    if (!servicos || servicos.length === 0 || !alunoId) {
        return res.status(400).json({ success: false, message: 'Dados de pagamento incompletos.' });
    }

    const id_transacao_unica = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
    const valor_total_transacao = servicos.reduce((acc, s) => acc + parseFloat(s.valor_liquidado), 0);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const transacaoQuery = "INSERT INTO transacoes (id_transacao_unica, pagador_aluno_id, valor_total_pago, status) VALUES ($1, $2, $3, 'PENDENTE') RETURNING id";
        const transacaoResult = await client.query(transacaoQuery, [id_transacao_unica, alunoId, valor_total_transacao]);
        const transacaoId = transacaoResult.rows[0].id;

        for (const servico of servicos) {
            const linkQuery = "INSERT INTO pagamentos_servicos (transacao_id, servico_devido_id, valor_liquidado) VALUES ($1, $2, $3)";
            await client.query(linkQuery, [transacaoId, servico.id, servico.valor_liquidado]);
        }
        
        await client.query('COMMIT');

        res.json({
            success: true,
            message: `Transação criada para ${servicos.length} serviço(s). Aguardando pagamento.`,
            id_transacao_unica: id_transacao_unica,
            valor_total: valor_total_transacao.toFixed(2),
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Erro ao registar a transação (PG):", err.message);
        res.status(500).json({ success: false, message: 'Erro interno ao registar a transação.' });
    } finally {
        client.release();
    }
});

// Rota do Webhook Simulado (POST /api/pagamento/webhook)
app.post('/api/pagamento/webhook', async (req, res) => {
    const { id_transacao_unica, status } = req.body;

    if (status !== 'PAGO') {
        return res.status(200).json({ success: false, message: 'Status não é PAGO.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const updateTransacao = 'UPDATE transacoes SET status = $1, data_confirmacao = NOW() WHERE id_transacao_unica = $2 AND status = \'PENDENTE\' RETURNING *';
        const transacaoResult = await client.query(updateTransacao, [status, id_transacao_unica]);

        if (transacaoResult.rowCount === 0) {
              await client.query('ROLLBACK');
              return res.status(200).json({ success: false, message: 'Transação não encontrada ou já paga.' });
        }
        const transacao = transacaoResult.rows[0];

        const detalhesQuery = `
             SELECT 
                 sd.id AS servico_id, 
                 sd.valor_devido, 
                 sd.mes_referencia, 
                 sd.data_vencimento,
                 e.descricao,
                 a.nome, a.nr_estudante
             FROM pagamentos_servicos ps
             JOIN servicos_devidos sd ON ps.servico_devido_id = sd.id
             JOIN alunos a ON sd.aluno_id = a.id
             JOIN emolumentos e ON sd.emolumento_id = e.id
             WHERE ps.transacao_id = $1;
         `;
        const detalhesResult = await client.query(detalhesQuery, [transacao.id]);
        const servicos_pagos = detalhesResult.rows;

        if (servicos_pagos.length === 0) {
            await client.query('ROLLBACK');
            return res.status(500).json({ success: false, message: 'Serviços ligados não encontrados.' });
        }

        const aluno = { nome: servicos_pagos[0].nome, nr_estudante: servicos_pagos[0].nr_estudante };

        const servicosPDF = servicos_pagos.map(s => ({
            ...s,
            is_atraso: s.descricao.includes('Propina') && new Date(s.data_vencimento) < new Date() 
        }));
        const caminho_ficheiro = gerarPDF(id_transacao_unica, aluno, servicosPDF, transacao.valor_total_pago);

        const servicoIds = servicos_pagos.map(s => s.servico_id);
        const placeholders = servicoIds.map((_, i) => `$${i + 1}`).join(', ');

        await client.query(`UPDATE servicos_devidos SET esta_pago = TRUE, data_liquidacao = NOW() WHERE id IN (${placeholders})`, 
             [...servicoIds]); 
        
        await client.query('UPDATE transacoes SET caminho_documento = $1 WHERE id = $2', [caminho_ficheiro, transacao.id]);
        
        await client.query('COMMIT');

        console.log(`✅ WEBHOOK SUCESSO (PG): Transação ${id_transacao_unica} paga, ${servicos_pagos.length} serviço(s) liquidado(s).`);
        res.json({ success: true, message: 'Pagamento processado, serviços liquidados e documento gerado.' });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Erro no Webhook (PG):", err.message);
        res.status(500).json({ success: false, message: 'Erro interno ao processar o webhook.' });
    } finally {
        client.release();
    }
});

// Rota de Polling para verificar o status de uma transação (GET /api/transacao/:id/status)
app.get('/api/transacao/:id_transacao_unica/status', async (req, res) => {
    const { id_transacao_unica } = req.params;

    try {
        const query = 'SELECT status, caminho_documento FROM transacoes WHERE id_transacao_unica = $1';
        const result = await pool.query(query, [id_transacao_unica]);
        const row = result.rows[0];

        if (!row) return res.status(404).json({ error: 'Transação não encontrada.' });

        res.json({ success: true, status: row.status, caminho_documento: row.caminho_documento });
    } catch (err) {
        console.error("Erro ao obter status da transação:", err.message);
        res.status(500).json({ error: 'Erro interno ao consultar o status.' });
    }
});


// ------------------------------------------
// 5. Início do Servidor (CORRIGIDO)
// ------------------------------------------
app.listen(PORT, HOST, () => {
    console.log(`🚀 Servidor Express.js (PostgreSQL) a executar em http://${HOST}:${PORT}`);
    console.log(`Acessível para o Expo Go (FRONTEND) no teu IP da VM: http://${MEU_IP_DA_VM}:${PORT}`); 
    console.log('NOTA: O login agora usa bcrypt para segurança. Garanta que as senhas na BD estão hashed!');
    console.log('----------------------------------------------------');
});
