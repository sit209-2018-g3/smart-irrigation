import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

import * as env from "../env";

class Register extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            confirmPassword: '',
            banner: <div></div>
        }
        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onConfirmPasswordChange = this.onConfirmPasswordChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    onUsernameChange(e) {
        this.setState({ username: e.target.value });
    }

    onPasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    onConfirmPasswordChange(e) {
        this.setState({ confirmPassword: e.target.value });
    }

    submit() {
        const { user, password, confirmPassword } = this.state;
        if (password !== confirmPassword) {
            this.setState({banner: <div><p className="alert alert-danger">The entered passwords do not match.</p></div>});
        }
        else {
            axios.post(`${env.API_URL}/register`, { user, password })
                .then(res => {
                    if (res.success) {
                        this.props.history.push("/login");
                    }
                    else {
                        this.setState({banner: <div><p className="alert alert-danger">{res.message}</p></div>});
                    }
                })
                .catch(error => {
                    console.error(`Error: ${error}`);
                });
        }
    }

    render() {
        return (
            <div>
                <h1>Registration</h1>
                {this.state.banner}
                <div className="form-group">
                    <label htmlFor="user">User</label>
                    <input type="text" className="form-control" value={this.state.username} onChange={this.onUsernameChange} />
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" value={this.state.password} onChange={this.onPasswordChange} />
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input type="password" className="form-control" value={this.state.confirmPassword} onChange={this.onConfirmPasswordChange} />
                </div>
                <button className="btn btn-success" onClick={this.submit}>Register</button>
                <p>Already have an account? Login <Link to="/login">here</Link>.</p>
            </div>
        );
    }
}

export default Register;