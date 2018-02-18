const Participant = require('../models/participant');
const logger = require('../utils/logger').logger;

export const signup = async (participant) => {    
    let participantObj = new Participant(participant);
    try{
        await participantObj.save();
        let result = {};
        result.status = "success";
        result.message = 'signup successful ';
        result.data     = {};
        result.data.name= participantObj.firstName +' '+participantObj.lastName;
        result.data.role= participantObj.role;
        return result;
    }catch(err) {
        logger.error("Error in insertion to database : "+err);
        throw err;
    }                
        
};