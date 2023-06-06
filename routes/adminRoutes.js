const express = require('express');
const { checkProperty, login } = require('../utils/general.js');
const { addJWTAdmin, checkSchema, verifyAdmin } = require('../utils/admin.js');
const { addMenuItem, getMenu, findMenuItem, deleteMenuItem, updateMenuItem } = require('../utils/menuDB.js');
const router = express.Router();

// Logga in
router.post('/login', checkProperty('username'), checkProperty('password'), checkProperty('role'), addJWTAdmin, async (req, res) => {
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
router.post('/addProduct', checkSchema, verifyAdmin, async (req, res) => {
    const newProduct = res.locals.newProduct;
    const existingProducts = await getMenu();

    // Kolla om produkten redan finns
    if (existingProducts.some(item => item.id === newProduct.id)) {
        return res.status(400).json({ message: 'Product already exists.' })
    } else {
        newProduct.createdAt = new Date().toLocaleString();
        addMenuItem(newProduct);
        return res.status(201).json({ message: 'Product added.', product: newProduct });
    }
});

// Ta bort produkt
router.delete('/deleteProduct', checkProperty('id'), verifyAdmin, async (req, res) => {
    const id = req.body.id;
    const menuItem = await findMenuItem(id);

    if (menuItem) {
        deleteMenuItem(id);
        return res.json({ message: 'Product deleted.', product: menuItem })
    } else {
        return res.status(404).json({ message: 'This product cannot be deleted because it does not exist in the database.' })
    }
});

// Uppdatera produkt
router.put('/updateProduct', checkProperty('id'), checkProperty('update'), verifyAdmin, async (req, res) => {
    const id = req.body.id;
    const update = req.body.update;
    const menuItem = await findMenuItem(id);

    if (menuItem) {
        // Loopar alla keys i update
        Object.keys(update).forEach(key => {
            // Om menuItem har rätt key, uppdatera keyn
            if (menuItem.hasOwnProperty(key)) {
                menuItem[key] = update[key];
            }
        });
        menuItem.modifiedAt = new Date().toLocaleString();
        updateMenuItem(menuItem);

        return res.json({ message: 'Product updated.', product: menuItem });
    } else {
        return res.status(404).json({ message: 'This product cannot be modified because it does not exist in the database.'})
    }

});

module.exports = router;