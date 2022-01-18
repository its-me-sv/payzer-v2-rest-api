require("dotenv").config();

// packages
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// custom
const morganConfig = require('./src/configs/morgan.config');
const { verifyUser } = require('./src/utils/jwt.utils');
const authRoute = require('./src/routes/auth.route');
const usersRoute = require('./src/routes/users.route');
const cardsRoute = require('./src/routes/cards.route');
const transactionsRoute = require('./src/routes/transactions.route');

const app = express();

app.use(cors());
app.use(morgan(morganConfig));
app.use(verifyUser);
app.use(express.json());

app.use("/auth", authRoute);
app.use("/users", usersRoute);
app.use("/cards", cardsRoute);
app.use("/transactions", transactionsRoute);

app.get('/validation', async (req, res) => {
    return res.status(200).json("validation route");
});

const PORT = process.env.port || process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.clear();
    console.log(`[REST API] Listening to PORT ${PORT}`);
});