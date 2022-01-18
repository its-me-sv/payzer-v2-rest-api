const jwt = require("jsonwebtoken");
const db = require("../configs/postgres.config");

const generateAccessToken = user => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET);
};

const generateRefreshToken = user => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
};