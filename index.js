require("dotenv").config();
const express = require("express");

const app = express();

// custom
const combineRoutes = require('./src/routes');
const combineMiddlewares = require('./src/utils/middleware');

// middlewares
combineMiddlewares(app, express.json());

// routes
combineRoutes(app);

const PORT = process.env.port || process.env.PORT || process.env.Port || 5000;
const server = app.listen(PORT, async () => {
    console.clear();
    console.log(`[REST API] Listening to PORT ${PORT}`);
});

process.on("uncaughtException", async err => {
    server.close();
    console.log(`[REST API] App crashed due to ${err.message}`);
    process.exit(1);
});