import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

import * as env from "../env";
import * as UserActions from "../actions/UserActions";

class Login extends Component {
    constructor() {
        super ()
        this.state = {
            username: '',
            password: '',
            banner: <div></div>
        }
        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    onUsernameChange(e) {
        this.setState({username: e.target.value});
    }

    onPasswordChange(e) {
        this.setState({password: e.target.value});
    }

    submit() {
        const { username, password } = this.state;
        axios.post(`${env.API_URL}/authenticate`, { username, password })
            .then(res => {
                res = res.data;
                if (res.success) {
                    UserActions.setUserId(res.userId);
                    UserActions.setFirstName(res.firstName);
                    UserActions.setLastName(res.LastName);
                    this.props.history.push("/");
                }
                else {
                    this.setState({
                        username: '',
                        password: '',
                        banner: <div><p className="alert alert-danger">{res.message}</p></div>
                    });
                }
            })
            .catch(error => {
                console.log(`Error: ${error}`);
            });
    }

    render() {
        return (
            <div>
                <h1>Login</h1>
                {this.state.banner}
                <div className="form-group">
                    <label htmlFor="user">Username</label>
                    <input type="text" className="form-control" value={this.state.username} onChange={this.onUsernameChange} />
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" value={this.state.password} onChange={this.onPasswordChange} />
                </div>
                <button className="btn btn-success" id="submit" onClick={this.submit}>Login</button>
                <p>Don't have an account? Register <Link to="/register">here</Link>.</p>
            </div>
        );
    }
}

export default Login;