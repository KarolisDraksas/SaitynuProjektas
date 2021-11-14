const jwt = require("jsonwebtoken");
const passport = require('passport');


const config = process.env;

const verifyToken = (req, res, next) => {
  const tokenR =
    req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];

  /*const bearerToken = req.headers["Authorization"];

  if (bearerToken){
    const t = bearerToken.split[' '];
    token = t[1];
  }*/
  //console.log(req.headers["authorization"])
  if (!tokenR) {
    return res.status(403).send("A token is required for authentication");
  }
  var token = null;
  const t = tokenR.split(" ");
  if (t[0] === 'Bearer'){
    token = t[1];
  } else{
    token = t[0];
  }

  
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    
    
    req.user = decoded;
    //console.log(req.user);
    //next.body.user = decoded
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;