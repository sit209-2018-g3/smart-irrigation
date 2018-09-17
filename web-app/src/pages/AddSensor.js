import React, { Component } from 'react';
import axios from 'axios';

import userStore from "../stores/UserStore";
import * as SensorActions from "../actions/SensorActions";
import * as env from "../env";

class AddSensor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sensorId: '',
            sensorName: '',
            useControllerRules: true,
            minMoisture: '',
            maxMoisture: '',
            timeStart: '',
            timeEnd: '',
            banner: <div></div>
        }
    }

    onSensorIdChange(e) {
        this.setState({
            sensorId: e.target.value
        });
    }

    onSensorNameChange(e) {
        this.setState({
            sensorName: e.target.value
        });
    }

    onUseControllerRulesChange(e) {
        this.setState({
            useControllerRules: e.target.value
        });
    }

    onMinMoistureChange(e) {
        this.setState({
            minMoisture: e.target.value
        });
    }

    onMaxMoistureChange(e) {
        this.setState({
            maxMoisture: e.target.value
        });
    }

    onTimeStartChange(e) {
        this.setState({
            timeStart: e.target.value
        });
    }

    onTimeEndChange(e) {
        this.setState({
            timeEnd: e.target.value
        });
    }

    submit() {
        const { sensorId, sensorName, useControllerRules, minMoisture, maxMoisture, timeStart, timeEnd } = this.state;
        const userId = userStore.getUserId();
        const params = {
            sensorId,
            sensorName,
            useControllerRules,
            rules: {
                minMoisture,
                maxMoisture,
                timeStart,
                timeEnd
            }
        };
        axios.post(`${env.API_URL}/users/:${userId}/add-sensor`, params)
                .then(res => {
                    const { success, message, sensors } = res.data;
                    if (success) {
                        SensorActions.setSensors(sensors);
                        this.props.history.push("/");
                    }
                    else {
                        this.setState({
                            banner: <div><p className="alert alert-danger">{message}</p></div>
                        });
                    }
                })
                .catch(error => {
                    console.log(`Error: ${error}`);
                });
    }

    render() {
        return (
            <div>
                <h1>Add Sensor</h1>
                {this.state.banner}
                <div className="form-group">
                    <label>Sensor Id</label>
                    <input type="text" className="form-control" value={this.state.sensorId} onChange={this.onSensorIdChange.bind(this)} />
                    <label>Sensor Name</label>
                    <input type="text" className="form-control" value={this.state.sensorName} onChange={this.onSensorNameChange.bind(this)} />
                    <label>Use Controller Rules</label>
                    <input type="text" className="form-control" value={this.state.useControllerRules} onChange={this.onUseControllerRules.bind(this)} />
                    <label>Min Moisture</label>
                    <input type="text" className="form-control" value={this.state.minMoisture} onChange={this.onMinMoistureChange.bind(this)} />
                    <label>Max Moisture</label>
                    <input type="text" className="form-control" value={this.state.maxMoisture} onChange={this.onMaxMoistureChange.bind(this)} />
                    <label>Time Start</label>
                    <input type="text" className="form-control" value={this.state.timeStart} onChange={this.onTimeStartChange.bind(this)} />
                    <label>Time End</label>
                    <input type="text" className="form-control" value={this.state.timeEnd} onChange={this.onTimeEndChange.bind(this)} />
                </div>
                <button className="btn btn-success" id="submit" onClick={this.submit.bind(this)}>Add Sensor</button>
            </div>
        );
    }

}

export default AddSensor;