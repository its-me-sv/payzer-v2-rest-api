const Joi = require("joi");

const AuthVerifySchema = Joi.object({
    phoneNo: Joi.string().min(5).required()
});

module.exports = {
    AuthVerifySchema
};