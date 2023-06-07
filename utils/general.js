const { findUsers } = require('./usersDB.js');

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
    login
}