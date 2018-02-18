
var testAPI = (req, res, next)=>{
    console.log("Test Successful!");
    res.status(200).send({"message": "success"});  
    
}



module.exports = function (router) {
    
      router.get('/test',
        (req, res, next) => {
          next();
        },
        testAPI
      );
 
}