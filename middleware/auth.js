const jwt = require('jsonwebtoken');
const config = require('config');

const jwtSecret = process.env.JWT_SECRET || config.get('jwtSecret');

module.exports = (req, res, next) => {
  /**
   * @todo could use Authentication: Bearer <token> schema
   */
  const token = req.get('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: "Token doesn't exist, authorization denied" });
  }
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if(err) {
      return res.status(401).json({ msg: err });
    } else {
      req.user = decoded.user;
      next();
    }
  });
};
