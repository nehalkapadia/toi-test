const crypto = require('crypto');

exports.generateUniqueId = (length = 8) => {
  const randomBytes = crypto.randomBytes(Math.ceil(length * 3 / 4));
  const id = randomBytes.toString('base64').slice(0, length);
  return id.replace(/\+/g, '0').replace(/\//g, '0');
}