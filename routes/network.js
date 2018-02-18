import { logger } from '../utils/logger';
import { networkInfo, cardstore } from '../services/networkServices';

const getNetworkInfo = async (req, res, next)=> {
      try{
        let response = await networkInfo();
        logger.info(response);
        res.status(200).send({"message": "success", "data" : response});
      }catch (err) {
        logger.error(err);
        res.status(500).send({"message": "failure", "data" : err.message});
      }  
};

module.exports = function (router) {
    
      router.get('/networkinfo',
        (req, res, next) => {
          next();
        },
        getNetworkInfo
      );
 
};