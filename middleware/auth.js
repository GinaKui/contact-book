const jwt = require('jsonwebtoken');
const config = require('config');

const jwtSecret = process.env.JWT_SECRET || config.get('jwtSecret');

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if token dose NOT exist
  if (!token) {
    return res.status(401).json({ msg: "Token doesn't exist, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid token, authorization denied' });
  }
};
