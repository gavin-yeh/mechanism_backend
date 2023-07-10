
const jwt = require('jsonwebtoken');

function createToken(username, staffId) {
  const userInfo = {
    username: username,
    staffId: staffId,
  };

  const expiresIn = process.env.EXPIRES_IN
  const token = jwt.sign(userInfo, process.env.SECRET_KEY, { expiresIn });
  return token
}

function verify(token, callback) {
  return jwt.verify(token, process.env.SECRET_KEY, callback)
}

module.exports = {
    createToken,
    verify,
};
