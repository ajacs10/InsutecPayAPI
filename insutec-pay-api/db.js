const { Pool } = require('pg');

// Usa a variável de ambiente DATABASE_URL fornecida pelo Render
const connectionString = process.env.DATABASE_URL;

const pool = new Pool(
    // Se connectionString existir (no Render), usa-a com SSL
    connectionString ? 
    {
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    } 
    // Senão, usa a sua configuração local (para o desenvolvimento na VM)
    : 
    {
        user: 'ajacs',
        host: 'localhost',
        database: 'insutecpay',
        password: 'Beijodela@120702', // Use a senha da sua VM
        port: 5432,
    }
);

module.exports = pool;
