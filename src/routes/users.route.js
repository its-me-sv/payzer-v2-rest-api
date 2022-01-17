const router = require('express').Router();
const bcrypt = require("bcrypt");
const db = require("../configs/postgres.config");

const mapIdentifier = {
    user_id: "id",
    phoneNo: "phone_no"
};

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

router.post("/retrieve", async (req, res) => {
    const { identifier, value } = req.body;
    const column = mapIdentifier[identifier];
    
    const QUERY = `SELECT * FROM users WHERE ${column} = $1`;
    const VALUE = [value];
    
    try {
        const { rows, rowCount } = await db.query(QUERY, VALUE);
        if (!rowCount) return res.status(400).json("No user");
        const { otp, ...user } = rows[0]
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;