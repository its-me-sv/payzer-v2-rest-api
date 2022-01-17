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

router.post("/user", async (req, res) => {
    const { user_id } = req.body;

    const QUERY = `SELECT * FROM get_user_transactions($1)`;
    const VALUE = [user_id];

    try {
        const { rows } = await db.query(QUERY, VALUE);
        return res.status(200).json(rows);
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.post("/between-users", async (req, res) => {
    const { id1, id2 } = req.body;

    const QUERY = `SELECT * FROM get_transactions_between_users($1, $2)`;
    const VALUE = [id1, id2];

    try {
        const { rows } = await db.query(QUERY, VALUE);
        return res.status(200).json(rows);
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.post("/send", async (req, res) => {
    const { 
        senderId, 
        recieverId,
        cardId,
        amount,
        rate
    } = req.body;

    const QUERY = `
        INSERT INTO transactions(sender_id, reciever_id, card_id, amount, rate)
        VALUES ($1, $2, $3, $4, $5);
    `;
    const VALUE = [senderId, recieverId, cardId, amount, rate];

    try {
        await db.query(QUERY, VALUE);
        return res.status(200).json("Transaction successfull");
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;