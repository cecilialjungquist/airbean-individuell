const express = require('express');
const { findUsers, createUser } = require('../utils/usersDB.js');
const { checkProperty, login } = require('../utils/general.js');
const router = express.Router();

// Skapa konto
router.post('/signup', checkProperty('username'), checkProperty('password'), async (req, res) => {
    const newUser = {
        username: req.body.username,
        password: req.body.password,
        role: 'user',
        orders: []
    }
    let responseObj = {
        success: true,
        message: 'Signup ok.'
    }

    const users = await findUsers();

    users.forEach(user => {
        if (user.username === newUser.username) {
            responseObj.success = false;
            responseObj.message = 'User already exists.'
        }
    });

    if (responseObj.success) {
        createUser(newUser);
    }

    return res.json(responseObj);
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
    const responseObj = {
        message: 'Previous orders',
    }

    if (user) {
        responseObj.orders = user.orders;
        return res.json(responseObj);
    } else {
        responseObj.message = 'Invalid userID.'
        return res.status(400).json(responseObj);
    }

});


module.exports = router;