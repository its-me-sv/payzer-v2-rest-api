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

module.exports = {
    AuthVerifySchema,
    UsersCreateSchema,
    UsersRetrieveSchema,
    UsersSearchSchema,
    UsersUpdateSchema
};