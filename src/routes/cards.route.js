const router = require("express").Router();
const knex = require("../utils/knex.utils");
const {
    CardsRetrieveAllSchema,
    CardsAddCardSchema,
    CardsAddAmountSchema
} = require("../utils/joi.utils");

router.post("/retrieve-all", async(req, res) => {
    try {
        await CardsRetrieveAllSchema.validateAsync(req.body);
        const { user_id } = req.body;
    
        if (user_id != req.userId)
            return res.status(400).json("Request failed");
    
        const rows = await knex(knex.raw('get_user_cards(?)', [user_id]))
            .select('id', 'is_primary', 'credit', 'debit', 'created_at');
        const rowCount = rows.length;

        if (!rowCount) return res.status(400).json("No user");
        return res.status(200).json(rows);
    } catch (err) {
        return res.status((err.isJoi && 400) || 500).json(err);
    }
});

router.post("/add-card", async (req, res) => {
    try {
        await CardsAddCardSchema.validateAsync(req.body);
        const { user_id } = req.body;

        if (user_id != req.userId)
            return res.status(400).json("Request failed");

        const rows = await knex('cards').insert({ 
            user_id,
            credit: 5000.0
        }).returning('*');

        return res.status(200).json(rows[0]);
    } catch (err) {
        return res.status((err.isJoi && 400) || 500).json(err);
    }
});

router.put("/add-amount", async (req, res) => {
    try {
        await CardsAddAmountSchema.validateAsync(req.body);
        const { user_id, card_id, amount } = req.body;
        
        if (user_id != req.userId)
            return res.status(400).json("Request failed");

        await knex('cards')
        .update({ credit: knex.raw('credit + ?', [amount]) }).where('id', card_id);
        await knex('users')
        .update({ credit: knex.raw('credit + ?', [amount]) }).where('id', user_id);
        
        return res.status(200).json("Transaction successfull");
    } catch (err) {
        return res.status((err.isJoi && 400) || 500).json(err);
    }
});

module.exports = router;