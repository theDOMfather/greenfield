// configure server
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8000;
var app = express();

// configure database
var morgan = require('morgan');
var mongoose = require('mongoose');
//timestamps
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
      res.redirect('/app/#/status')
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
  User.findById(req.body._id, function(err, user) {
    user.goal = req.body.goal;
    user.phoneNumber = req.body.phoneNumber;
    user.buddyName = req.body.buddyName;
    user.buddyPhone = req.body.buddyPhone;
    user.responses = [];
    user.goalStartDate = Date.now();
    user.save((err, updatedUser) => err ? res.send(err) : res.send(updatedUser));
    twilioService.sendWelcome(user.phoneNumber);
  });
});

// twilio routes
app.get('/messageToConsole', function(req, res) {
  console.log('user phone numberrrrr', req.query.From);

  var shortPhone = req.query.From.substring(2);

  //figure out phone number of request
  User.find({
    phoneNumber: shortPhone // finds the user in the db
  }, function(err, user) {
    console.log("user", user);
    if (err) {
      console.log(err);
    } else {
      var daysSinceGoalCreation = Math.round((Date.now() - user[0].goalStartDate) / (24 * 60 * 60 * 1000)); // sets index
      user[0].responses[daysSinceGoalCreation] = [Date.now(), req.query.Body]; // made changes to response array
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

// twilio routes
app.get('/messageToConsole', function(req, res) {
  twilioService.responseMaker(req, res);
});


// spam routine
exports.spam = function() {
  // query database for all users
  User.find((err, users) => {
    // iterate through and apply periodic goal poll
    users.forEach(user => {
      // if it's their last day, drop their ass
      twilio.periodicGoalPoll(user.phoneNumber, user.goal);
      var daysSinceGoalCreation = Math.round((Date.now() - user[0].goalStartDate) / (24 * 60 * 60 * 1000)); // sets index
      user.responses[daysSinceGoalCreation] = [Date.now(), 'fail.']; // made changes to response array

    });
    // celebrate completion
    console.log('spammed the shit out of \'em');
  });
};


//1 is yes, 2 is no


/*======================================
=======classifying USER HERE ===========
=======================================*/
  //1 is yes, 2 is no
  //sample array of responses
  var array2 = [1, 2, 2, undefined, undefined, 2, 2, 1, 2, 1 , 1, 1, 2, 2, 2, 2, 1, 1, 1];



  //days of attempts at goal from database (current date - start date)


//***export this later***
app.get('/test', function(req, res) {
  // console.log(req.body);
  //var shortPhone = req.query.From.substring(2);
  
  var gradeUser = function(array) {
    //var days = 5; //days of attempts at goal hard coded for now
    
    User.findOne({
      phoneNumber: '1-800-THINGS2'
    }, 'goalStartDate', function(err, startDate) {
      if (err) console.error('error on reqeust' , err);
      console.log("start date ", startDate);
      
      // console.log(queryResult);
      var days = (Date.now() - startDate) / (1000 * 60 * 60 * 24)
      //grab shortened array
      var daysOnGoal = array.slice(0, days).sort();
      console.log( "sorted responses:  ", daysOnGoal );

      // loop through our daysOnGoal array and count up the 2's
      var count = 0;
      for ( var i = 0; i < daysOnGoal.length; i++ ) {
        if( daysOnGoal[i] === 2  || daysOnGoal[i] === null ) {
          count = count += 1;
        }
        var count = count;
      }
      //calculate the percentage grade/days
      var percentage = (count / days) * 100;
      console.log(percentage);
      //if( percentage < 30) {
          //use array A, use harrasment frequency A
        //}
        //else if (percentage > 30 && percentage < 60 ) {
        //   use array B
        // }
        // else if (percentage > 60) {
        //   use array C
        // }
      res.send()
    })
  };
  //console.log("count outside the for loop: ", count);

  gradeUser(array2);
})







// start server
app.listen(port);
console.log('Listening on port ' + port + '...');


