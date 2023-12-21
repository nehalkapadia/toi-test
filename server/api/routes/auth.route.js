// Require packages
const express = require('express');
const router = express.Router();
const passport = require('passport');

// Require controllers
const authController = require('../controllers/auth.controller');

// Require validators
const { verifyToken } = require('../middlewares/auth.middleware');

// Facebook login route
router.get('/facebook', authController.facebookLogin);

// Callback route after Facebook authentication
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  authController.loginCallback
);


// Google login route
router.get('/google', authController.googleLogin);

// Callback route after Google authentication
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.loginCallback
);


// Microsoft login route
router.get('/microsoft', authController.microsoftLogin);

// Callback route after Microsoft authentication
router.get(
  '/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: '/login' }),
  authController.loginCallback
);

// Get profile
router.get('/profile', verifyToken, authController.getProfile);

module.exports = router;

