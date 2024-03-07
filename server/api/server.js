// Require Packages
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
require('./auth/passport-config');

// database connection
require('../config/db.config');
const db = require('./models');

// get cronjobs
const { scheduleDeleteOrderCronJob } = require('./cronjobs/order_delete');
const salesForceFailedSyncUpOrders = require("./cronjobs/salesForceFailedSyncUpOrders");

// db.sequelize.sync();

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// Here add this limit to upload the file for the testing an api.
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Apply cors
app.use(cors());

app.use(morgan('combined'));

app.use(cookieSession(
  {
    // Cookie Options
    maxAge: 30 * 24 * 60 * 60 * 1000,  // 24 hours
    keys: [process.env.SESSION_SECRET],
  }
))

// register regenerate & save after the cookieSession middleware initialization
app.use(function(request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb) => {
      cb()
    }
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb) => {
      cb()
    }
  }
  next()
})

//Passport Initialized
app.use(passport.initialize());
//Setting Up Session
app.use(passport.session());

//start the cron jobs
salesForceFailedSyncUpOrders.start();

app.use('/uploads', express.static('uploads'));


// Logout API
app.get('/api/auth/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy();
    res.redirect('/login');
  });
});

app.get('/api/welcome', async (req, res, next) => {
  res.json({
    status: true,
    message: 'Welcome to TOI',
  });
});

// routes
require('./routes')(app);
scheduleDeleteOrderCronJob();

module.exports = app;
