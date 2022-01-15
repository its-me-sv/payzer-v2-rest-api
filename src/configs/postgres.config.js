const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT
});

const query = (text, params) => pool.query(text, params);

module.exports = {
    query
};