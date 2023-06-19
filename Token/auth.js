const jwt = require('jsonwebtoken');
const { constants } = require('../constants');

const authenticateToken = (req,res, next)=>{
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if(authHeader && authHeader.startsWith('Bearer')){
    token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
      if (err){
        res.status (constants.UNAUTHORIZED);
        return res.json({ error: 'User is not authorized' });
      }
      req.user = decoded.user;
      next();
    });
    if (!token){
      res.status(constants.UNAUTHORIZED);
      return res.json({ error: 'User is not authorized or token is missing' });
    }
  }
};

module.exports = authenticateToken;
  