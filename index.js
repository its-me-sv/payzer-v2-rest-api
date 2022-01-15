const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const morganConfig = require('./src/configs/morgan.config');
require("dotenv").config();

const app = express();

app.use(cors());
app.use(morgan(morganConfig));
app.use(express.json());

app.get('/validation', async (req, res) => {
    return res.status(200).json("validation route");
});

const PORT = process.env.port || process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.clear();
    console.log(`[REST API] Listening to PORT ${PORT}`);
});