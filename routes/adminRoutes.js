const express = require('express');
const { checkProperty, login } = require('../utils/general.js');
const { checkAdmin, checkSchema } = require('../utils/admin.js')
const router = express.Router();

// Logga in
router.post('/login', checkProperty('username'), checkProperty('password'), checkProperty('role'), checkAdmin, async (req, res) => {
    const currentUser = req.body;
    let status = {
        success: true,
        message: 'Login ok.'
    }
    status = await login(currentUser, status);
    status.token = res.locals.token;

    return res.send(status);
});

// Lägga till produkt
router.post('/addProduct', checkSchema, (req, res) => {
    res.send(req.body);
});

module.exports = router;