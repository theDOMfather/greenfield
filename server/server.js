// configure server
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8000;
var app = express();

// configure database
var morgan = require('morgan');
var mongoose = require('mongoose');
mongoose.connect('mongodb://bartek:hassle1@ds119598.mlab.com:19598/heroku_4800qm90');
app.use(morgan('dev')); //to log every request to the console

// configure authenticartion
var session = require('express-session');
var passport = require('passport');
require('./auth.js')(passport);
app.use(session({
  secret: 'squirrel',
  resave: false,
  saveUnintialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//twilio set up begins=====
var twilioService = require('./sms/sms.js');

//twilioService.sendWelcome(6468318760);
//twilioService.periodicGoalPoll('6468318760', "Stop eating shit like I normally do :(");
//twilioService.getAllMessages();
//twilioService.getLastResponse();

app.use('/', express.static(path.join(__dirname, '../client')));
app.use('/fail', express.static(path.join(__dirname, '../client/assets/doNotWant.jpg')));
app.use('/modules', express.static(path.join(__dirname, '../node_modules')));

// parse requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/messageToConsole', function(req, res) {
  console.log(req, res);
});

// authentication routes
app.get('/auth/facebook', passport.authenticate('facebook', {
  scope: 'email'
}));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/fail'
}));

// start server
app.listen(port);
console.log('Listening on port ' + port + '...');
