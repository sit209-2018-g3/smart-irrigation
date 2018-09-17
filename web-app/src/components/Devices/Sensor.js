import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import userStore from "../../stores/UserStore";
import * as SensorActions from "../../actions/SensorActions";
import * as ControllerActions from "../../actions/ControllerActions";
import * as env from "../../env";

class Sensor extends Component {
    assign() {

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
                    this.props.setBanner(<div><p className="alert alert-success">{message}</p></div>)
                }
                else {
                    this.props.setBanner(<div><p className="alert alert-danger">{message}</p></div>)
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {
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

                {/* Modal -- Assign to Controller */}
                <div class="modal fade" id="historyModal">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Assign to Controller</h5>
                            </div>
                            <div class="modal-body">
                                <div className="form-group">
                                    <label>Controller Id</label>
                                    <input type="text" className="form-control" value={this.state.controllerId} onChange={this.onControllerIdChange.bind(this)} />
                                    <label>Controller Port</label>
                                    <input type="text" className="form-control" value={this.state.controllerPort} onChange={this.onControllerPortChange.bind(this)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Sensor;