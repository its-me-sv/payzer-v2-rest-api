const jwt = require("jsonwebtoken");
const knex = require("./knex.utils");

const isUserLoggedIn = async userId => {
    const data = await knex.select('user_id').from('tokens').where({ user_id: userId});
    return data.length === 1;
};

const logInUser = async (userId, token) => {
    await knex('tokens').insert({
        user_id: userId,
        token
    });
};

const removeUser = async userId => {
    await knex('tokens').where({ user_id: userId}).del();
};

const whitelist = [
    '/users/create', 
    '/auth/verify',
    '/validation/api',
    '/validation/db'
];

const generateAccessToken = async user => {
    if (await isUserLoggedIn(user.id)) return null;
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    await logInUser(user.id, token);
    return token;
};

const generateRefreshToken = async user => {
    if (!(await isUserLoggedIn(user.id))) return null;
    await removeUser(user.id);
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    await logInUser(user.id, token);
    return token;
};

const verifyUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (whitelist.includes(req.path)) 
        return next();
    
    if (!authHeader) 
        return res.status(400).json("You are NOT Authenticated");
    
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        const rows = await knex.select('*').from('tokens').where({ user_id: user.id});
        const rowCount = rows.length;
        if (err || !isUserLoggedIn(user.id) || !rowCount || rows[0].token != token)
            return res.status(400).json("You are NOT Authorized");
        req.userId = user.id;
        return next();
    });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyUser,
    isUserLoggedIn,
    removeUser
};