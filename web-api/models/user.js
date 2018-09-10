const mongoose = require('mongoose');
const Controller = require('./user/controller');
const Sensor = require('./user/sensor');

module.exports = mongoose.model('User', new mongoose.Schema({
    userId: String,
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    controllers: [Controller],
    sensors: [Sensor]
}));