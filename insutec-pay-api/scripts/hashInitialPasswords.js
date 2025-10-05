// scripts/hashInitialPasswords.js (VERSÃO FINAL E FORÇADA PARA TESTES)

const bcrypt = require('bcrypt');
const { Pool } = require('pg'); 

// 🚨 CONFIGURAÇÕES DE CONEXÃO 🚨
const pool = new Pool({
    user: 'ajacs',
    host: 'localhost',
    database: 'insutecpay',
    password: 'Beijodela@120702', // 🛑 Corrigir com a senha que funcionou na primeira execução
    port: 5432,
});

// A senha de TESTE universal.
const TEST_PASSWORD = '123456'; 
const saltRounds = 10;

async function hashAllPasswords() {
    console.log("🚀 A começar o processo de hashing de senhas...");
    
    try {
        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, saltRounds);
        console.log(`✅ Hash bcrypt gerado para a senha '${TEST_PASSWORD}'.`);

        // 🛑 CONSULTA CORRIGIDA: ATUALIZA TODOS OS ALUNOS AGORA!
        const updateQuery = `
            UPDATE alunos 
            SET password_hash = $1;
        `;
        
        const result = await pool.query(updateQuery, [hashedPassword]);
        
        console.log(`🎉 Sucesso! ${result.rowCount} aluno(s) atualizados.`);
        console.log(`Todos podem agora fazer login na App com a senha: ${TEST_PASSWORD}`);

    } catch (err) {
        console.error("❌ ERRO FATAL no script de hashing:", err.message);
    } finally {
        // Agora o 'pool.end()' vai funcionar
        await pool.end();
        console.log("Conexão com a BD encerrada.");
    }
}

hashAllPasswords();
