import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";

import userStore from "../../stores/UserStore";
import * as SensorActions from "../../actions/SensorActions";
import * as ControllerActions from "../../actions/ControllerActions";
import * as env from "../../env";

Modal.setAppElement("#root")

class Sensor extends Component {
    constructor(props) {
        super(props)
        this.state={
            assignModal_isOpen: false,
            assignModal_controllerId: '',
            assignModal_port: '',
            plotModal_isOpen: false
        }
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
                    this.props.setBanner(<div><p className="alert alert-success banner">{message}</p></div>)
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
                    this.props.setBanner(<div><p className="alert alert-success banner">{message}</p></div>);
                }
                else {
                    this.props.setBanner(<div><p className="alert alert-danger banner">{`Error: ${message}`}</p></div>);
                }
                this.setState({assignModal_isOpen: false})
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {
        const modalStyle={
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
                    <div className="row">
                        <div className="col-4">{this.props.name} [{this.props.id}]</div>
                        <div className="col-5"></div>
                        <div className="col-3">
                            <a href="#" onClick={this.assign.bind(this)} style={{ margin: "0 5px" }}>Assign</a>
                            <Link to={"/sensors/" + this.props.id} style={{ margin: "0 5px" }}>Edit</Link>
                            <a href="#" onClick={this.delete.bind(this)} style={{ margin: "0 5px" }}>Delete</a>
                        </div>
                    </div>
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
                        <input type="text" className="form-control" value={this.state.assignModal_controllerId} onChange={this.assignModal_onControllerIdChange.bind(this)} />
                        <label>Port</label>
                        <input type="text" className="form-control" value={this.state.assignModal_port} onChange={this.assignModal_onPortChange.bind(this)} />
                    </div>
                    <button className="btn btn-success" id="assignModal_submit" onClick={this.assignModal_submit.bind(this)}>Assign</button>
                </Modal>
            </div>
        )
    }
}

export default Sensor;