const AuthSchema = require('./joi/auth.joi');
const CardSchema = require('./joi/cards.joi');
const UserSchema = require('./joi/users.joi');
const TransactionSchema = require('./joi/transactions.joi');

module.exports = {
    ...AuthSchema,
    ...CardSchema,
    ...UserSchema,
    ...TransactionSchema
};