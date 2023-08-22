const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if(decoded){
        req.user = decoded.user;
      }
      next();
    } catch (err) {
      res.status(401);
      throw new Error('User is not authorized');
    }
  } else {
    res.status(401);
    throw new Error('No token found, user is not authorized');
  }
});

module.exports = validateToken;
