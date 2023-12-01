const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'default_secret_key';

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
    console.log(token);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    // if (err) {
    //     console.log(err);
    //   return res.status(401).json({ error: 'Invalid token' });
    // }

    req.user_id = decoded.user_id;
    next();
  });
};

module.exports = { verifyToken };
