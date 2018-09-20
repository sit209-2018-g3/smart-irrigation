import React, { Component } from "react";

/* React Components */
import LinkedSensor from "./Controller/LinkedSensor";

/* Flux Components */
import sensorStore from "../../stores/SensorStore";

class Controller extends Component {
    constructor(props) {
        super (props)
        this.state = {
            sensors: sensorStore.getLinkedTo(this.props.id)
        }
        this.onSensorStoreChange = this.onSensorStoreChange.bind(this);
    }

    componentWillMount() {
        sensorStore.on("change", this.onSensorStoreChange);
    }

    componentWillUnmount() {
        sensorStore.removeListener("change", this.onSensorStoreChange);
    }

    onSensorStoreChange() {
        this.setState({
            sensors: sensorStore.getLinkedTo(this.props.id)
        })
    }

    render()
    {
        var rowStyle = {
            'fontWeight': 'bold'
        }
        return (
            <div>
                <div className="row" style={rowStyle}>
                    <div className="col-4">{this.props.name} [{this.props.id}]</div>
                    <div className="col-4"></div>
                    <div className="col-1">{this.props.ports} Port{this.props.port > 1 ? 's' : ''}</div>
                    <div className="col-3">{this.state.sensors.length} Linked Sensor{this.state.sensors.length === 1 ? '' : 's'}</div>
                </div>
                {this.state.sensors.length > 0
                    ?   this.state.sensors.map(sensor => {
                            return <LinkedSensor key={sensor.sensorId} id={sensor.sensorId} name={sensor.sensorName} port={sensor.controllerPort} setBanner={this.props.setBanner}/>
                        })
                    :   <div>No Linked Sensors</div>
                }
            </div>
        )
    }
}

export default Controller;