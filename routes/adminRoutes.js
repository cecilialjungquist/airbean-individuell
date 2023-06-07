const express = require('express');
const { checkSchema, checkProperty } = require('../middleware/dataValidation.js');
const { login } = require('../utils/account.js');
const { addJWTAdmin, verifyAdmin } = require('../middleware/admin.js');
const { addMenuItem, getMenu, findMenuItem, deleteMenuItem, updateMenuItem } = require('../utils/menuDB.js');
const router = express.Router();

router.post('/login', checkProperty('username'), checkProperty('password'), checkProperty('role'), addJWTAdmin, async (req, res) => {
    // BODY: { username, password, role }
    // TODO: Logga in och returnera token.

    const currentUser = req.body;
    let status = {
        success: true,
        message: 'Login ok.'
    }
    status = await login(currentUser, status);
    status.token = res.locals.token;

    return res.json(status);
});

router.post('/addProduct', checkSchema, verifyAdmin, async (req, res) => {
    // BODY: { id, title, desc, price }
    // HEADERS: Authorization, Bearer token
    // TODO: Addera ny produkt (om den inte redan finns)
    
    const newProduct = res.locals.newProduct;
    const existingProducts = await getMenu();

    // Kolla om produkten redan finns
    if (existingProducts.some(item => item.id === newProduct.id)) {
        return res.status(400).json({ success: false, message: 'Product already exists.' })
    } else {
        newProduct.createdAt = new Date().toLocaleString();
        addMenuItem(newProduct);
        return res.status(201).json({ 
            success: true, 
            message: 'Product added.', 
            product: newProduct 
        });
    }
});

router.delete('/deleteProduct', checkProperty('id'), verifyAdmin, async (req, res) => {
    // BODY: { id }
    // HEADERS: Authorization, Bearer token
    // TODO: Ta bort produkt (om den finns)

    const id = req.body.id;
    const menuItem = await findMenuItem(id);

    if (menuItem) {
        deleteMenuItem(id);
        return res.json({ 
            success: true,
            message: 'Product deleted.', 
            product: menuItem 
        })
    } else {
        return res.status(404).json({ 
            success: false,
            message: 'This product cannot be deleted because it does not exist in the database.' 
        })
    }
});

router.put('/updateProduct', checkProperty('id'), checkProperty('update'), verifyAdmin, async (req, res) => {
    // BODY: { id, update }
    // HEADERS: Authorization, Bearer token
    // TODO: Hämta produkt med angivet id och uppdatera egenskaper mot update-objektet i body.

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

        return res.json({ 
            success: true,
            message: 'Product updated.', 
            product: menuItem 
        });
    } else {
        return res.status(404).json({ 
            success: false,
            message: 'This product cannot be modified because it does not exist in the database.'
        })
    }

});

module.exports = router;