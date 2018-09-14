// import modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// import models
const User = require('./models/user')
const SensorData = require('./models/sensor-data')

// define app
const app = express();
const port = process.env.PORT || 5000;

// connect to mongo database
mongoose.connect(process.env.MONGO_URL, { user: process.env.MONGO_USER, pass: process.env.MONGO_PW, useNewUrlParser: true });

// parse body using body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// allow cross origin reponses
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/register', (req, res) => {
    let { username, password, firstName, lastName } = req.body;
    User.findOne({ username }, (err, found) => {
        if (err) {
            return res.json({
                'success': false,
                'message': err
            })
        }
        else if (found) {
            return res.json({
                'success': false,
                'message': 'That username is taken. Please choose a different username.'
            })
        }
        else {
            let newUser = new User({
                'userId': new mongoose.Types.ObjectId(),
                'username': username,
                'password': password,
                'firstName': firstName,
                'lastName': lastName,
                'controllers': [],
                'sensors': []
            });
            newUser.save(err => {
                return err
                    ? res.json({
                        'success': false,
                        'message': err
                    })
                    : res.json({
                        'success': true,
                        'message': 'New user created successfully.',
                        'userId': newUser.userId
                    })
            });
        }
    });
});

app.post('/authenticate', (req, res) => {
    let { username, password } = req.body;
    User.findOne({ username }, (err, user) => {
        if (err) {
            return res.json({
                'success': false,
                'message': err
            });
        }
        else if (!user || password != user.password) {
            return res.json({
                'success': false,
                'message': 'Incorrect username or password.'
            });
        }
        else {
            return res.json({
                'success': true,
                'message': 'User authenticated successfully.',
                'userId': user.userId
            });
        }
    });
});

app.post('/users/:userId/add-sensor', (req, res) => {
    const { userId } = req.params;
    let { sensorId, sensorName } = req.body;
    if (!sensorId || sensorId.trim() == '' || !sensorName || sensorName.trim() == '') {
        return res.json({
            'success': false,
            'message': 'Invalid sensor id or sensor name.'
        });
    }
    else {
        sensorId = sensorId.trim();
        sensorName = sensorName.trim();
        User.findOne({ 'sensors': { '$elemMatch': { sensorId } } }, (err, found) => {
            if (err || found) {
                return err
                    ? res.json({
                        'success': false,
                        'message': err
                    })
                    : res.json({
                        'success': false,
                        'message': 'Sensor is already registered to an account.'
                    });
            }
            else {
                User.findOne({ userId }, (err, user) => {
                    if (err || !user) {
                        return err
                            ? res.json({
                                'success': false,
                                'message': err
                            })
                            : res.json({
                                'success': false,
                                'message': 'Invalid user id.'
                            })
                    }
                    else {
                        let { sensors } = user;
                        let newSensor = {
                            sensorId,
                            sensorName,
                            'useControllerRules': true,
                            'rules': {
                                'minMoisture': 0,
                                'maxMoisture': 0,
                                'timeStart': 0,
                                'timeEnd': 0
                            },
                            'controlMode': 'Automatic',
                            'controlState': 'Off',
                            'controllerId': '',
                            'controllerPort': 0
                        }
                        sensors.push(newSensor);
                        user.sensors = sensors;
                        user.save(err => {
                            return err
                                ? res.json({
                                    'success': false,
                                    'message': err
                                })
                                : res.json({
                                    'success': true,
                                    'message': 'Successfully added new sensor.',
                                    sensors 
                                });
                        });
                    }
                });
            }
        });
    }
});

app.post('/users/:userId/remove-sensor', (req, res) => {
    const { userId } = req.params;
    let { sensorId } = req.body;
    User.findOne({ 'sensors': { '$elemMatch': { sensorId } } }, (err, user) => {
        if (err || !user) {
            return err
                ? res.json({
                    'success': false,
                    'message': err
                })
                :res.json({
                    'success': false,
                    'message': 'Invalid sensor id.'
                })
        }
        else if (user.userId != userId) {
            return res.json({
                'success': false,
                'message': 'Sensor is not registered to current user.'
            });
        }
        else {
            let { sensors, controllers } = user;
            sensors = sensors.filter( item => {
                return item.sensorId != sensorId;
            });
            for (controller of controllers) {
                if (controller.sensors.includes(sensorId)) {
                    controller.sensors = controller.sensors.filter( item => {
                        return item != sensorId;
                    });
                }
            }
            user.sensors = sensors;
            user.controllers = controllers;
            user.save(err => {
                return err
                    ? res.json({
                        'success': false,
                        'message': err
                    })
                    : res.json({
                        'success': true,
                        'message': 'Successfully removed sensor.',
                        sensors,
                        controllers,
                    });
            });
        }
    });
});

app.post('/users/:userId/add-controller', (req, res) => {
    const { userId } = req.params;
    let { controllerId, controllerName } = req.body;
    if (!controllerId || controllerId.trim() == '' || !controllerName || controllerName.trim() == '') {
        return res.json({
            'success': false,
            'message': 'Invalid controller id or controller name.'
        });
    }
    else {
        controllerId = controllerId.trim();
        controllerName = controllerName.trim();
        User.findOne({ 'controllers': { '$elemMatch': { 'controllerId': controllerId } } }, (err, found) => {
            if (err || found) {
                return err
                    ? res.json({
                        'success': false,
                        'message': err
                    })
                    : res.json({
                        'success': false,
                        'message': 'Controller is already registered to an account.'
                    });
            }
            else {
                User.findOne({ userId }, (err, user) => {
                    if (err || !user) {
                        return err
                            ? res.json({
                                'success': false,
                                'message': err
                            })
                            : res.json({
                                'success': false,
                                'message': 'User not found.'
                            });
                    }
                    else {
                        const { controllers } = user;
                        const newController = {
                            controllerId,
                            controllerName,
                            'ports': 1,
                            'rules': {
                                'minMoisture': 0,
                                'maxMoisture': 0,
                                'timeStart': 0,
                                'timeEnd': 0
                            },
                            'sensors': []
                        }
                        controllers.push(newController);
                        user.controllers = controllers;
                        user.save(err => {
                            return err
                                ? res.json({
                                    'success': false,
                                    'message': err
                                })
                                : res.json({
                                    'success': true,
                                    'message': 'Successfully added new controller.',
                                    controllers
                                });
                        });
                    }
                });
            }
        });
    }
});

app.post('/users/:userId/remove-controller', (req, res) => {
    const { userId } = req.params;
    let { controllerId } = req.body;
    if (!controllerId || controllerId.trim() == '') {
        return res.json({
            'success': false,
            'message': 'Invalid controller id.'
        });
    }
    else {
        controllerId = controllerId.trim();
        User.findOne({ 'controllers': { '$elemMatch': { controllerId } } }, (err, user) => {
            if (err || !user) {
                return err
                    ? res.json({
                        'success': false,
                        'message': err
                    })
                    : res.json({
                        'success': false,
                        'message': 'Controller not found.'
                    });
            }
            else if (user.userId != userId) {
                return res.json({
                    'success': false,
                    'message': 'Controller is not registered to current user.'
                });
            }
            else {
                let { sensors, controllers } = user;
                controllers = controllers.filter(item => {
                    return item.controllerId != controllerId
                });
                for (sensor of sensors) {
                    if (sensor.controllerId == controllerId) {
                        sensor.controllerId = '';
                        sensor.controllerPort = 0;
                    }
                }
                user.sensors = sensors;
                user.controllers = controllers;
                user.save(err => {
                    return err
                        ? res.json({
                            'success': false,
                            'message': err
                        })
                        : res.json({
                            'success': true,
                            'message': 'Successfully removed controller.',
                            sensors,
                            controllers

                        });
                });
            }
        });
    }
});

app.post('/sensors/:sensorId/update', (req, res) => {
    const { sensorId } = req.params;
    let { sensorName, useControllerRules, rules, controlMode, controlState } = req.body;
    User.findOne({ 'sensors': { '$elemMatch': { sensorId } } }, (err, user) => {
        if (err || !user) {
            return err
                ? res.json({
                    'success': false,
                    'message': err
                })
                : res.json({
                    'success': false,
                    'message': 'Invalid sensor id.'
                });
        }
        else {
            let { sensors } = user;
            for (sensor of sensors) {
                if (sensor.sensorId == sensorId) {
                    sensor.sensorName = sensorName;
                    sensor.useControllerRules = useControllerRules;
                    sensor.rules = rules;
                    sensor.controlMode = controlMode;
                    sensor.controlSate = controlState;
                    break;
                }
            }
            user.sensors = sensors;
            user.save( err => {
                return err
                    ? res.json({
                        'success': false,
                        'message': err
                    })
                    : res.json({
                        'success': true,
                        'message': 'Sensor updated successfully.',
                        sensors
                    });
            });
        }
    });
});

app.post('/controllers/:controllerId/update', (req, res) => {
    const { controllerId } = req.params;
    let { controllerName, ports, rules } = req.body;
    User.findOne({ 'controllers': { '$elemMatch': { controllerId } } }, (err, user) => {
        if (err || !user) {
            return err
                ? res.json({
                    'success': false,
                    'message': err
                })
                : res.json({
                    'success': false,
                    'message': 'Invalid controller id.'
                });
        }
        else {
            let { controllers } = user;
            for (controller of controllers) {
                if (controller.controllerId == controllerId) {
                    controller.controllerName = controllerName;
                    controller.ports = ports;
                    controller.rules = rules;
                    break;
                }
            }
            user.controllers = controllers;
            user.save( err => {
                return err
                    ? res.json({
                        'success': false,
                        'message': err
                    })
                    : res.json({
                        'success': true,
                        'message': 'Controller updated successfully.',
                        controllers
                    });
            });
        }
    });
});

app.post('/controllers/:controllerId/link-sensor', (req, res) => {
    const { controllerId } = req.params;
    let { sensorId, controllerPort } = req.body;
    User.findOne({'controllers': {'$elemMatch': { controllerId }}}, (err, user) => {
        if (err) {
            return res.json({
                'success': false,
                'message': err
            });
        } else if (!user) {
            return res.json({
                'success': false,
                'message': 'Invalid controller id.'
            });
        } else {
            let { controllers, sensors } = user;
            let sensorFound = false;
            for (sensor of sensors) {
                if ( sensor.sensorId == sensorId ) {
                    sensor.controllerId = controllerId;
                    sensor.controllerPort = controllerPort;
                    for (controller of controllers) {
                        if (controller.controllerId == controllerId && !controller.sensors.includes(sensorId)) {
                            controller.sensors.push(sensorId);
                        }
                        else if (controller.sensors.includes(sensorId)) {
                            controller.sensors = controller.sensors.filter(item => {
                                return item != sensorId;
                            })
                        }
                    }
                    sensorFound = true;
                    break;
                }
            }
            if (!sensorFound) {
                return res.json({
                    'success': false,
                    'message': 'Invalid sensor id or sensor not registered to current user.'
                })
            }
            else {
                user.controllers = controllers;
                user.sensors = sensors;
                user.save( err => {
                    return err
                        ? res.json({
                            'success': false,
                            'message': err
                        })
                        : res.json({
                            'success': true,
                            'message': 'Sensor successfully linked to device.',
                            sensors,
                            controllers
                        });
                });
            }
        }
    });
});

app.post('/sensors/:sensorId/unlink', (req, res) => {
    const { sensorId } = req.params;
    User.findOne({ 'sensors': { '$elemMatch': { sensorId } } }, (err, user) => {
        if (err || !user) {
            return err
                ? res.json({
                    'success': false,
                    'message': err
                })
                : res.json({
                    'success': false,
                    'message': 'Invalid sensor id.'
                })
        }
        else {
            let { sensors, controllers } = user;
            for (sensor of sensors) {
                if (sensor.sensorId == sensorId) {
                    sensor.controllerId = '';
                    sensor.controllerPort = 0;
                    break;
                }
            }
            for (controller of controllers) {
                if (controller.sensors.includes(sensorId)) {
                    controller.sensors = controller.sensors.filter(item => {
                        return item != sensorId;
                    })
                }
            }
            user.sensors = sensors;
            user.controllers = controllers;
            user.save(err => {
                return err
                    ? res.json({
                        'success': false,
                        'message': err
                    })
                    : res.json({
                        'success': true,
                        'message': 'Sensor successfully unlinked.'
                    });
            });
        }
    });
});

app.get('/users/:userId/sensors', (req, res) => {
    const { userId } = req.params;
    User.findOne({ userId }, (err, user) =>{
        if (err || ! user) {
            return err
                ? res.json({
                    'success': false,
                    'message': err
                })
                : res.json({
                    'success': false,
                    'message': 'Invalid user id.'
                });
        }
        else {
            let { sensors } = user
            return res.json({
                'success': true,
                'message': 'Successfully retrieved sensors.',
                sensors
            });
        }
    });
});

app.get('/users/:userId/controllers', (req, res) => {
    const { userId } = req.params;
    User.findOne({ userId }, (err, user) => {
        if (err || ! user) {
            return err
                ? res.json({
                    'success': false,
                    'message': err
                })
                : res.json({
                    'success': false,
                    'message': 'Invalid user id.'
                });
        }
        else {
            let { controllers } = user
            return res.json({
                'success': true,
                'message': 'Successfully retrieved controllers.',
                controllers
            });
        } 
    });
});

app.get('/users/:userId/details', (req, res) => {
    const { userId } = req.params;
    User.findOne({ userId }, (err, user) => {
        if (err || ! user) {
            return err
                ? res.json({
                    'success': false,
                    'message': err
                })
                : res.json({
                    'success': false,
                    'message': 'Invalid user id.'
                });
        }
        else {
            let { firstName, lastName } = user;
            return res.json({
                'success': true,
                'message': 'Successfully retrieved user details.',
                firstName,
                lastName
            });
        }
    });
});

app.post('/users/:userId/update', (req, res) => {
    const { userId } = req.params;
    let { firstName, lastName } = req.body;
    User.findOne({ userId }, (err, user) => {
        if (err || ! user) {
            return err
                ? res.json({
                    'success': false,
                    'message': err
                })
                : res.json({
                    'success': false,
                    'message': 'Invalid user id.'
                });
        }
        else {
            user.firstName = firstName;
            user.lastName = lastName;
            user.save(err => {
                return err
                    ? res.json({
                        'success': false,
                        'message': err
                    })
                    : res.json({
                        'success': true,
                        'message': 'Successfully update user details.',
                        firstName,
                        lastName
                    });
            });
        }
    });
});

app.get('/sensors/:sensorId/data', (req, res) => {
    const { sensorId } = req.params;
    SensorData.findOne({ sensorId }, (err, sensor) => {
       if (err || !sensor) {
           return err
            ? res.json({
                'success': false,
                'message': err
            })
            : res.json({
                'success': false,
                'message': 'Invalid sensor id or no data available.'
            });
       }
       else {
           let { data } = sensor.data;
           return res.json({
               'success': true,
               'message': 'Successfully retrieved sensor data.',
               data
           })
       }
    });
});

// start listener
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});