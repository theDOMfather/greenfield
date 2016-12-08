var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
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
////including the timestamps
userSchema.plugin(timestamps)

module.exports = mongoose.model('user', userSchema);

