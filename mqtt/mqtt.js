const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://ds145752.mlab.com:45752/smart-irrigation',{user:'sit209-2018-g3',pass:'4N2s&DScf3Qm',useNewUrlParser: true });

const Sensor = require('./models/sensor');
const User = require ('./models/user');

const app = express();

const { URL, USER, PASSWORD } = process.env;
const port = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const client = mqtt.connect(URL, {
    username: USER,
    password: PASSWORD
});

client.on('connect', () => {
    console.log('mqtt connected');
    client.subscribe('/#');
});

client.on('message', (topic, message) => {
    if (topic == '/mqtt-data/moisture') {
        const data = JSON.parse(message);
        
        Sensor.findOne({"id": data.id}, (err, device) => {
            if (err) {
                console.log(err)
            }
            const ts = new Date().getTime();

            const { sensorData } = device;
            const { moisture } = data;

            sensorData.push({ ts, moisture });
            device.sensorData = sensorData;

            device.save(err => {
                if (err){
                    console.log(err)
                }
            });
        });
    } else if (topic == '/mqtt-config/sensors') {
        const data = JSON.parse(message);
        
        User.findOne({"sensors":{$all: [{$elemMatch: {"sensorId":data.id}}]}},{_id:0,sensors:1}, (err, sensor) => {
            if (err) {
                console.log(err)
            }

            for (i in sensor.sensors) {
                if (sensor.sensors[i].sensorId == data){
                    const topic = `/sensor/${data.id}/config`;
                    const command = `${sensor.sensors[i].controllerId}`;
                    client.publish(topic,command);
                }
            }
        });
    } else if (topic == '/mqtt-config/actuators') {
        const data = JSON.parse(message);
        
        User.findOne({"controllers":{$all: [{$elemMatch: {"controllerId":data.id}}]}},{_id:0,controllers:1}, (err, controller) => {
            if (err) {
                console.log(err)
            }

            for (i in controller.controllers) {
                if (controller.controllers[i].controllerId == data){
                    const topic = `/actuator/${data.id}/config`;
                    const command = `${controller.controllers[i].sensors}`;
                    client.publish(topic,command);
                }
            }
        });
    }   
});

/*app.post('/act', (req, res) => {
    const { deviceId, command } = req.body;
    const topic = `/command/${deviceId}`;
    client.publish(topic, command, () => {
        res.send('published new message');
    });
});*/

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
