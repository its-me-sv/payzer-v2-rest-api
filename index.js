require("dotenv").config();

// packages
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");

// custom
const morganConfig = require('./src/configs/morgan.config');
const {
    serverRateLimiter
} = require('./src/utils/rate-limiting.utils');
const { verifyUser } = require('./src/utils/jwt.utils');
const validationRoute = require('./src/routes/validation.route');
const authRoute = require('./src/routes/auth.route');
const usersRoute = require('./src/routes/users.route');
const cardsRoute = require('./src/routes/cards.route');
const transactionsRoute = require('./src/routes/transactions.route');

const app = express();

app.use(helmet());
app.use(serverRateLimiter);
app.use(verifyUser);
app.use(morgan(morganConfig));
app.use(express.json());

app.use("/validation", validationRoute);
app.use("/auth", authRoute);
app.use("/users", usersRoute);
app.use("/cards", cardsRoute);
app.use("/transactions", transactionsRoute);

const PORT = process.env.port || process.env.PORT || process.env.Port || 5000;
app.listen(PORT, async () => {
    console.clear();
    console.log(`[REST API] Listening to PORT ${PORT}`);
});