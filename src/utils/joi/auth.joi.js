const Joi = require("joi");
const { 
    phone, 
} = require('./schemas.joi');

const AuthVerifySchema = Joi.object({
    phoneNo: phone.required()
});

module.exports = {
    AuthVerifySchema
};