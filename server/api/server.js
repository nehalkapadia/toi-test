// Require Packages
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
require('./auth/passport-config');

// database connection
require('../config/db.config');
const db = require('./models');

// get cronjobs
const { scheduleDeleteOrderCronJob } = require('./cronjobs/order_delete');
const salesForceFailedSyncUpOrders = require("./cronjobs/salesForceFa iledSyncUpOrders");

// db.sequelize.sync();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Apply cors
app.use(cors());

app.use(morgan('combined'));

app.use(
  require('express-session')({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

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
