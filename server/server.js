var http = require ('http');
var path = require ('path');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
//database set up begins=====
var morgan = require('morgan');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//database set up end======


var passport = require('passport');
require('./auth/auth.js')(passport);

var app = express();

var port = process.env.PORT || 8000;

//configuring database begin =========
mongoose.connect('mongodb://localhost');
app.use(morgan('dev')); //to log every request to the console


app.use('/', express.static(path.join(__dirname, '../client')));
app.use('/modules', express.static(path.join(__dirname, '../node_modules')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ secret: 'squirrel' }));
app.use(passport.initialize());
app.use(passport.session());

//defining schema=========
var databaseSchema = new Schema({
  username: String,
  password: String,
  phoneNumber: String,
  goal: String,
  spamTime: String
})

//creating a model======
var Table = mongoose.model('Table', databaseSchema);

app.get('/', function(req, res) {
	res.write('hello');
	res.end();
});

//specifying routes for database queries
//submit is a place holder here.  can be changed when front-end is ready
app.post('/submit', function(req, res) {
  Table.create({
    username: req.body.username,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    goal: req.body.goal,
    spamTime: req.body.spamTime,
    done: false
  }, function(err, user) {
    if (err) {
      res.send (err);
    }
    res.send (user);
  });
})

// authentication routes
app.get('/auth/facebook', passport.authenticate('facebook', {
  scope : 'email' }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect : '/',
  // failureRedirect : '/fail'
}));

//setting up listening
app.listen(port);
console.log('Listening on port... ' + port );
