const Joi = require("joi");

const phone = Joi.string().min(5);
const cntry = Joi.string();
const otpcd = Joi.string();
const names = Joi.string().min(2).max(28);
const profp = Joi.string().min(2);
const keywd = Joi.string().min(2);
const amont = Joi.number();
const usrid = Joi.string().min(3);
const crdid = Joi.string().min(3);

const nrmst = Joi.string();

module.exports = {
    phone, cntry, otpcd, names, profp,
    keywd, amont, usrid, crdid, nrmst
};