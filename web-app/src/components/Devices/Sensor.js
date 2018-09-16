import React, { Component } from "react";

class Sensor extends Component {
    render()
    {
        return (
            <div className="row">
                <div className="col-1">{this.props.id}</div>
                <div className="col-3">{this.props.name}</div>
                <div className="col-8"></div>
            </div>
        )
    }
}

export default Sensor;