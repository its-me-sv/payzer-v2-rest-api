const Joi = require("joi");
const {
    phone, cntry, otpcd,
    names, profp, nrmst,
    keywd
} = require('./schemas.joi');

const UsersCreateSchema = Joi.object({
    phoneNo: phone.required(),
    country: cntry.required(),
    otp: otpcd.required(),
    name: names.required(),
    profilePicture: profp.required()
});

const UsersRetrieveSchema = Joi.object({
    identifier: nrmst.required(),
    value: nrmst.required()
});

const UsersSearchSchema = Joi.object({
    keyword: keywd.required()
});

const UsersUpdateSchema = Joi.object({
    name: names,
    profilePicture: profp,
    phoneNo: phone
}).min(1);

module.exports = {
    UsersCreateSchema, UsersRetrieveSchema,
    UsersSearchSchema, UsersUpdateSchema
};