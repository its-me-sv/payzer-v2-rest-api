const router = require("express").Router();
const db = require("../configs/postgres.config");

router.post("/card", async (req, res) => {
    const { card_id } = req.body;

    const QUERY = `SELECT * FROM get_card_transactions($1)`;
    const VALUE = [card_id];

    try {
        const { rows } = await db.query(QUERY, VALUE);
        return res.status(200).json(rows);
    } catch(err) {
        return res.status(500).json(err);
    }
});

module.exports = router;