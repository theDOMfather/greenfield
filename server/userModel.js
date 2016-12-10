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
  grade: Number, // this is to calculate the score based on users responses...
  harassment: Boolean,  // this sets flag for if user should be harassed..
  harrasmentBuddy: Boolean  // this sets flag for if user's buddy should be harassed...
});

//creating a model======
////including the timestamps
userSchema.plugin(timestamps);

module.exports = mongoose.model('user', userSchema);
