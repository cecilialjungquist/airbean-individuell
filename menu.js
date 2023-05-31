const fs = require('fs');
const nedb = require('nedb-promise');
const menuDB = new nedb({ filename: 'menu.db', autoload: true });
const { createDB } = require('./utils')

// createDB('menu.json', menuDB);

async function getMenu() {
    const menu = await menuDB.find({});
    return menu;
}

module.exports = {
    getMenu
}