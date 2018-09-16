import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

import * as env from "../env";

class Register extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
            banner: <div></div>
        }
        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.onFirstNameChange = this.onFirstNameChange.bind(this);
        this.onLastNameChange = this.onLastNameChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onConfirmPasswordChange = this.onConfirmPasswordChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    onUsernameChange(e) {
        this.setState({ username: e.target.value });
    }

    onFirstNameChange(e) {
        this.setState({ firstName: e.target.value });
    }

    onLastNameChange(e) {
        this.setState({ lastName: e.target.value });
    }

    onPasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    onConfirmPasswordChange(e) {
        this.setState({ confirmPassword: e.target.value });
    }

    submit() {
        const { username, password, confirmPassword, firstName, lastName } = this.state;
        if (password !== confirmPassword) {
            this.setState({
                password: '',
                confirmPassword: '',
                banner: <div><p className="alert alert-danger">The entered passwords do not match.</p></div>
            });
        }
        else {
            axios.post(`${env.API_URL}/register`, { username, password, firstName, lastName })
                .then(res => {
                    res = res.data;
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
                    <label>Username</label>
                    <input type="text" className="form-control" value={this.state.username} onChange={this.onUsernameChange} />
                    <label>First Name</label>
                    <input type="text" className="form-control" value={this.state.firstName} onChange={this.onFirstNameChange} />
                    <label>Last Name</label>
                    <input type="text" className="form-control" value={this.state.lastName} onChange={this.onLastNameChange} />
                    <label>Password</label>
                    <input type="password" className="form-control" value={this.state.password} onChange={this.onPasswordChange} />
                    <label>Confirm Password</label>
                    <input type="password" className="form-control" value={this.state.confirmPassword} onChange={this.onConfirmPasswordChange} />
                </div>
                <button className="btn btn-success" onClick={this.submit}>Register</button>
                <p>Already have an account? Login <Link to="/login">here</Link>.</p>
            </div>
        );
    }
}

export default Register;