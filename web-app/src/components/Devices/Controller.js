/* Libraries */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

/* Components */
import LinkedSensor from "./Controller/LinkedSensor";

/* Stores */
import sensorStore from "../../stores/SensorStore";
import userStore from "../../stores/UserStore";

/* Actions */
import * as SensorActions from "../../actions/SensorActions";
import * as ControllerActions from "../../actions/ControllerActions";

/* Constants */
import * as env from "../../env";

class Controller extends Component {
    constructor(props) {
        super (props)
        this.state = {
            sensors: sensorStore.getLinkedTo(this.props.id).sort(this.sensorPortComparer)
        }
        this.onSensorStoreChange = this.onSensorStoreChange.bind(this);
        this.delete = this.delete.bind(this)
    }

    sensorPortComparer(a, b) {
        let portA = a.controllerPort || 0;
        let portB = b.controllerPort || 0;
        if (portA < portB) {
            return -1;
        }
        else if (portA === portB) {
            return 0;
        }
        else {
            return 1;
        }
    }

    componentWillMount() {
        sensorStore.on("change", this.onSensorStoreChange);
    }

    componentWillUnmount() {
        sensorStore.removeListener("change", this.onSensorStoreChange);
    }

    onSensorStoreChange() {
        this.setState({
            sensors: sensorStore.getLinkedTo(this.props.id).sort(this.sensorPortComparer)
        })
    }

    delete() {
        const userId = userStore.getUserId();
        const params = {
            controllerId: this.props.id
        }
        axios.post(`${env.API_URL}/users/${userId}/remove-controller`, params)
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

    render()
    {
        return (
            <div>
                <table className="box" cellpadding="5">
                    <tr className="box-title">
                        <th width="40%">{this.props.name} [{this.props.id}]</th>
                        <th width="60%" className="text-right">
                            <Link className="box-controls" to={`/controllers/${this.props.id}/edit`}>Edit</Link>
                            <a className="box-controls" onClick={this.delete} href="#">Delete</a>
                        </th>
                    </tr>
                {this.state.sensors.length > 0
                    ?   this.state.sensors.map(sensor => {
                            return <LinkedSensor key={sensor.sensorId} sensor={sensor} setBanner={this.props.setBanner}/>
                        })
                    :   <td colspan="2" className="text-center">No Linked Sensors</td>
                }
                </table>
            </div>
        )
    }
}

export default Controller;