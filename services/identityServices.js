
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



export const issueIdentity = async (participantDetails) => {
    try {
        await businessNetworkConnection.connect(adminCard);
        // Get the factory for the business network.
        let factory = businessNetworkConnection.getBusinessNetwork().getFactory();
        // Create the participants, Provide unique entries only
        let participant = factory.newResource('org.acme.sample', participantDetails.role, participantDetails.email);
        participant.firstName = participantDetails.firstName;
        participant.lastName = participantDetails.lastName;
        if(participantDetails.role == "Doctor"){
            participant.department = participantDetails.department;
            participant.salary = participantDetails.salary;
        }else if (participantDetails.role == "Patient"){
            participant.lastvisit = new Date(parseInt(participantDetails.lastvisit));
            participant.balanceDue = parseInt(participantDetails.balanceDue);
        }

        let participantRegistry = await businessNetworkConnection.getParticipantRegistry('org.acme.sample.' + participantDetails.role);
        await participantRegistry.add(participant);
            
        return await businessNetworkConnection.issueIdentity('org.acme.sample.'+participantDetails.role + '#' +participantDetails.email, participantDetails.participantId);
    }catch (err) {
        logger.error("Error in issueIdentity : " + err);
        throw err;
    } 
};



