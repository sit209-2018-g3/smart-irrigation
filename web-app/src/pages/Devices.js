import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import controllerStore from "../stores/ControllerStore";
import sensorStore from "../stores/SensorStore";
import userStore from '../stores/UserStore';

import Controller from "../components/Devices/Controller";
import Sensor from "../components/Devices/Sensor"

class Devices extends Component {
    constructor(props) {
        super(props)
        this.state = {
            controllers: controllerStore.getAll(),
            sensors: sensorStore.getUnlinked()
        }
        this.onControllerStoreChange = this.onControllerStoreChange.bind(this);
        this.onSensorStoreChange = this.onSensorStoreChange.bind(this);
    }

    componentWillMount() {
        controllerStore.on("change", this.onControllerStoreChange)
        sensorStore.on("change", this.onSensorStoreChange)
    }

    componentWillUnmount() {
        controllerStore.removeListener("change", this.onControllerStoreChange)
        sensorStore.removeListener("change", this.onSensorStoreChange)
    }

    onControllerStoreChange() {
        this.setState({
            controllers: controllerStore.getAll()
        });
        console.log(this.state.controllers);
    }

    onSensorStoreChange() {
        this.setState({
            sensors: sensorStore.getUnlinked()
        });
        console.log(this.state.sensors);
    }

    render() {
        return (
            <div>
                {
                    userStore.getUserId() === ''
                        ? <Redirect to={{ pathname: "/login" }} />
                        : <div className="container">
                            <h2>Controllers:</h2>
                            {
                                this.state.controllers.length > 0
                                    ? this.state.controllers.map(controller => {
                                        return <Controller key={controller.controllerId} id={controller.controllerId} name={controller.controllerName} ports={controller.ports} />
                                    })
                                    : <div>No controllers.</div>
                            }
                            <h2>Unlinked Sensors:</h2>
                            {
                                this.state.sensors.length > 0
                                    ? this.state.sensors.map(sensor => {
                                        return <Sensor key={sensor.sensorId} id={sensor.sensorId} name={sensor.sensorName} />
                                    })
                                    : <div>No unlinked sensors.</div>
                            }
                        </div>

                }
            </div>
        );
    }
}

export default Devices;