var mongoose = require('mongoose');

//defining schema=========
var userSchema = mongoose.Schema({
  token: String,
  id: String,
  name: String,
  phoneNumber: String,
  goal: String,
  buddyName: String,
  buddyRelation: String,
  buddyPhone: String,
  responses: Array
});

//creating a model======
module.exports = mongoose.model('user', userSchema);
