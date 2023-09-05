require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    jwt.verify(token, secretKey, { algorithms: ['HS256'] }, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      req.user = decoded; // Make the user information available to the route handlers
      next();
    });
   
  };

module.exports= {
    verifyToken
}