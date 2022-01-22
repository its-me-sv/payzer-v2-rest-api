// packages
const helmet = require("helmet");
const morgan = require("morgan");

// custom
const morganConfig = require('../configs/morgan.config');
const { verifyUser } = require('./jwt.utils');
const {
    tokenRateLimiter,
    serverRateLimiter
} = require('./rate-limiting.utils');

const combineMiddlewares = (app, expressJSON) => {
    app.use(helmet());
    app.use(verifyUser);
    app.use(tokenRateLimiter);
    app.use(serverRateLimiter);
    app.use(morgan(morganConfig));
    app.use(expressJSON);
};

module.exports = combineMiddlewares;