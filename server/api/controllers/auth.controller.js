const passport = require('passport');
const { assignToken } = require('../middlewares/auth.middleware');
const { findByEmail, detail, findByEmailAndStatus } = require('../services/user.service');
const auditLogService = require('../services/audit_log.service');
const constantsUtils = require('../utils/constants.util'); // Import constants
const { errorResponse, successResponse } = require('../utils/response.util');
const { createUserLog } = require('../services/user_log.service');

/**
 * Handles the initiation of Facebook login authentication by using Passport.js
 * @returns Passport.js authentication for Facebook with email scope
 */
exports.facebookLogin = passport.authenticate('facebook');

/**
 * Handles the initiation of Google login authentication using Passport.js
 * @returns Passport.js authentication for Google with profile and email scope
 */
exports.googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

/**
 * Handles the initiation of Microsoft login authentication using Passport.js
 * @returns Passport.js authentication for Microsoft with 'user.read' scope
 */
exports.microsoftLogin = passport.authenticate('microsoft', {
  scope: ['user.read'],
});

/**
 * Callback route after successful authentication
 * Retrieves or creates a user from data and generates an authentication token
 * @param {*} req - The request object
 * @param {*} res - The response object
 */
exports.loginCallback = async (req, res) => {
  try {
    await auditLogService.createLog(req, 'USER', 'LOGIN');
    // Check if user authentication failed
    if (!req.user) {
      return res.redirect('/login-failed?errorMessage=' + constantsUtils.USER_AUTH_FAILED);
    }
    const email = req.user.emails[0].value;
    // Find user by email in the database
    let user = await findByEmail(email);

    // Create a new user if not found in the database
    if (!user) {
      return res.redirect('/login-failed?errorMessage=' + constantsUtils.USER_NOT_SYSTEM_EXIST);
    }

    let isUserActive = await findByEmailAndStatus(email)
    // If not found in the database with active status
    if (!isUserActive) {
      return res.redirect('/login-failed?errorMessage=' + constantsUtils.USER_NOT_ACTIVE);
    }

    // Set oauth details
    if (!user?.oauthId) {
      user.oauthId = req.user.id;
      user.oauthProvider = req.user.provider;
    }
    await user.save();

    if(user) {
      user.recordId = user.id;
      user.action = "login"
      user.createdBy = user.id;
      await createUserLog(user)
    }

    // Generate JWT token for the authenticated user
    const token = await assignToken(user); // Assuming function generates a JWT token
    req.user = user;

    // Respond with successful login message, token, userId, oauthId, and oauthProvider
    res.redirect(`/login-success?successMessage=${constantsUtils.LOGIN_SUCCESSFUL}&token=${token}&role=${user.roleId}`);
  } catch (error) {
    await auditLogService.createLog(req, 'USER', 'LOGIN', error);
    return res
      .status(constantsUtils.INTERNAL_SERVER_STATUS)
      .json({ message: constantsUtils.INTERNAL_SERVER_ERROR });
  }
};

/**
 * get profile details
 * @param {*} req - The request object
 * @param {*} res - The response object
 */
exports.getProfile = async (req, res) => {
  try {
    
    if(req?.userData) {
      const id = req?.userData?.id;
      // Find user by email in the database
      let user = await detail(id);
      if (!user) {
        return res
          .status(400)
          .json(errorResponse(constantsUtils.USER_NOT_EXIST_OR_ACCESS));
      }
      return res.json(
        successResponse(constantsUtils.LOGIN_SUCCESSFUL, user)
      );
    } else {
      return res
        .status(400)
        .json(errorResponse(constantsUtils.USER_NOT_EXIST_OR_ACCESS));
    }
  } catch (error) {
    return res
      .status(constantsUtils.INTERNAL_SERVER_STATUS)
      .json({ message: constantsUtils.INTERNAL_SERVER_ERROR });
  }
}