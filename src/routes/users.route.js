const router = require('express').Router();
const bcrypt = require("bcrypt");
const knex = require("../utils/knex.utils");
const {
    UsersCreateSchema,
    UsersRetrieveSchema,
    UsersSearchSchema,
    UsersUpdateSchema
} = require("../utils/joi.utils");

const mapIdentifier = {
    user_id: "id",
    phoneNo: "phone_no",
    profilePicture: "profile_picture",
    name: "name"
};

router.post("/create", async (req, res) => {
    try {
        await UsersCreateSchema.validateAsync(req.body);
        const salt = await bcrypt.genSalt(+process.env.SALT);
        req.body.otp = await bcrypt.hash(req.body.otp, salt);
    } catch (err) {
        console.log(err);
        return res.status((err.isJoi && 400) || 500).json(err);
    }
    const {
        phoneNo,
        country,
        otp,
        name,
        profilePicture
    } = req.body;

    try {
        const result = await knex("users").insert({
            phone_no: phoneNo,
            country,
            otp,
            name,
            profile_picture: profilePicture
        }).returning('*');
        const { otp: nq, ...userData } = result[0];
        return res.status(200).json(userData);
    } catch (err) {
        console.log(err);
        return res.status(500).json((err.detail && {error: err.detail}) || {error: true});
    }

});

router.post("/retrieve", async (req, res) => {
    try {
        await UsersRetrieveSchema.validateAsync(req.body);
        const { identifier, value } = req.body;
        const column = mapIdentifier[identifier];
        
        const rows = await knex.select('*').from('users').where({ [column]: value});
        const rowCount = rows.length;
        
        if (!rowCount) return res.status(400).json("No user");
        const { otp, ...user } = rows[0]
        return res.status(200).json(user);
    } catch (err) {
        return res.status((err.isJoi && 400) || 500).json(err);
    }
});

router.get("/search/:keyword", async (req, res) => {
    try {
        await UsersSearchSchema.validateAsync(req.params);
        const { keyword } = req.params;
    
        const rows = await knex.select().from('users')
            .where('name', 'ILIKE', `%${keyword.toLowerCase()}%`)
            .orWhere('phone_no', 'ILIKE', `%${keyword.toLowerCase()}%`);
        
        return res.status(200).json(rows);
    } catch (err) {
        return res.status((err.isJoi && 400) || 500).json(err);
    }
});

router.put("/update/:id", async (req, res) => {
    if (req.params.id != req.userId)
        return res.status(400).json("Request failed");
    try {
        await UsersUpdateSchema.validateAsync(req.body);
        const identifierAndValue = Object.entries(req.body).map(
            pair => [mapIdentifier[pair[0]], pair[1]]
        );
        const params = {};
        for (let val of identifierAndValue)
            params[val[0]] = val[1];
        await knex("users").where({ id: req.params.id}).update(params);
        return res.status(200).send("Account updated");
    } catch (err) {
        return res.status((err.isJoi && 400) || 500).json(err);
    }
});

module.exports = router;