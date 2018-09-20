import React, { Component } from "react";

class LinkedSensor extends Component {
    
    render() {
        return (
            <div className="row">
                <div className="col-1">Port {this.props.port}:</div>
                <div className="col-11">{this.props.name} [{this.props.id}]</div>
            </div>
        )
    }
}

export default LinkedSensor;