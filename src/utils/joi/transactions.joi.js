const Joi = require("joi");
const {
    crdid, usrid, amont
} = require('./schemas.joi');

const TransactionsCardSchema = Joi.object({
    card_id: crdid.required()
});

const TransactionsUserSchema = Joi.object({
    user_id: usrid.required()
});

const TransactionsBetweenUsersSchema = Joi.object({
    id1: usrid.required(),
    id2: usrid.required()
});

const TransactionsSendSchema = Joi.object({
    senderId: usrid.required(),
    recieverId: usrid.required(),
    cardId: crdid.required(),
    amount: amont.required(),
    rate: amont.required()
});

module.exports = {
    TransactionsCardSchema,
    TransactionsUserSchema,
    TransactionsBetweenUsersSchema,
    TransactionsSendSchema
};