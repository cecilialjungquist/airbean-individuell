const { findUsers } = require('./usersDB.js');
const { genSaltSync, hashSync } = require('bcryptjs');

// const salt = genSaltSync();
const salt = '$2a$10$W.aOVuY/hr48dEIgGsAjDO';

function hashedPassword(password) {
    const hash = hashSync(password, salt);
    return hash;
}


// Logga in
async function login(currentUser, status) {
    const [user] = await findUsers('username', currentUser.username);
    if (user) {
        const hash = hashSync(currentUser.password, salt);
        if (hash !== user.hashedPassword) {
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
    hashedPassword,
    login
}