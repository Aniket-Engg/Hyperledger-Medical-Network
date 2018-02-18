const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
const FileSystemCardStore = require('composer-common').FileSystemCardStore;
const BusinessNetworkCardStore = require('composer-common').BusinessNetworkCardStore;
const IdCard = require('composer-common').IdCard;
const path = require('path');
let config = require('config').get('development');
import { logger } from '../utils/logger';

const adminCard = config.get('cardName');
const fileSystemCardStore = new FileSystemCardStore();
const businessNetworkConnection = new BusinessNetworkConnection();
const adminConnection = new AdminConnection();
const businessNetworkCardStore = new BusinessNetworkCardStore();


export const cardByName = async (cardname, network) =>{    
    return fileSystemCardStore.get(cardname + "@" + network);
}                

export const createCard = async (identity, role, networkName) => {
    let connectionProfile = config.get('connectionProfile');
    let hlfVersion = config.get('hlfVersion');
    connectionProfile.name = role;

    const metadata = {
        userName: identity.userID,
        version: hlfVersion,
        enrollmentSecret: identity.userSecret,
        businessNetwork: networkName
    };

    const idCardData = new IdCard(metadata, connectionProfile);
    const idCardName = BusinessNetworkCardStore.getDefaultCardName(idCardData);
    try{
        await fileSystemCardStore.put(idCardName, idCardData);
        logger.info("card with cardname " + idCardName + " stored successfully");
        return "true";
    }catch (err) {
        logger.error("Error in createCard" + err);
        throw err;
    }
    
};


export var getBusinessInfoByImportedCard = async (userID, enrollSecret, role, networkName) => {
    let connectionProfile = config.get('connectionProfile');
    let hlfVersion = config.get('hlfVersion');
    connectionProfile.name = role;

    const metadata = {
        userName: userID,
        version: hlfVersion,
        enrollmentSecret: enrollSecret,
        businessNetwork: networkName
    };

    const idCardData = new IdCard(metadata, connectionProfile);
    const idCardName = BusinessNetworkCardStore.getDefaultCardName(idCardData);
    try{
        const imported = await adminConnection.importCard(idCardName, idCardData);
        if (imported) {
            let businessNetworkDefinition = await businessNetworkConnection.connect(idCardName);
            if (!businessNetworkDefinition) {
                    logger.error("Error in network connection");
                    throw "Error in network connection";
                } 
            return businessNetworkDefinition;
        } else {
                console.log('null');
                throw "Error in importing card";
        }
    }catch(error){
        logger.error(error);
        throw error;
    }
};