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
    // Lagra token för att visa i res
    status.token = res.locals.token;

    return res.send(status);
});

// Lägga till produkt
router.post('/addProduct', checkSchema, (req, res) => {
    const newProduct = res.locals.newProduct;
    return res.send(newProduct);
});

module.exports = router;