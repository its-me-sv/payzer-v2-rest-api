const router = require("express").Router();
const db = require('../utils/postgres.utils');

router.post("/retrieve-all", async(req, res) => {
    const { user_id } = req.body;

    const QUERY = `SELECT id, is_primary, credit, debit, created_at  FROM get_user_cards($1)`;
    const VALUE = [user_id];

    try {
        const { rows, rowCount } = await db.query(QUERY, VALUE);
        if (!rowCount) return res.status(400).json("No user");
        return res.status(200).json(rows);
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.post("/add-card", async (req, res) => {
    const { user_id } = req.body;

    const QUERY = `INSERT INTO cards(user_id, credit) VALUES($1, 5000.0)`;
    const VALUE = [user_id];

    try {
        const result = await db.query(QUERY, VALUE);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.put("/add-amount", async (req, res) => {
    const { user_id, card_id, amount } = req.body;

    const QUERY1 = `UPDATE cards SET credit = credit + $1 WHERE id = $2`;
    const VALUE1 = [amount, card_id];

    const QUERY2 = `UPDATE users SET credit = credit + $1 WHERE id = $2`;
    const VALUE2 = [amount, user_id];

    if (user_id != req.userId)
        return res.status(400).json("Request failed");

    try {
        await db.query(QUERY1, VALUE1);
        await db.query(QUERY2, VALUE2);
        return res.status(200).json("Transaction successfull");
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;