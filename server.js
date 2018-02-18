
import express from 'express';
import osprey from 'osprey'; // the RAML api engine
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const logger = require('./utils/logger').logger;
let config = require('config').get('development');


var ramlFile = config.ramlPath; // RAML file path

const ramlConfig = {
  "server": {
    "notFoundHandler": false
  },
  "disableErrorInterception": true
};

const errorChecker = (err, req, res, next) => {
  if (err) {
    let _err;
      _err = "ERROR: Validation failed. ";    
    logger.error(`Error in errorchecker `+err);
    res.status(400);
    return res.json({
      status: "failure",
      "message": _err
    });
  } else {
    return next();
  }
}

const customNotFoundHandler = (req, res, next) => {
    if (req.resourcePath) {
      return next()
    } else {
      logger.error(`The path ${req.path} is not found`);
      res.status(404);
      return res.json({
        status: "failure",
        "message": `The path ${req.path} is not found`
      });
    }
  }

initServer();


function initServer() {
  osprey.loadFile(ramlFile, ramlConfig)
    .then(function (middleware) {

      //Instantiate the app.
      const app = express();

      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({
        extended: true
      }));

      var router = osprey.Router();

      // set up all the routes found in the routes directory
      var routes = require('./routes')(router);

      // Mount the RAML middleware at our base /api/v1
      app.use(config.apiSuffix, middleware, routes);

      app.use(customNotFoundHandler);
      app.use(errorChecker);
      mongoose.connect(config.database,(err) => {       //Database Connection 
        if(err){
          logger.error(err);
        }else{
          logger.info("database successfully connected");
          var server = app.listen((process.env.PORT || config.port), () => {
            logger.info(`Server running at http://localhost:${server.address().port}${config.apiSuffix}`);
          });
        }
      });
  })
    .catch(function (e) {
      logger.error("Error: %s", e);
      process.exit(1)
    });
}
