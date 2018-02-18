import { logger } from '../utils/logger';
let config = require('config').get('development');

export const networkInfo = async () => {
    const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
    const bizNetworkConnection = new BusinessNetworkConnection();
    const cardName = config.get('cardName');
    try{
        let result = await bizNetworkConnection.connect(cardName);
        const businessNetworkDefinition = result;
        let networkinfo = {};
        networkinfo.identifier = businessNetworkDefinition.getIdentifier();
        networkinfo.Description = businessNetworkDefinition.getDescription();
        networkinfo.name = businessNetworkDefinition.getName();
        //networkinfo.metadata = businessNetworkDefinition.getMetadata();
        return networkinfo;
    }catch (err) {
        logger.error(err)
        throw err;
    }    
    
};



