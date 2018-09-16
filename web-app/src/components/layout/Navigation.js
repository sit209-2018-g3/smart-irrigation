import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import UserStore from "../../stores/UserStore";
import * as UserActions from "../../actions/UserActions";

class Navigation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isAuth: UserStore.getUserId() !== "" ? true : false
        };
        this.updateIsAuth = this.updateIsAuth.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentWillMount() {
        UserStore.on("change", this.updateIsAuth);
    }

    componentWillUnmount() {
        UserStore.removeListener("change", this.updateIsAuth);
    }

    updateIsAuth() {
        this.setState({
            isAuth: UserStore.getUserId() !== "" ? true : false
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
                    <a className="navbar-brand" href="/">TrackMe</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#expanded-nav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="expanded-nav">
                        <div className="navbar-nav">
                            <Link className="nav-item nav-link" to="/">Devices</Link>
                            {this.state.isAuth
                            ? <Link className="nav-item nav-link" to="/login" onClick={this.logout}>Logout</Link>
                            : <Link className="nav-item nav-link" to="/login">Login</Link>}
                        </div>
                    </div>
                </nav>
                
            </div>
        );
    }
}

export default Navigation;