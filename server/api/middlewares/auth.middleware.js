// Require Packages
let jwt = require('jsonwebtoken');

// Require utils
const constants = require('../utils/constants.util');

// Require Services
const userService = require('../services/user.service');

//for create token
exports.assignToken = async (user) => {
  let payload = {
    id: user.id,
  };
  let token = await jwt.sign(
    payload,
    process.env.JWT_SECRET ? process.env.JWT_SECRET : constants.JWT_SECRET_KEY,
    {}
  );
  return token;
};

//for check-token
exports.verifyToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(400).json({
        status: false,
        message: constants.SEND_AUTH_TOKEN,
      });
    }
    if (token) {
      let decoded = jwt.verify(
        token.split(' ')[1],
        process.env.JWT_SECRET
          ? process.env.JWT_SECRET
          : constants.JWT_SECRET_KEY
      );
      req.userData = decoded;
      if (decoded.id) {
        let user = await userService.detail(decoded.id);
        if (user) {
          req.userData.user = user;
        } else {
          return res.status(400).json({
            status: false,
            message: constants.USER_NOT_EXIST_OR_ACCESS,
          });
        }
      }
      next();
    }
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: constants.UNAUTHENTICATED,
    });
  }
};
