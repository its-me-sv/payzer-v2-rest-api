const knex = require("knex");
const { io } = require("socket.io-client");

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE
    }
});

const socket = io("http://192.168.29.97:5001");

const notify = async () => {
    const client = await db.client.acquireConnection();
    client.query('LISTEN new_transaction_event');
    client.on("notification", async (data) => {
        socket.emit("new-transaction", data.payload);
    });
};

notify();

module.exports = db;