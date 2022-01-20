const router = require("express").Router();
const db = require("../utils/postgres.utils");
const {
    TransactionsCardSchema,
    TransactionsUserSchema,
    TransactionsBetweenUsersSchema,
    TransactionsSendSchema
} = require("../utils/joi.utils");

router.post("/card", async (req, res) => {
    try {
        await TransactionsCardSchema.validateAsync(req.body);
        const { card_id } = req.body;
    
        const QUERY = `SELECT * FROM get_card_transactions($1)`;
        const VALUE = [card_id];
    
        const { rows } = await db.query(QUERY, VALUE);
        return res.status(200).json(rows);
    } catch(err) {
        return res.status((err.isJoi && 400) || 500).json(err);
    }
});

router.post("/user", async (req, res) => {
    try {
        await TransactionsUserSchema.validateAsync(req.body);
        const { user_id } = req.body;

        if (user_id != req.userId)
            return res.status(400).json("Request failed");
    
        const QUERY = `SELECT * FROM get_user_transactions($1)`;
        const VALUE = [user_id];
    
        const { rows } = await db.query(QUERY, VALUE);
        return res.status(200).json(rows);
    } catch (err) {
        return res.status((err.isJoi && 400) || 500).json(err);
    }
});

router.post("/between-users", async (req, res) => {
    try {
        await TransactionsBetweenUsersSchema.validateAsync(req.body);
        const { id1, id2 } = req.body;

        if (![id1, id2].includes(req.userId))
            return res.status(400).json("Request failed");
    
        const QUERY = `SELECT * FROM get_transactions_between_users($1, $2)`;
        const VALUE = [id1, id2];
    
        const { rows } = await db.query(QUERY, VALUE);
        return res.status(200).json(rows);
    } catch (err) {
        return res.status((err.isJoi && 400) || 500).json(err);
    }
});

router.post("/send", async (req, res) => {
    try {
        await TransactionsSendSchema.validateAsync(req.body);
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
    
        if (senderId != req.userId)
            return res.status(400).json("Request failed");
    
        await db.query(QUERY, VALUE);
        return res.status(200).json("Transaction successfull");
    } catch (err) {
        return res.status((err.isJoi && 400) || 500).json(err);
    }
});

module.exports = router;