const express = require('express');
const { findUsers, createUser } = require('../utils/usersDB.js');
const { checkProperty } = require('../middleware/dataValidation.js');
const { login } = require('../utils/general.js');
const router = express.Router();

// Skapa konto
router.post('/signup', checkProperty('username'), checkProperty('password'), async (req, res) => {
    const newUser = {
        username: req.body.username,
        password: req.body.password,
        role: 'user',
        orders: []
    }
    let status = {
        success: true,
        message: 'Signup ok.'
    }

    const users = await findUsers();

    users.forEach(user => {
        if (user.username === newUser.username) {
            status.success = false;
            status.message = 'User already exists.';
        }
    });

    if (status.success) {
        createUser(newUser);
    }

    return res.json(status);
});

// Logga in
router.post('/login', checkProperty('username'), checkProperty('password'), async (req, res) => {
    const currentUser = req.body;
    let status = {
        success: true,
        message: 'Login ok.'
    }

    status = await login(currentUser, status);

    return res.json(status);
});

// Hämta orderhistorik
router.get('/history', checkProperty('userID'), async (req, res) => {
    const userID = req.body.userID;
    const [ user ] = await findUsers('_id', userID);
    const status = {
        message: 'Previous orders',
    }

    if (user) {
        status.orders = user.orders;
        return res.json(status);
    } else {
        status.message = 'Invalid userID.'
        return res.status(400).json(status);
    }

});


module.exports = router;