var mongoose = require('mongoose');

//defining schema=========
var userSchema = new mongoose.Schema({
    token: String,
    id: String,
    name: String,
    phoneNumber: String,
    goal: String,
    spamTime: String
})

//creating a model======
module.exports = mongoose.model('User', userSchema);
