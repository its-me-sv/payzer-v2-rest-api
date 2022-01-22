const Joi = require("joi");
const {
    usrid, crdid, amont
} = require('./schemas.joi');

const CardsRetrieveAllSchema = Joi.object({
    user_id: usrid.required()
});

const CardsAddCardSchema = Joi.object({
    user_id: usrid.required()
});

const CardsAddAmountSchema = Joi.object({
    user_id: usrid.required(),
    card_id: crdid.required(),
    amount: amont.required()
});

module.exports = {
    CardsRetrieveAllSchema,
    CardsAddCardSchema,
    CardsAddAmountSchema
};