import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import UserStore from "../../stores/UserStore";
import * as UserActions from "../../actions/UserActions";

class Navigation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isAuthorised: UserStore.getUserId() !== "" ? true : false,
            user: UserStore.getFirstName()
        };
        this.onUserStoreChange = this.onUserStoreChange.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentWillMount() {
        UserStore.on("change", this.onUserStoreChange);
    }

    componentWillUnmount() {
        UserStore.removeListener("change", this.onUserStoreChange);
    }

    onUserStoreChange() {
        this.setState({
            isAuthorised: UserStore.getUserId() !== "" ? true : false,
            user: UserStore.getFirstName()
        })
    }

    logout(e) {
        UserActions.setUserId("");
        UserActions.setFirstName("");
        UserActions.setLastName("");
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" href="/">Smart Irrigation</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#expanded-nav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="expanded-nav">
                        {this.state.isAuthorised
                            ?   <div className="navbar-nav">
                                    <Link className="nav-item nav-link" to="/">Devices</Link>
                                    <Link className="nav-item nav-link" to = "/add-sensor">Add Sensor</Link>
                                    <Link className="nav-item nav-link" to = "/add-controller">Add Controller</Link>
                                    <Link className="nav-item nav-link" to="/login" onClick={this.logout}>Logout</Link>
                                </div>
                            :   <div className="navbar-nav">
                                    <Link className="nav-item nav-link" to="/login">Login</Link>
                                </div>
                        }
                    </div>
                </nav>
                
            </div>
        );
    }
}

export default Navigation;