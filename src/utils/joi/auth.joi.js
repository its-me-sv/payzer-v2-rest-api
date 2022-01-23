const Joi = require("joi");
const { 
    phone, nrmst
} = require('./schemas.joi');

const AuthVerifySchema = Joi.object({
    phoneNo: phone.required()
});

const AuthOtpSchema = Joi.object({
    phoneNo: phone.required(),
    otp: nrmst.required()
});

module.exports = {
    AuthVerifySchema,
    AuthOtpSchema
};