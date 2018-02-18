import { logger } from '../utils/logger';
import { createCard, getBusinessInfoByImportedCard } from '../services/cardServices';
import { issueIdentity } from '../services/identityServices';
import { signup } from '../services/registerServices';
import { login } from '../services/loginServices';
import { isNullOrUndefined } from 'util';

const register = async(req, res, next)=> {
  let participantObj = req.body;
  
  //check if role based parameters are provided

  if(req.body.role == 'Doctor'){
    
    if(isNullOrUndefined(req.body.department) || isNullOrUndefined(req.body.salary))
      return res.status(500).send({"message": "failure", "data" : "insufficient parameters"});
    
    participantObj.lastvisit = "NA";
    participantObj.balanceDue = "NA";
  } else if(req.body.role == 'Patient'){

    if(isNullOrUndefined(req.body.lastvisit) || isNullOrUndefined(req.body.balanceDue))
      return res.status(500).send({"message": "failure", "data" : "insufficient parameters"});
    
    participantObj.department = "NA";
    participantObj.salary = "NA";
  }

  try{
    participantObj.participantId = participantObj.email.split("@")[0] + Date.now();
    let identity = await issueIdentity(participantObj);
    participantObj.enrollSecret = identity.userSecret;
    let response = await createCard(identity, participantObj.role, participantObj.networkName);
    if(response){
      let result = await signup(participantObj);
      res.status(200).send(result);
    }
  }catch (err) {
    logger.error(err);
    res.status(500).send({"message": "failure", "data" : err.message});
  }     
};


const userLogin = async (req, res, next) => {
  try{
    var userData = await login(req.body.email, req.body.password);
    if(userData.status == "success"){
      var businessInfo = await getBusinessInfoByImportedCard (userData.participantId, userData.enrollSecret, userData.role, userData.networkName); 
      let result = {};
      result.name = userData.name;
      result.role = userData.role;
      result.networkName = businessInfo.getName();
      result.Description = businessInfo.getDescription();     
      
      res.status(200).send({"message": "success", "data" : result});
    }else
      res.status(500).send(userData);
  }catch(err){
    logger.error(err);
    res.status(500).send({"message": "failure", "data" : err.message});
  }
}

module.exports = function (router) {

      router.post('/signup',
        (req, res, next) => {
          next();
        },
        register
      ); 
      
      router.post('/login',
        (req, res, next) => {
          next();
        },
        userLogin
      );
};