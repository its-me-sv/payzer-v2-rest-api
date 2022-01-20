const { Client } = require("pg");

const client = new Client();

client.query('LISTEN new_transaction_event');

client.on("notification", async (data) => {
    const payload = JSON.parse(data.payload);
    console.log("new row added", payload);
});

client.connect();

module.exports = client;