const knex = require("knex");

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

const notify = async () => {
    const client = await db.client.acquireConnection();
    client.query('LISTEN new_transaction_event');
    client.on("notification", async (data) => {
        // console.log("new row added", data.payload);
    });
};

notify();

module.exports = db;