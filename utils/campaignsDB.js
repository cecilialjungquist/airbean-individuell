const nedb = require('nedb-promise');
const campaignsDB = new nedb({ filename: 'campaigns.db', autoload: true });

function addCampaign(arrayOfCampaignItemsId, campaignPrice) {
    const newCampaign = {
        products: arrayOfCampaignItemsId,
        totalPrice: campaignPrice,
        createdAt: new Date().toLocaleString()
    }

    campaignsDB.insert(newCampaign);
    return newCampaign;
}

module.exports = {
    addCampaign
}