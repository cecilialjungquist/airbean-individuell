const nedb = require('nedb-promise');
const menuDB = new nedb({ filename: 'menu.db', autoload: true });
const { createDB } = require('../createDB.js');

// createDB('/menu/menu.json', menuDB);

async function getMenu() {
    const menu = await menuDB.find({});
    return menu;
}

async function findMenuItem(id) {
    return await menuDB.findOne({ id: id });
}

function addMenuItem(item) {
    menuDB.insert(item);
}

function deleteMenuItem(id) {
    menuDB.remove({ id: id });
}

module.exports = {
    getMenu,
    findMenuItem,
    addMenuItem,
    deleteMenuItem
}