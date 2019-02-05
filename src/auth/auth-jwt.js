const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

function jwtAuth(req, res, next) {
  const auth = req.header('Authorization');
  const secret = JWT_SECRET;

  if (!auth) {
    return res.status(401).json({
      error: { message: "No 'Authorization' header found" }
    });
  }

  const scheme = auth.split(' ')[0]; // "Bearer"
  const token = auth.split(' ')[1]; // "token"

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      error: { message: "No 'Bearer' token found" }
    });
  }

  let payload;
  try {
    payload = jwt.verify(token, secret);
    req.user = payload.user;
    next();
  } catch (error) {
    res.status(401).json({ error: { message: 'Not Authorized' } });
  }

}

module.exports = jwtAuth;
