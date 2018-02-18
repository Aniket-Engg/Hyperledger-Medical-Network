const Participant = require('../models/participant');
const bcrypt = require('bcrypt-nodejs');
const logger = require('../utils/logger').logger;

const comparePassword = (password, user) => {
        return bcrypt.compareSync(password, user.password);
};

export var login = async (email, password) => {
    let result ={};

    var projection = {        
        "participantId" : true,
        "firstName"     : true,
        "lastName"      : true,
        "enrollSecret"  : true,
        "networkName"   : true,
        "email"         : true,
        "password"      : true,
        "role"          : true
      };
    try{
        var user = await Participant.findOne({"email": email} ,projection);
            
        if(!user){
                result.status = "failure";
                result.message= "user does not exist";                    
            }else{                  
                if(user){
                    var validPassword = comparePassword(password,user);
                    if(!validPassword){
                        result.status = "failure";
                        result.message= "invalid password";
                    } else{
                            result.status   = "success";
                            result.participantId   = user.participantId;
                            result.name = user.firstName +' '+ user.lastName; 
                            result.enrollSecret= user.enrollSecret;                                      
                            result.role= user.role;
                            result.networkName= user.networkName;
                            
                        }
                }
            }
        return result; 
    } catch(err) {
        logger.error("Error in insertion to database : "+err);
        throw err;
    }
};
