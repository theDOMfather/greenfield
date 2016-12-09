var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
//defining schema=========
var userSchema = mongoose.Schema({
  token: String,
  id: String,
  name: String,
  phoneNumber: String,
  buddyName: String,
  buddyPhone: String,
  goal: String,
  goalStartDate: Number,
  responses: Array,
  grade: Number // this is to calculate the score based on users responses...
});

//creating a model======
////including the timestamps
userSchema.plugin(timestamps);

module.exports = mongoose.model('user', userSchema);

