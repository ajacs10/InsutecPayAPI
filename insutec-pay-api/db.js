const { Pool } = require('pg');

// 1. Definição da string de conexão para o Render
const connectionString = process.env.DATABASE_URL;

// 2. Configuração do Pool: Usa a string de conexão do Render se estiver definida
const pool = new Pool(
    // Se connectionString existir (no Render), usa-a
    connectionString ? 
    {
        connectionString: connectionString,
        // Configuração SSL necessária para o Render
        ssl: {
            rejectUnauthorized: false
        }
    } 
    // Senão, usa a configuração local para o desenvolvimento na sua VM
    : 
    {
        user: 'ajacs',
        host: 'localhost',
        database: 'insutecpay',
        password: 'Beijodela@120702', // Use a senha correta da sua VM
        port: 5432,
    }
);

module.exports = pool;
