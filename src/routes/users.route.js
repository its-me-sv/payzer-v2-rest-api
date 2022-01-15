const router = require('express').Router();
const db = require('../configs/postgres.config');

// Fetch all users
router.get(`/all`, async (req, res) => {
    const result = await db.query('SELECT * FROM users;');
    console.log(result);
    return res.status(200).json("These are all the users");
});

module.exports = router;