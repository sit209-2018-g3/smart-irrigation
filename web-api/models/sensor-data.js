const mongoose = require('mongoose');

module.exports = mongoose.model('SensorData', new mongoose.Schema({
    sensorId: String,
    data: [{
        timestamp: Number,
        moisture: Number
    }]
}));