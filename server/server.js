// jshint esversion: 6

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
var db = mongoose.connection;
var User = require('./userModel.js');

// log every request to the console
app.use(morgan('dev'));

// configure authentication
var session = require('express-session');
var passport = require('passport');
require('./auth.js')(passport);
app.use(session({
  secret: 'squirrel',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// configure twilio
var twilioService = require('./sms/sms.js');

// configure harassment logic
var harassmentEngine = require('./sms/harassmentEngine.js');

// serve static files
app.use('/', express.static(path.join(__dirname, '../client/login')));
app.use('/app', express.static(path.join(__dirname, '../client')));
app.use('/modules', express.static(path.join(__dirname, '../node_modules')));

// parse requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// authentication routes
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  failureRedirect: "/"
}), (req, res) => {
    // passport attaches user information to all incoming requests
    if (!req.user.goal) {
      // if user has no goal, allow them to create one
      res.redirect('/app/#/create');
    } else {
      // else log user in and redirect to goal status page
      res.redirect('/app/#/status');
    }
});
app.get('/logout', (req, res) => {
  // passport attaches logout method to all requests
  req.logout();
  res.redirect('/');
});

// user info route
app.get('/user', function(req, res) {
  res.send(req.user);
});

// new user route
app.post('/create', function(req, res) {
  //console.log(req);

  User.findById(req.body._id, function(err, user) {
    console.log('user', user);
    user.goal = req.body.goal;
    user.phoneNumber = req.body.phoneNumber;
    user.buddyName = req.body.buddyName;
    user.buddyPhone = req.body.buddyPhone;
    user.responses = [];
    user.grade = 100;
    user.harassUser = false;
    user.harassBuddy = false;

    user.save((err, updatedUser) => err ? res.send(err) : res.send(updatedUser));
    twilioService.sendWelcome(user.phoneNumber);
  });
});

// goal completion routes
app.post('/finish', function(req, res) {
  console.log('finishing...');
  User.findById(req.user._id, function(err, user) {
    console.log('inside of finished function on server file...');

    twilioService.userGoalComplete(user.phoneNumber); // text user goal is complete
    twilioService.buddyGoalComplete(user.buddyPhone); // text buddy goal is complete

    user.goal = null;
    user.save((err, updatedUser) => err ? res.send(err) : res.send(updatedUser));
  });
});

// twilio routes
app.get('/messageToConsole', function(req, res) {
  var from = req.query.From.substring(2);

  //figure out phone number of request
  User.findOne({
    phoneNumber: from // finds the user in the db
  }, function(err, user) {
    if (err) {
      console.log(err);
    } else if (user && user.responses && user.responses.length) {
      // ensure that at least spam message has been sent, populated by an fail to be replaced

      // overwrite response at last entry in response array
      user.responses[user.responses.length - 1] = [Date.now(), req.query.Body];

      // update user in database and invoke grading function on user
      User.update({_id: user._id}, {responses: user.responses}, grade.call(user));
    }
  });

  // send text message response
  twilioService.responseMaker(req, res);

});

// dev testing route for manually invoking spam functions
app.post('/test', function(req, res) {
  exports.spam();
  exports.gradeUsers();
  res.send();
});

// API route for possible future development
app.post('/externaHarassmentAPI', function(req, res) {
  // console.log("received this data from harassment API", req);
  // console.log("body data", req.body);

  res.send("Piss off your friends!");
});

// spam routine
exports.spam = function() {
  console.log('hello from inside spam');
  User.find((err, users) => {
    users.forEach(user => {

      // send harassment messages
      var harassmentState = harassmentEngine.harassmentChecker(user);
      user.harassUser = harassmentState.harassUser;
      user.harassBuddy = harassmentState.harassBuddy;

      // send out goal survey
      twilioService.periodicGoalPoll(user.phoneNumber, user.goal);

      user.responses.push([Date.now(), 'new fail.']); // made changes to response array

      User.findOne({
        phoneNumber: user.phoneNumber
      }, function(err, updateUser) {
        updateUser.responses = user.responses;
        updateUser.save();
      });
    });
  });

  exports.gradeUsers();
};

// invokes grade function for all users
exports.gradeUsers = function() {
  // query database for all users
  User.find((err, users) => {
    users.forEach(grade);
  });
};

// grades users based on their response history
function grade(user) {
  if(user.responses && user.responses.length) {

    // calculate percentage of positive ('1') responses
    var progress = user.responses.reduce((acc, tuple) => tuple ? (tuple[1] === '1' ? ++acc : acc) : null, 0);
    user.grade = Math.round(progress / user.responses.length * 100);

    // update database entry
    User.update({_id: user._id}, {grade: user.grade}, err => err ? console.error(err) : null);
  }
}

// start server
app.listen(port);
console.log('Listening on port ' + port + '...');
