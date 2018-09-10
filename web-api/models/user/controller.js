const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    controllerId: String,
    controllerName: String,
    ports: Number,
    rules: {
        minMoisture: Number,
        maxMoisture: Number,
        timeStart: Number,
        timeEnd: Number
    },
    sensors: [String]
});