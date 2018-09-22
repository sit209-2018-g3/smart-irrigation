import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import * as env from "../../../env";
import * as SensorActions from "../../../actions/SensorActions";
import * as ControllerActions from "../../../actions/ControllerActions";

import userStore from "../../../stores/UserStore";

class LinkedSensor extends Component {
    constructor(props) {
        super(props)
        this.toggleOn = this.toggleOn.bind(this);
        this.unassign = this.unassign.bind(this);
        this.delete = this.delete.bind(this);
    }

    toggleOn() {
        let { sensorId, sensorName, useControllerRules, rules, controlMode, controlState } = this.props.sensor;
        if (this.props.sensor.controlMode === "manual") {
            controlMode = "automatic";
            controlState = "off";
        }
        else {
            controlMode = "manual";
            controlState = "on";
        }
        const params = {
            sensorName,
            useControllerRules,
            rules,
            controlMode,
            controlState
        }
        axios.post(`${env.API_URL}/sensors/${sensorId}/update`, params)
            .then(res => {
                const { success, message, sensors } = res.data;
                if (success) {
                    SensorActions.setSensors(sensors);
                }
                else {
                    this.props.setBanner(<div><p className="alert alert-danger banner">{message}</p></div>);
                }
            })
    }

    unassign() {
        const { sensorId } = this.props.sensor;
        axios.post(`${env.API_URL}/sensors/${sensorId}/unlink`)
            .then(res => {
                const { success, message, sensors, controllers } = res.data;
                if (success) {
                    SensorActions.setSensors(sensors);
                    ControllerActions.setControllers(controllers);
                }
                else {
                    this.props.setBanner(<div><p className="alert alert-danger banner">{message}</p></div>);
                }
            })
    }

    delete() {
        const userId = userStore.getUserId();
        const params = {
            sensorId: this.props.sensor.sensorId
        }
        axios.post(`${env.API_URL}/users/${userId}/remove-sensor`, params)
            .then(res => {
                const { success, message, sensors, controllers } = res.data;
                if (success) {
                    SensorActions.setSensors(sensors);
                    ControllerActions.setControllers(controllers);
                }
                else {
                    this.props.setBanner(<div><p className="alert alert-danger banner">{message}</p></div>)
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {
        return (
            <tr className="box-content">
                <td width="40%">Port {this.props.sensor.controllerPort}: {this.props.sensor.sensorName} [{this.props.sensor.sensorId}]</td>
                <td width="60%" className="text-right">
                    <a href="#" className="box-controls">View Data</a>
                    <a href="#" className="box-controls" onClick={this.toggleOn}>Turn {this.props.sensor.controlMode === "manual" ? 'Off' : 'On'}</a>
                    <a href="#" className="box-controls" onClick={this.unassign}>Unassign</a>
                    <Link to={"/sensors/" + this.props.sensor.sensorId} className="box-controls">Edit</Link>
                    <a href="#" className="box-controls" onClick={this.delete}>Delete</a>
                </td>
            </tr>
        )
    }
}

export default LinkedSensor;