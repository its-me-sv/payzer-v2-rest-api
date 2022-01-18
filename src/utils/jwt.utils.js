const jwt = require("jsonwebtoken");
const db = require("../configs/postgres.config");

const isUserLoggedIn = async userId => {
    const QUERY = `SELECT * FROM tokens WHERE user_id = $1;`;
    const VALUE = [userId];
    
    const { rowCount } = await db.query(QUERY, VALUE);
    return rowCount === 1;
};

const logInUser = async (userId, token) => {
    const QUERY = `INSERT INTO tokens VALUES($1, $2);`;
    const VALUE = [userId, token];

    await db.query(QUERY, VALUE);
};

const removeUser = async userId => {
    const QUERY = `DELETE FROM tokens WHERE user_id = $1`;
    const VALUE = [userId];

    await db.query(QUERY, VALUE);
};

const { ROUTE_1, ROUTE_2 } = process.env;
const whitelist = [ROUTE_1, ROUTE_2];

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
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err || !isUserLoggedIn(user.id))
            return res.status(400).json("You are NOT Authorized");
        req.user = user;
        return next();
    });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyUser,
    isUserLoggedIn
};