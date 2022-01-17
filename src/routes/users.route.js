const router = require('express').Router();
const bcrypt = require("bcrypt");
const db = require("../configs/postgres.config");

const mapIdentifier = {
    user_id: "id",
    phoneNo: "phone_no",
    profilePicture: "profile_picture",
    name: "name"
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

router.get("/search/:keyword", async (req, res) => {
    const { keyword } = req.params;

    const QUERY = `
        SELECT id, phone_no, country, name, profile_picture FROM users WHERE 
        LOWER(name) LIKE $1 OR phone_no LIKE $1;
    `;
    const VALUE = [`%${keyword.toLowerCase()}%`];

    try {
        const { rows } = await db.query(QUERY, VALUE);
        return res.status(200).json(rows);
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.put("/update/:id", async (req, res) => {
    const identifierAndValue = Object.entries(req.body).map(
        pair => [mapIdentifier[pair[0]], pair[1]]
    );
    const params = identifierAndValue.map((pair, i) => `${pair[0]} = $${i + 1}`);

    const QUERY = `UPDATE users SET ${params.join(", ")} WHERE id = $${params.length+1};`;
    const VALUE = [...identifierAndValue.map(val => val[1]), req.params.id];

    try {
        await db.query(QUERY, VALUE);
        return res.status(200).send("Account updated");
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;