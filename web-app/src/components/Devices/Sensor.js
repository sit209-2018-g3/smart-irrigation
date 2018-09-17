import React, { Component } from "react";

class Sensor extends Component {
    render()
    {
        return (
            <div>
                <div className="row">
                    <div className="col-4">{this.props.name} [{this.props.id}]</div>
                    <div className="col-7"></div>
                    <div className="col-1">
                        <Link to={"/sensors/" + this.props.id}>Edit</Link>
                    </div>
                </div>
            </div>
            
        )
    }
}

export default Sensor;