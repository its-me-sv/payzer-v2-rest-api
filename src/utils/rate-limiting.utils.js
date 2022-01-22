const rateLimitter = require("express-rate-limit");

const WINDOW_TIME = +process.env.WINDOW_TIME;
const MAX_REQUESTS = +process.env.MAX_REQUESTS;

const serverRateLimiter = rateLimitter({
    windowMs: WINDOW_TIME * 1000,
    max: MAX_REQUESTS
});

module.exports = {
    serverRateLimiter
};