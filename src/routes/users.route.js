const router = require('express').Router();
const bcrypt = require("bcrypt");
const db = require("../configs/postgres.config");

router.post("/create", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(+process.env.SALT);
        req.body.otp = await bcrypt.hash(req.body.otp, salt);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
    const {
        phoneNo,
        country,
        otp,
        name,
        profilePicture
    } = req.body;

    const QUERY = `
        INSERT INTO users(phone_no, country, otp, name, profile_picture)
        VALUES($1, $2, $3, $4, $5);
    `;
    const VALUE = [phoneNo, country, otp, name, profilePicture];

    try {
        const result = await db.query(QUERY, VALUE);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json((err.detail && {error: err.detail}) || {error: true});
    }

});

module.exports = router;