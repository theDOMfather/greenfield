// jshint esversion: 6

// configure server
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8000;
var app = express();
var moment = require('moment');

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

// twilio routes
app.get('/messageToConsole', function(req, res) {
  var shortPhone = req.query.From.substring(2);

  //figure out phone number of request
  User.find({
    phoneNumber: shortPhone // finds the user in the db
  }, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      var daysSinceGoalCreation = Math.round((Date.now() - user[0].goalStartDate) / (10 * 60 * 1000)); // sets index

      var message = req.query.Body;
      if (message === '1') {
        message = 'ok, I guess...';
      } else if (message === '2') {
        message = 'you blew it';
      }
      user[0].responses[daysSinceGoalCreation] = [Date.now(), message]; // made changes to response array

      User.findOne({
        phoneNumber: shortPhone
      }, function(err, doc) {
        doc.responses = user[0].responses;
        doc.save();
      });
    }
  });

  twilioService.responseMaker(req, res);

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
      var daysSinceGoalCreation = Math.round((Date.now() - user.goalStartDate) / (10 * 60 * 1100)); // sets index modified to be slightly faster
      user.responses[daysSinceGoalCreation] = [Date.now(), 'fail.']; // made changes to response array
      console.log('days since goal creation', daysSinceGoalCreation);
      console.log('user.responses', user.responses);
      user.save();

  });




    // celebrate completion
    console.log('spammed the shit out of \'em');
  });
};


/*======================================
=======classifying USER HERE ===========
=======================================*/
  //1 is yes, 2 is no
  //sample array of responses

//   exports.gradeUser = function() {
//   // query database for all users
//   User.find((err, users) => {
//     // iterate through and apply periodic goal poll
//     users.forEach(user => {
//
//       if(user.responses.length <1) {
//         //do nothing
//       } else{
//         //read responses for user
//         //store the length of array in a variable (give length of attempt at goal)
//
//         var denominator = user.responses.length;
//         var count1 =0;
//         user.responses.forEach(function(tuple) {
//           if(tuple[1] === 1) {
//             count1++;
//           }
//         });
//         var newGrade = count1/denominator*100;
//         user.newGrade =newGrade;
//         user.save();
//       }
//     });
//     //update cron job
//   });
//   //add logic for send periodic messages to populate a tuple with the current date and null/undefined
// };


// start server
app.listen(port);
console.log('Listening on port ' + port + '...');
