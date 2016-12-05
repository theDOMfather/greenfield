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

// //specifying routes for database queries
// //submit is a place holder here.  can be changed when front-end is ready
// app.post('/submit', function(req, res) {
//   Table.create({
//     username: req.body.username,
//     password: req.body.password,
//     phoneNumber: req.body.phoneNumber,
//     goal: req.body.goal,
//     spamTime: req.body.spamTime,
//     done: false
//   }, function(err, user) {
//     if (err) {
//       res.send (err);
//     }
//     res.send (user);
//   });
// })
