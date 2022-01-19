const { Client } = require("pg");

const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT
});

client.query('LISTEN new_transaction_event');

client.on("notification", async (data) => {
    const payload = JSON.parse(data.payload);
    console.log("new row added", payload);
});

client.connect();

module.exports = client;