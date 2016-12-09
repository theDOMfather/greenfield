const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');

// load user model
var User = require('./userModel.js');

// load API keys
var Keys = require('./keys.js');

module.exports = function(passport) {

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id); //save in the session 
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findOne({
      'id': id
    }, function(err, user) {
      done(err, user);   
    });
  });

  // pull in our info from keys.js
  passport.use(new FacebookStrategy({
      clientID: Keys.facebook.clientID,
      clientSecret: Keys.facebook.clientSecret,
      callbackURL: Keys.facebook.callbackURL
    },
    // facebook will send back the token and profile info
    function(token, refreshToken, profile, done) {
      process.nextTick(function() {
        User.findOne({ id: profile.id }, function(err, user) {
          if (err) {
            return done(err);
          } else if (user) {
            return done(null, user);
          } else {
            var newUser = new User();
            newUser.token = token;
            newUser.id = profile.id;
            newUser.name = profile.displayName;
            newUser.save((err) => err ? done(err) : done(null, newUser));
          }
        })
      });
    }));
};
