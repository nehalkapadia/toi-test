// passport-config.js
require('dotenv').config();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;

// Configure Passport with Facebook strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `${process.env.BASE_URL}/api/auth/facebook/callback`,
  profileFields: ['id', 'displayName', 'email'], // Include 'email' in profileFields
}, (accessToken, refreshToken, profile, done) => {
  // Handle user authentication logic for Facebook (saving to database, creating session, etc.)
  return done(null, profile); // Return the user profile
}));

// Configure Passport with Google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
}, (accessToken, refreshToken, profile, done) => {
  // Handle user authentication logic for Google (saving to database, creating session, etc.)
  return done(null, profile); // Return the user profile
}));

// Configure Passport with Microsoft strategy
passport.use(new MicrosoftStrategy({
  clientID: process.env.MICROSOFT_CLIENT_ID,
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/api/auth/microsoft/callback`,
}, (accessToken, refreshToken, profile, done) => {
  // Handle user authentication logic for Microsoft (saving to database, creating session, etc.)
  return done(null, profile); // Return the user profile
}));

passport.serializeUser((user, done) => {
  // Serialize user object into the session
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // Deserialize user from the session
  done(null, user);
});

module.exports = passport;
