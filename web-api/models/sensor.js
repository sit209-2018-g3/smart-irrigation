var mongoose = require('mongoose');

var SensorSchema = new mongoose.Schema({
    sensorId: String,
    data: Array
}, {collection: 'Sensor'});

var Sensor = mongoose.model('sensor', SensorSchema);
module.exports = Sensor;
