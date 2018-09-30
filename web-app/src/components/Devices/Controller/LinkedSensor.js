import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import Plot from "react-plotly.js";

import * as env from "../../../env";
import * as SensorActions from "../../../actions/SensorActions";
import * as ControllerActions from "../../../actions/ControllerActions";

import userStore from "../../../stores/UserStore";

class LinkedSensor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            plotX: [],
            plotY: [],
            plotModal_isOpen: false
        }
        this.viewData = this.viewData.bind(this);
        this.toggleOn = this.toggleOn.bind(this);
        this.unassign = this.unassign.bind(this);
        this.delete = this.delete.bind(this);
    }

    viewData() {
        const { sensorId } = this.props.sensor;
        axios.get(`${env.API_URL}/sensors/${sensorId}/data`)
            .then(res => {
                const { success, message, data } = res.data;
                if (success) {
                    let x = [];
                    let y = [];
                    for (let row of data) {
                        if (y > 0.5) {
                            x.push(new Date(row.ts));
                            y.push(row.moisture);
                        }
                    }
                    this.setState({
                        plotX: x,
                        plotY: y,
                        plotModal_isOpen: true
                    })
                }
                else {
                    this.props.setBanner(<div><p className="alert alert-danger banner">{message}</p></div>)
                }
            })
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
        const modalStyle = {
            content: {
                top: '30%',
                left: '50%',
                right: '50%',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)'
            }
        }
        return (
            <tr className="box-content">
                <td width="40%">Port {this.props.sensor.controllerPort}: {this.props.sensor.sensorName} [{this.props.sensor.sensorId}]</td>
                <td width="60%" className="text-right">
                    <a href="#" className="box-controls" onClick={this.viewData}>View Data</a>
                    <a href="#" className="box-controls" onClick={this.toggleOn}>Turn {this.props.sensor.controlMode === "manual" ? 'Off' : 'On'}</a>
                    <a href="#" className="box-controls" onClick={this.unassign}>Unassign</a>
                    <Link to={"/sensors/" + this.props.sensor.sensorId} className="box-controls">Edit</Link>
                    <a href="#" className="box-controls" onClick={this.delete}>Delete</a>
                </td>

                {/* Plot Modal */}
                <Modal
                    isOpen={this.state.plotModal_isOpen}
                    onRequestClose={() => this.setState({ plotModal_isOpen: false })}
                    style={modalStyle}
                >

                    <Plot
                        data={[
                            {
                                type: "scatter",
                                mode: "lines",
                                name: "Moisture",
                                x: this.state.plotX,
                                y: this.state.plotY,
                                line: { color: '#17BECF' },
                            }
                        ]}
                        layout={{ title: `${this.props.sensor.sensorName} [${this.props.sensor.sensorId}] - Data` }}
                    />

                </Modal>

            </tr>
        )
    }
}

export default LinkedSensor;