const nedb = require('nedb-promise');
const menuDB = new nedb({ filename: 'menu.db', autoload: true });

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

function updateMenuItem(updatedMenuItem) {
    menuDB.update({ id: updatedMenuItem.id }, updatedMenuItem);
}

module.exports = {
    getMenu,
    findMenuItem,
    addMenuItem,
    deleteMenuItem,
    updateMenuItem
}