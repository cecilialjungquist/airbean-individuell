const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getMenu } = require('../utils/menuDB.js');
const { checkProperty, orderValidation } = require('../middleware/dataValidation.js');
const { plannedDelivery, isDelivered, checkDelivery } = require('../utils/delivery.js');
const { updateUserOrders, findUsers } = require('../utils/usersDB.js');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const menu = await getMenu();
        return res.json(menu);
    } catch (error) {
        return res.status(500).json({ message: 'Server error.' })
    }
});

// Skicka order
router.post('/order', checkProperty('userID'), checkProperty('order'), orderValidation, async (req, res) => {
    const userID = req.body.userID;
    const date = new Date().toLocaleString();
    const newOrder = {
        orderNumber: uuidv4(),
        timeOfOrder: date,
        delivery: plannedDelivery(),
        order: req.body.order,
        totalPrice: res.locals.totalPrice
    }

    const [ user ] = await findUsers('_id', userID);

    if (user) {
        if (req.body.order.length > 0) {
            updateUserOrders(userID, newOrder);
            return res.json({
                success: true,
                newOrder: newOrder
            });
        } else {
            return res.status(400).json({ 
                success: false,
                message: 'Cannot place an empty order.'});
        }
    } else {
        return res.status(404).json({ 
            success: false,
            message: 'User not found.'
        });
    }

});

// Hämta status för order
router.get('/order/status', checkProperty('userID'), checkProperty('orderNumber'), async (req, res) => {
    const userID = req.body.userID;
    const orderNumber = req.body.orderNumber;
    const [ user ] = await findUsers('_id', userID);
    let status = { message: 'No orders.' };

    // Kolla om user och user.orders finns
    if (user && user.orders) {
        const found = user.orders.some(order => {
            if (order.orderNumber === orderNumber) {
                status.delivered = isDelivered(order);
                status.message = 'Order has been delivered.';
        
                if (!status.delivered) {
                    const minutes = checkDelivery(order);
                    status.message = `Will be delivered in ${minutes} min.`;
                }
                return true;
            }
            return false;
        });
        
        if (!found) {
            status.message = 'The ordernumber does not exists.';
        }
        
    } else {
        status.message = 'This user does not exists.';
    }
    
    return res.json(status);
});

module.exports = router;