const Config = require('../config/config');

module.exports = function() {
  if (!Config.JWT_KEY) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }
}