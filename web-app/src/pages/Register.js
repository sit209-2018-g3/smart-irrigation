import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            confirmPassword: '',
            err: false,
            errMessage: ''
        }
        this.usernameChange = this.usernameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.confirmPasswordChange = this.confirmPasswordChange.bind(this);
        this.register = this.register.bind(this);
    }

    usernameChange(e) {
        this.setState({ username: e.target.value });
    }

    passwordChange(e) {
        this.setState({ password: e.target.value });
    }

    confirmPasswordChange(e) {
        this.setState({ confirmPassword: e.target.value });
    }

    register() {
        const user = this.state.username;
        const password = this.state.password;
        const confirm_password = this.state.confirmPassword;
        const isAdmin = false;
        if (password != confirm_password) {
            this.setState({
                err: true,
                errMessage: 'The passwords do not match',
            })
        } else {
            axios.post(`${API_URL}/register`, { user, password, isAdmin })
                .then(response => {
                    if (response.success) {
                        location.href = '/login';
                    } else {
                        $('#message').empty();
                        $('#message').append(`<p class="alert alert-danger">${response.message}</p>`);
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
                <div id="message"></div>
                <div className="form-group">
                    <label htmlFor="user">User</label>
                    <input type="text" className="form-control" value={this.state.username} onChange={this.state.usernameChange} />
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" value={this.state.password} onChange={this.passwordChange} />
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input type="password" className="form-control" value={this.state.confirmPassword} onChange={this.confirmPasswordChange} />
                </div>
                <button className="btn btn-success" onClick={this.register}>Register</button>
                <p>Already have an account? Login <NavLink to="/login">here</NavLink>.</p>
            </div>
        );
    }
}