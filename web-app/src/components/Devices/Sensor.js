/* Libraries */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import Plot from "react-plotly.js";

/* Stores */
import userStore from "../../stores/UserStore";

/* Actions */
import * as SensorActions from "../../actions/SensorActions";
import * as ControllerActions from "../../actions/ControllerActions";

/* Constants */
import * as env from "../../env";

Modal.setAppElement("#root")

class Sensor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            assignModal_isOpen: false,
            assignModal_controllerId: '',
            assignModal_port: '',
            plotX: [],
            plotY: [],
            plotModal_isOpen: false
        }
        this.viewData = this.viewData.bind(this);
        this.assign = this.assign.bind(this);
        this.delete = this.delete.bind(this);
        this.assignModal_onControllerIdChange = this.assignModal_onControllerIdChange.bind(this);
        this.assignModal_onPortChange = this.assignModal_onPortChange.bind(this);
        this.assignModal_submit = this.assignModal_submit.bind(this);
    }

    viewData() {
        const sensorId = this.props.id;
        axios.get(`${env.API_URL}/sensors/${sensorId}/data`)
            .then(res => {
                const { success, message, data } = res.data;
                if (success) {
                    let x = [];
                    let y = [];
                    for (let row of data)
                    {
                        x.push(new Date(row.ts));
                        y.push(row.moisture);
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

    assign() {
        this.setState({ assignModal_isOpen: true })
    }

    delete() {
        const userId = userStore.getUserId();
        const params = {
            sensorId: this.props.id
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

    assignModal_onControllerIdChange(e) {
        this.setState({ assignModal_controllerId: e.target.value })
    }

    assignModal_onPortChange(e) {
        this.setState({ assignModal_port: e.target.value })
    }

    assignModal_submit() {
        const sensorId = this.props.id;
        const controllerId = this.state.assignModal_controllerId;
        const controllerPort = this.state.assignModal_port;
        const params = {
            sensorId,
            controllerPort
        }
        axios.post(`${env.API_URL}/controllers/${controllerId}/link-sensor`, params)
            .then(res => {
                const { success, message, sensors, controllers } = res.data;
                if (success) {
                    SensorActions.setSensors(sensors);
                    ControllerActions.setControllers(controllers);
                }
                else {
                    this.props.setBanner(<div><p className="alert alert-danger banner">{`Error: ${message}`}</p></div>);
                }
                this.setState({ assignModal_isOpen: false })
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
            <div>

                {/* Main Component */}
                <div>
                    <table width="100%" cellpadding="5">
                        <tr className="box-content">
                            <td width="40%">{this.props.name} [{this.props.id}]</td>
                            <td width="60%" className="text-right">
                                <a href="#" className="box-controls" onClick={this.viewData}>View Data</a>
                                <a href="#" className="box-controls" onClick={this.assign}>Assign</a>
                                <Link to={"/sensors/" + this.props.id} className="box-controls">Edit</Link>
                                <a href="#" className="box-controls" onClick={this.delete}>Delete</a>
                            </td>
                        </tr>
                    </table>
                </div>

                {/* Assign Modal */}
                <Modal
                    isOpen={this.state.assignModal_isOpen}
                    onRequestClose={() => this.setState({ assignModal_isOpen: false })}
                    style={modalStyle}
                >

                    <h2>Assign to Controller</h2>
                    <div className="form-group">
                        <label>Controller ID</label>
                        <input type="text" className="form-control" value={this.state.assignModal_controllerId} onChange={this.assignModal_onControllerIdChange} />
                        <label>Port</label>
                        <input type="text" className="form-control" value={this.state.assignModal_port} onChange={this.assignModal_onPortChange} />
                    </div>
                    <button className="btn btn-success" id="assignModal_submit" onClick={this.assignModal_submit}>Assign</button>
                </Modal>

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
                        layout={{ title: `${this.props.name} [${this.props.id}] - Data` }}
                    />

                </Modal>

            </div>
        )
    }
}

export default Sensor;