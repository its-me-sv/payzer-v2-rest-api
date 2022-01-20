const router = require("express").Router();
const knex = require("../utils/knex.utils");

router.get("/api", (req, res) => {
    return res.status(200).json("API - Check SUCCESS");
});

router.get("/db", async (req, res) => {
    try {
        if (knex)
            return res.status(200).json("DB - Check SUCCESS");
    } catch (err) {
        console.log(err);
        return res.status(500).json("DB - Check FAIL");
    }
});

module.exports = router;