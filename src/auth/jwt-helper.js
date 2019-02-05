const jwt = require('jsonwebtoken');

function signToken(user, secret, expiry) {
  return jwt.sign({ user }, secret, {
    subject: user.username,
    expiresIn: expiry
  });
}

function verifyToken(token, secret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      return resolve(decoded);
    });
  });
}

module.exports = { signToken, verifyToken };
