var mongoose = require('mongoose');

var SensorSchema = new mongoose.Schema({
    sensorId: String,
    data: Array
}, {collection: 'Sensor'});

var sensor = mongoose.model('sensor',SensorSchema);
module.exports = sensor;
