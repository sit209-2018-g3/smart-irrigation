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
            sensors: sensorStore.getUnlinked(),
            banner: <div></div>
        }
        this.bannerTimeout = null;
        this.onControllerStoreChange = this.onControllerStoreChange.bind(this);
        this.onSensorStoreChange = this.onSensorStoreChange.bind(this);
    }

    setBanner(banner) {
        if (this.bannerTimeout) {
            clearTimeout(this.bannerTimeout);
        }
        this.setState({ banner });
        this.bannerTimeout = setTimeout(() => {this.setState({banner: <div></div>})}, 5000)
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
                        : <div>
                            {this.state.banner}
                            <h1>Controllers</h1>
                            {
                                this.state.controllers.length > 0
                                    ? this.state.controllers.map(controller => {
                                        return <Controller key={controller.controllerId} id={controller.controllerId} name={controller.controllerName} ports={controller.ports} setBanner={this.setBanner.bind(this)}/>
                                    })
                                    : <p>No controllers.</p>
                            }
                            <h1>Unassigned Sensors</h1>
                            {
                                this.state.sensors.length > 0
                                    ? this.state.sensors.map(sensor => {
                                        return <Sensor key={sensor.sensorId} id={sensor.sensorId} name={sensor.sensorName} setBanner={this.setBanner.bind(this)}/>
                                    })
                                    : <p className="text-center">No unassigned sensors.</p>
                            }
                        </div>

                }
            </div>
        );
    }
}

export default Devices;