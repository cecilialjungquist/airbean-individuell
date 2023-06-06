const { findMenuItem } = require('./menuDB.js');
const { findUsers } = require('./usersDB.js');

function checkProperty(property) {
    return function (req, res, next) {
        if (req.body.hasOwnProperty(property)) {
            next();
        } else {
            return res.status(400).json({ success: false, error: `Must have ${property} data.` });
        }
    }
}

async function orderValidation(req, res, next) {
    let orderItems = req.body.order;
    let totalPrice = 0;

    // Hämta alla items i db
    orderItems = await Promise.all(orderItems.map(async item => {
        return await findMenuItem(item.id);
    }));

    // Summera pris om item finns, annars returnera felmeddelande
    for (const item of orderItems) {
        if (item && item.price) {
            totalPrice = totalPrice + item.price;
        } else {
            return res.status(400).json({ success: false, error: 'One or more order item does not exist.' });
        }
    }

    res.locals.totalPrice = totalPrice;
    next();
}

// Kollar hur lång tid det är kvar
function checkDelivery(order) {
    const timestamp = order.delivery;

    const milliseconds = Date.parse(timestamp) - Date.now();
    const minutes = Math.floor(milliseconds / 60000);

    return minutes;
}

// Kollar diff mellan leveranstid och nu
function isDelivered(order) {
    const diff = Date.parse(order.delivery) - Date.now();
    if (diff > 0) {
        return false;
    } else {
        return true;
    }
}

// Skapar leveranstid
function plannedDelivery() {
    const delivery = new Date(Date.now() + (20 * 60 * 1000)).toLocaleString();
    return delivery;
}

// Logga in
async function login(currentUser, status) {
    const [user] = await findUsers('username', currentUser.username);
    if (user) {
        if (currentUser.password !== user.password) {
            status.success = false;
            status.message = 'Wrong password.'
        }
    } else {
        status.success = false;
        status.message = 'Wrong username.'
    }

    return status;
}

module.exports = {
    checkProperty,
    checkDelivery,
    plannedDelivery,
    isDelivered,
    orderValidation,
    login
}