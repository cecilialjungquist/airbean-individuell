const jwt = require('jsonwebtoken');
const { findUsers } = require('../users/users.js');

// Kollar om användare är admin
async function checkAdmin(req, res, next) {
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
    const newObject = {
        id: req.body.id,
        title: req.body.title,
        desc: req.body.desc,
        price: req.body.price,
    }
    if (req.body.id && req.body.title && req.body.desc && req.body.price) {
        // Kolla om det är rätt datatyp?
        next();
    } else {
        return res.status(400).json({ message: 'Missing data.'})
    }

    
}

module.exports = {
    checkAdmin,
    checkSchema
}