const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const fs = require('fs');
const url = 'mongodb://bartek:hassle1@ds119598.mlab.com:19598/heroku_4800qm90';
const db = mongoose.connect(url).connection;
const User = require('./userModel.js');

// Step 1: Drop old data
MongoClient.connect(url, (err, db) => db.command({ 
  'dropDatabase': 1
}));

// Step 2: Add data from `data.json`
fs.readFile(__dirname + '/data.json', (err, users) => err ? console.error(err) : User.create(JSON.parse(users), () => console.log('so many users!')));
