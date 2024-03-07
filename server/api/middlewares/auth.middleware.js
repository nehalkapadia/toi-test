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
    email: user.email,
    roleId: user.roleId
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

      if (decoded.id == process.env.SALESFORCE_INTEGRATION_USER_EMAIL) {
        console.log('Salesforce user authenticated successfully!');
      } else if (decoded.id) {
        let user = await userService.detail(decoded.id);
        let isEmailExist = await userService.findByEmailAndStatus(decoded.email)
        if(!isEmailExist) {
          return res.status(400).json({
            status: false,
            message: constants.USER_NOT_EXIST_OR_ACCESS,
          });
        }
        if(isEmailExist?.roleId !== decoded.roleId) {
          return res.status(400).json({
            status: false,
            message: constants.USER_ROLE_HAS_BEEN_CHANGED,
          })
        }
        if (user) {
          req.userData.user = user;
        } else {
          return res.status(400).json({
            status: false,
            message: constants.USER_NOT_EXIST_OR_ACCESS,
          });
        }
      } else {
        return res.status(400).json({
          status: false,
          message: constants.USER_NOT_EXIST_OR_ACCESS,
        });
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
