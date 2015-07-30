var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var users = new Schema({
  // username: {type: String, required: true, unique: true},
  username: {type: String, required: true, index: { unique: true } },
  password: {type: String, required: true}
  // created_at: {type: Date, default: Date.now}
});

var User = mongoose.model('User', users);

users.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
});

User.prototype.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    if(err) return callback(err);
    callback(null, isMatch);
  });
}

// var hashPassword = function(){
//   var cipher = Promise.promisify(bcrypt.hash);
//   return cipher(this.password, null, null).bind(this)
//     .then(function(hash) {
//       this.password = hash;
//     });
// }

module.exports = User;
