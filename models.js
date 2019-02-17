var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  facebookID: String,
  auth_id: String,
  token: Object,
  email: String,
  pendingInvites: []
})


var User = mongoose.model('User', userSchema);
module.exports = {
  User: User,
 };
