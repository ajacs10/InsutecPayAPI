// src/utils/authUtils.js

const bcrypt = require('bcrypt');

// Fator de custo: 10 é um bom equilíbrio entre segurança e velocidade para a maioria dos casos.
const saltRounds = 10; 

/**
 * Converte a senha de texto puro numa string de hash bcrypt.
 * @param {string} password A senha de texto puro a ser hashed (ex: '4871415418').
 * @returns {Promise<string>} O hash bcrypt da senha.
 */
async function hashPassword(password) {
    try {
        // Gera o 'salt' (valor aleatório) e faz o hash em simultâneo
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        console.error("Erro ao gerar hash bcrypt:", error);
        throw new Error("Falha no processamento seguro da senha.");
    }
}

/**
 * Compara uma senha de texto puro com um hash bcrypt.
 * @param {string} password A senha de texto puro.
 * @param {string} hash O hash bcrypt guardado na base de dados.
 * @returns {Promise<boolean>} True se as senhas coincidirem, False caso contrário.
 */
async function comparePassword(password, hash) {
    try {
        const match = await bcrypt.compare(password, hash);
        return match;
    } catch (error) {
        console.error("Erro ao comparar senhas:", error);
        return false;
    }
}

module.exports = {
    hashPassword,
    comparePassword,
};
