const router = require("express").Router();
const db = require('../utils/postgres.utils');
const { 
    isUserLoggedIn, 
    generateAccessToken,
    generateRefreshToken,
    removeUser
} = require('../utils/jwt.utils');
const {
    AuthVerifySchema
} = require("../utils/joi.utils");

router.post("/verify", async (req, res) => {
    try {
        const bodyCheck = await AuthVerifySchema.validateAsync(req.body);
        const { phoneNo } = bodyCheck;
        const QUERY = `SELECT * FROM users WHERE phone_no = $1`;
        const VALUE = [phoneNo];
        const { rowCount, rows } = await db.query(QUERY, VALUE);
        if (!rowCount)
            return res.status(400).json("No account");
        const { otp, ...user } = rows[0];
        const isLogged = await isUserLoggedIn(user.id);
        if (isLogged)
            return res.status(400).json("Already logged in");
        const jwt_token = await generateAccessToken(user);
        return res.status(200).json({ user, jwt_token });
    } catch (err) {
        return res.status((err.isJoi && 400) || 500).json(err);
    }
});

router.post("/refresh", async (req, res) => {
    try {
        const jwt_token = await generateRefreshToken({ id: req.userId });
        if (!jwt_token)
            return res.status(400).json("Cannot refresh token");
        return res.status(200).json({ jwt_token });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});

router.delete("/logout", async (req, res) => {
    const { userId } = req;
    try {
        const isLogged = await isUserLoggedIn(userId);
        if (!isLogged)
            return res.status(400).json("Not logged in");
        await removeUser(userId);
        return res.status(200).json("Logged out successfully");
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});

module.exports = router;