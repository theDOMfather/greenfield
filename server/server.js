// configure server
var path = require ('path');
var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8000;
var app = express();

// configure database
var morgan = require('morgan');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hassle');
app.use(morgan('dev')); // log requests to the console

// configure authentication
var session = require('express-session');
var passport = require('passport');
require('./auth.js')(passport);
app.use(session({ secret: 'squirrel' }));
app.use(passport.initialize());
app.use(passport.session());

// serve static files on client
app.use('/', express.static(path.join(__dirname, '../client')));
app.use('/fail', express.static(path.join(__dirname, '../client/assets/doNotWant.jpg')));
app.use('/modules', express.static(path.join(__dirname, '../node_modules')));

// parse requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// authentication routes
app.get('/auth/facebook', passport.authenticate('facebook', {
  scope : 'email' }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect : '/',
  failureRedirect : '/fail'
}));

// start server
app.listen(port);
console.log('Listening on port ' + port + '...');
