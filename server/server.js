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
var timestamps = require('mongoose-timestamp');
mongoose.connect('mongodb://bartek:hassle1@ds119598.mlab.com:19598/heroku_4800qm90');
var db = mongoose.connection;
var User = require('./userModel.js');
app.use(morgan('dev')); //to log every request to the console

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
var dayDefinition = require('./dayDefinition.js');
console.log("a day is defined as", dayDefinition.aDay());


var harassmentEngine = require('./sms/harassmentEngine.js');

// server static files
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
    // PASSPORT WILL ATTACH user TO ALL REQUESTS AFTER AUTHENTICATION
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
    user.goalStartDate = Date.now();
    user.harassUser = false;
    user.harassBuddy = false;
    user.grade = 100;

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
  var shortPhone = req.query.From.substring(2);

  //figure out phone number of request
  User.findOne({
    phoneNumber: shortPhone // finds the user in the db
  }, function(err, user) {
    if (err) {
      console.log(err);
    } else if (user) {
      var daysSinceGoalCreation = Math.round((Date.now() - user.goalStartDate) / ( dayDefinition.aDay() + 30000) ); // sets index and add 3 seconds for delay to avoid null
      console.log('days since goal creation', daysSinceGoalCreation);

      user.responses[daysSinceGoalCreation] = [Date.now(), req.query.Body]; // made changes to response array

      User.findOne({
        phoneNumber: shortPhone
      }, function(err, doc) {
        doc.responses = user.responses;
        doc.save();
      });
    }
  });

  twilioService.responseMaker(req, res);

});



app.post('/externaHarassmentAPI', function(req, res) {
  console.log("received this data from harassment API", req);
  console.log("boddy data", req.body);


  res.send("account creation failed");

  // build future version for harassment ability by others...

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

      //calculate days since goal start
      var daysSinceGoalCreation = Math.round((Date.now() - user.goalStartDate) / ( dayDefinition.aDay() + 30000) ); // sets index and add 3 seconds for delay to avoid null
      user.responses[daysSinceGoalCreation] = [Date.now(), 'fail.']; // made changes to response array
      console.log('days since goal creation', daysSinceGoalCreation);


      console.log('days since goal creation', daysSinceGoalCreation);
      console.log('user.responses', user.responses);

      User.findOne({
        phoneNumber: user.phoneNumber
      }, function(err, doc) {
        doc.responses = user.responses;
        doc.save();
      });
    });
  });
};


// exports.spam();

// assign grades to users based on response history
exports.gradeUsers = function() {
// query database for all users
  User.find((err, users) => {
    users.forEach(user => {
      if(user.responses && user.responses.length) {

        // calculate percentage of positive ('1') responses
        var progress = user.responses.reduce((acc, tuple) => {tuple[1] === '1' ? ++acc : acc}, 0);
        user.grade = progress / user.responses.length * 100;

        // update database entry
        user.save();
      }
    });
  });
};


// twilioService.spamCall();


// start server
app.listen(port);
console.log('Listening on port ' + port + '...');
