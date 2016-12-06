var mongoose = require('mongoose');

//defining schema=========
var userSchema = new mongoose.Schema({
  token: String,
  id: String,
  name: String,
  twilioId: String,
  phoneNumber: String,
  buddyName: String,
  goal: String,
  buddyRelation: String,
  buddyPhone: String,
  alertTime: String,
  spamTime: String
  responses: Array
});

//creating a model======
module.exports = mongoose.model('newUser', userSchema);
