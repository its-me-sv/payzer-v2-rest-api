const router = require("express").Router();
const db = require('../configs/postgres.config');
const {} = require('../utils/jwt.utils');

router.post("/verify", async (req, res) => {
    const { phoneNo } = req.body;
    
    const QUERY = `SELECT * FROM users WHERE phone_no = $1`;
    const VALUE = [phoneNo];

    try {
        const { rowCount, rows } = await db.query(QUERY, VALUE);
        if (!rowCount)
            return res.status(200).json("No account");
        const { otp, ...user } = rows[0];
        return res.status(200).json({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});

module.exports = router;