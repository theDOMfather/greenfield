var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;

// load user model
var User = require('../../client/userModel');

// load API keys
var Auth = require('./keys');

module.exports = function(passport) {

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
      done(null, user.id);
  });
  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
          done(err, user);
      });
  });

  // code for login (use('local-login', new LocalStategy))
  // code for signup (use('local-signup', new LocalStategy))

  passport.use(new FacebookStrategy({
    // pull in our info from keys.js
    clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL
  },
  // facebook will send back the token and profile
  function(token, refreshToken, profile, done) {
    process.nextTick(function() {

      // find the user in our database
      User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
        if (err) {                   // if error connecting to database, throw error
          return done(err);
        } else if (user) {           // if the user is found, log them in
          return done(null, user);
        } else {                     // if no user is found with that facebook id, create them as a new user
          var newUser = new User();
          newUser.facebook.id = profile.id;
          newUser.facebook.token = token;
          newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
          newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

          // save user to the database
          newUser.save(function(err) {
              if (err) throw err;
              else return done(null, newUser);
          });
        }
      });
    });
  }));
};
