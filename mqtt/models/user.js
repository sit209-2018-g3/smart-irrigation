var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    userId: String,
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    controllers: Array,
    sensors: Array
}, {collection: 'users'});

var user = mongoose.model('users',UserSchema);
module.exports = user;
