const { Pool } = require('pg');

const pool = new Pool({
  user: 'ajacs',
  host: 'localhost', // ou IP do servidor
  database: 'insutecpay',
  password: 'Beijodela@120702',
  port: 5432,
});

module.exports = pool;

