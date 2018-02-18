import { logger } from '../utils/logger';
import { cardByName, createCard } from '../services/cardServices';
import { issueIdentity } from '../services/identityServices';


const getCardInfo = async(req, res, next)=> {
    try{
      let response = await cardByName(req.body.card, req.body.network);
      logger.info(response);
      res.status(200).send({"message": "success", "data" : response});
    }catch (err) {
      logger.error(err);
      res.status(500).send({"message": "failure", "data" : err.message});
    }     
};

// const createNewCard = async(req, res, next)=> {
//   try{
//     let identity = await issueIdentity(req.body.email, req.body.userId);
//     let response = await createCard(identity, "Doctor", "my-network");
//     logger.info(response);
//     res.status(200).send({"message": "success", "data" : "Card Created"});
//   }catch (err) {
//     logger.error(err);
//     res.status(500).send({"message": "failure", "data" : err.message});
//   }     
// };

module.exports = function (router) {

      router.post('/cardinfo',
        (req, res, next) => {
          next();
        },
        getCardInfo
      ); 

      // router.post('/createCard',
      //   (req, res, next) => {
      //     next();
      //   },
      //   createNewCard
      // ); 
};