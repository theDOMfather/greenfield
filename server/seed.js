const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const fs = require('fs');
const url = 'mongodb://localhost/hassle';
const db = mongoose.connect(url).connection;

// Step 1: Drop old data
//MongoClient.connect(url, (err, db) => db.command({'dropDatabase': 1}));

// Step 2: Add data from `data.json`
const User = require('./userModel.js');

fs.readFile(__dirname + '/data.json', (err, users) => err ? console.error(err) : User.create(JSON.parse(users), () => console.log('so many users!')));
