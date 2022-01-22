const validationRoute = require('./validation.route');
const authRoute = require('./auth.route');
const usersRoute = require('./users.route');
const cardsRoute = require('./cards.route');
const transactionsRoute = require('./transactions.route');

const combineReducers = app => {
    app.use("/validation", validationRoute);
    app.use("/auth", authRoute);
    app.use("/users", usersRoute);
    app.use("/cards", cardsRoute);
    app.use("/transactions", transactionsRoute);
};

module.exports = combineReducers;