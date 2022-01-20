const router = require("express").Router();
const knex = require("../utils/knex.utils");
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
    
        const rows = await knex(knex.raw('get_card_transactions(?)', [card_id])).select('*');

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

        const rows = await knex(knex.raw('get_user_transactions(?)', [user_id])).select('*');
        
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
    
        const rows = await knex(
            knex.raw('get_transactions_between_users(?, ?)', [id1, id2])
        ).select('*');
        
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
    
        if (senderId != req.userId)
            return res.status(400).json("Request failed");

        await knex('transactions').insert({
            sender_id: senderId,
            reciever_id: recieverId,
            card_id: cardId,
            amount,
            rate
        });

        return res.status(200).json("Transaction successfull");
    } catch (err) {
        return res.status((err.isJoi && 400) || 500).json(err);
    }
});

module.exports = router;