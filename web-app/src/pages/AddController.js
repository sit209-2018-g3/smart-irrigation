import React, { Component } from 'react';
import axios from 'axios';

import userStore from "../stores/UserStore";
import * as ControllerActions from "../actions/ControllerActions";
import * as env from "../env";

class AddController extends Component {
    constructor(props) {
        super(props)
        this.state = {
            controllerId: '',
            controllerName: '',
            ports: '',
            minMoisture: '',
            maxMoisture: '',
            timeStart: '',
            timeEnd: '',
            banner: <div></div>
        }
    }

    onControllerIdChange(e) {
        this.setState({
            controllerId: e.target.value
        });
    }

    onControllerNameChange(e) {
        this.setState({
            controllerName: e.target.value
        });
    }

    onPortsChange(e) {
        this.setState({
            ports: e.target.value
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
        const { controllerId, controllerName, ports, minMoisture, maxMoisture, timeStart, timeEnd } = this.state;
        const userId = sserStore.getUserId();
        const params = {
            controllerId,
            controllerName,
            ports,
            rules: {
                minMoisture,
                maxMoisture,
                timeStart,
                timeEnd
            }
        };
        axios.post(`${env.API_URL}/users/:${userId}/add-controller`, params)
                .then(res => {
                    const { success, message, controllers } = res.data;
                    if (success) {
                        ControllerActions.setControllers(controllers);
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
                    <label>Controller Id</label>
                    <input type="text" className="form-control" value={this.state.controllerId} onChange={this.onControllerIdChange.bind(this)} />
                    <label>Controller Name</label>
                    <input type="text" className="form-control" value={this.state.controllerName} onChange={this.onControllerNameChange.bind(this)} />
                    <label>Ports</label>
                    <input type="text" className="form-control" value={this.state.ports} onChange={this.onPortsChange.bind(this)} />
                    <label>Min Moisture</label>
                    <input type="text" className="form-control" value={this.state.minMoisture} onChange={this.onMinMoistureChange.bind(this)} />
                    <label>Max Moisture</label>
                    <input type="text" className="form-control" value={this.state.maxMoisture} onChange={this.onMaxMoistureChange.bind(this)} />
                    <label>Time Start</label>
                    <input type="text" className="form-control" value={this.state.timeStart} onChange={this.onTimeStartChange.bind(this)} />
                    <label>Time End</label>
                    <input type="text" className="form-control" value={this.state.timeEnd} onChange={this.onTimeEndChange.bind(this)} />
                </div>
                <button className="btn btn-success" id="submit" onClick={this.submit.bind(this)}>Add Controller</button>
            </div>
        );
    }

}

export default AddController;