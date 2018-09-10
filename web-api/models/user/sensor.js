const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    sensorId: String,
    sensorName: String,
    useControllerRules: Boolean,
    rules: {
        minMoisture: Number,
        maxMoisture: Number,
        timeStart: Number,
        timeEnd: Number
    },
    controlMode: String,
    controlState: String,
    controllerId: String,
    controllerPort: Number
});