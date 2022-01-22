const rateLimitter = require("express-rate-limit");
const { createClient } = require("redis");
const redisClient = createClient();

redisClient.connect();

const WINDOW_TIME = +process.env.WINDOW_TIME;
const MAX_REQUESTS = +process.env.MAX_REQUESTS;

const serverRateLimiter = rateLimitter({
    windowMs: WINDOW_TIME * 1000,
    max: MAX_REQUESTS,
    legacyHeaders: false
});

const whitelist = [
    '/users/create',
    '/auth/verify',
    '/validation/api',
    '/validation/db'
];

const tokenRateLimiter = async (req, res, next) => {
    if (whitelist.includes(req.path))
        return next();
    const { userId } = req;
    try {
        const noOfRequets = await redisClient.incr(userId);
        if (noOfRequets === 1) {
            await redisClient.expire(userId, WINDOW_TIME);
        }
        if (noOfRequets > MAX_REQUESTS)
            return res.status(429).json("Too many requests - please try again later.");
        return next();
    } catch (err) {
        console.log(err);
        return res.status(500).json("Server error");
    }
};

module.exports = {
    serverRateLimiter,
    tokenRateLimiter
};