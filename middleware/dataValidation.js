const { findMenuItem } = require('../utils/menuDB.js');

function checkSchema(req, res, next) {
    if (req.body.id && req.body.title && req.body.desc && req.body.price) {
        const { id, title, desc, price } = req.body;

        // Kolla om det är rätt datatyp
        let checkedValues = [
            checkDatatype(id, 'string', 10),
            checkDatatype(title, 'string', 2),
            checkDatatype(desc, 'string', 10),
            checkDatatype(price, 'number', 0)
        ];

        if (checkedValues.every(value => value === true)) {
            // Lagra och skicka vidare värden till nästa funktion
            res.locals.newProduct = {
                id,
                title,
                desc,
                price,
            }

            next();
        } else {
            return res.status(400).json({ message: 'Invalid data.'})
        }
    } else {
        return res.status(400).json({ message: 'Missing data.'})
    }
}

function checkDatatype(variableToCheck, expectedDatatype, requiredMinLength) {
    if (typeof variableToCheck === expectedDatatype && variableToCheck.toString().length > requiredMinLength) {
        return true;
    } else {
        return false;
    }
}

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

module.exports = {
    checkSchema,
    checkProperty,
    orderValidation
}