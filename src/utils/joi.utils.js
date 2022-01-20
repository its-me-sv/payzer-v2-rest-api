const Joi = require("joi");

const AuthVerifySchema = Joi.object({
    phoneNo: Joi.string().min(5).required()
});

const UsersCreateSchema = Joi.object({
    phoneNo: Joi.string().min(5).required(),
    country: Joi.string().required(),
    otp: Joi.string().required(),
    name: Joi.string().min(2).max(28).required(),
    profilePicture: Joi.string().min(2).required()
});

const UsersRetrieveSchema = Joi.object({
    identifier: Joi.string().required(),
    value: Joi.string().required()
});

const UsersSearchSchema = Joi.object({
    keyword: Joi.string().min(2).required()
});

const UsersUpdateSchema = Joi.object({
    name: Joi.string().min(2).max(28),
    profilePicture: Joi.string().min(2),
    phoneNo: Joi.string().min(5)
}).min(1);

const CardsRetrieveAllSchema = Joi.object({
    user_id: Joi.string().min(3).required()
});

const CardsAddCardSchema = Joi.object({
    user_id: Joi.string().min(3).required()
});

const CardsAddAmountSchema = Joi.object({
    user_id: Joi.string().min(3).required(),
    card_id: Joi.string().min(3).required(),
    amount: Joi.number().required()
});

module.exports = {
    AuthVerifySchema,
    UsersCreateSchema,
    UsersRetrieveSchema,
    UsersSearchSchema,
    UsersUpdateSchema,
    CardsRetrieveAllSchema,
    CardsAddCardSchema,
    CardsAddAmountSchema
};