var mongoose = require('mongoose');

//defining schema=========
var userSchema = new mongoose.Schema({
  token: String,
  id: String,
  name: String,
  phoneNumber: String,
  buddyname: String,
  goal: String,
  buddyRelation: String,
  buddyPhone: String,
  alertTime: String,
  spamTime: String
});

//creating a model======
module.exports = mongoose.model('newUser', userSchema);

