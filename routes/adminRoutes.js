const express = require('express');
const { checkProperty, login } = require('../utils/general.js');
const { checkAdmin, checkSchema } = require('../utils/admin.js');
const { addMenuItem, getMenu } = require('../menu/menu.js');
const router = express.Router();

// Logga in
router.post('/login', checkProperty('username'), checkProperty('password'), checkProperty('role'), checkAdmin, async (req, res) => {
    const currentUser = req.body;
    let status = {
        success: true,
        message: 'Login ok.'
    }
    status = await login(currentUser, status);
    // Lagra token för att visa i res.send
    status.token = res.locals.token;

    return res.json(status);
});

// Lägga till produkt
router.post('/addProduct', checkSchema, async (req, res) => {
    const newProduct = res.locals.newProduct;
    const existingProducts = await getMenu();

    // Kolla om produkten redan finns
    if (existingProducts.some(item => item.id === newProduct.id)) {
        return res.status(400).json({ message: 'Product already exists.'})
    } else {
        addMenuItem(newProduct);
        return res.status(401).json({ message: 'Product added.', product: newProduct });
    }
});

module.exports = router;