const router = require("express").Router();
const knex = require("../utils/knex.utils");
const { 
    isUserLoggedIn, 
    generateAccessToken,
    generateRefreshToken,
    removeUser
} = require('../utils/jwt.utils');
const {
    AuthVerifySchema,
    AuthOtpSchema
} = require("../utils/joi.utils");
const {
    sendVerificationCode,
    checkVerificationCode
} = require("../utils/sms-service.utils");

router.post("/verify", async (req, res) => {
    try {
        const bodyCheck = await AuthVerifySchema.validateAsync(req.body);
        const { phoneNo } = bodyCheck;
        const rows = await knex.select('*').from('users').where({ phone_no: phoneNo });
        const rowCount = rows.length;
        if (!rowCount)
            return res.status(200).json({newAccount: true});
        const { otp, ...user } = rows[0];
        const isLogged = await isUserLoggedIn(user.id);
        if (isLogged)
            return res.status(400).json("Already logged in");
        const jwt_token = await generateAccessToken(user);
        return res.status(200).json({ user, jwt_token, newAccount: false });
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

router.post("/send-otp", async (req, res) => {
    try {
        const bodyCheck = await AuthVerifySchema.validateAsync(req.body);
        const { phoneNo } = bodyCheck;
        if (!process.env.NODE_ENV.includes('dev'))
            await sendVerificationCode(phoneNo);
        else
            console.log(phoneNo);
        return res.status(200).json("Verification code has been sent");
    } catch (err) {
        return res.status((err.isJoi && 400) || 500).json(err);
    }
});

router.post("/check-otp", async (req, res) => {
    try {
        const bodyCheck = await AuthOtpSchema.validateAsync(req.body);
        const { phoneNo, otp } = bodyCheck;
        if (!process.env.NODE_ENV.includes('dev')) {
            const status = await checkVerificationCode(phoneNo, otp);
            if (status != 'approved')
                return res.status(400).json("Not Verified");
        } else {
            console.log(phoneNo, otp);
        }
        return res.status(200).json({otp});
    } catch (err) {
        return res.status((err.isJoi && 400) || 500).json(err);
    }
});

module.exports = router;