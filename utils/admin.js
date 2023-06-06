const jwt = require('jsonwebtoken');
const { findUsers } = require('../users/users.js');

function verifyAdmin(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'No authorization header found.' });
    }

    const token = req.headers.authorization.replace('Bearer ', '');
    try {
        const data = jwt.verify(token, '1234');
        console.log(data);
        next();
    } catch (error) {
        res.send(401).json({ error: error, message: 'Not authorized, invalid token.'});
    }
}

// Kollar om användare är admin och adderar JWT
async function addJWT(req, res, next) {
    if (req.body.role === 'admin') {
        const admins = await findUsers('role', 'admin');
        let isAdmin = false;

        admins.map(admin => {
            if (admin.username === req.body.username) {
                isAdmin = true;
                // Applicera jwt
                res.locals.token = jwt.sign({ id: admin._id }, '1234', {
                    expiresIn: "2h"
                });
            }
        });
        isAdmin ? next() : res.status(400).json({ success: false, message: 'This user does not have access to admin.'})

    } else {
        return res.status(400).json({ success: false, message: 'Not valid role data.' })
    }
}

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

module.exports = {
    verifyAdmin,
    addJWT,
    checkSchema
}