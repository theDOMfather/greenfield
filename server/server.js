var http = require ('http');
var path = require ('path');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

var passport = require('passport');
require('./auth/auth.js')(passport);

var app = express();

var port = process.env.PORT || 8080;


app.use('/', express.static(path.join(__dirname, '../client')));
app.use('/modules', express.static(path.join(__dirname, '../node_modules')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ secret: 'squirrel' }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
	res.write('hello');
	res.end();
});

// authentication routes
app.get('/auth/facebook', passport.authenticate('facebook', {
  scope : 'email' }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect : '/',
  // failureRedirect : '/fail'
}));

app.listen(port);
console.log('Listing to ....' + port );
