const router = require("express").Router();
const db = require('../configs/postgres.config');

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

module.exports = router;