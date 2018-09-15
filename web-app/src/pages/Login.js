import React, { Component } from 'react';
import axios from 'axios';

export default class Login extends Component {
    constructor(props) {
        super (props);
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
        axios.post(`${process.env.API_URL}/authenticate`, { username, password })
            .then(res => {
                res = res.data;
                if (res.success) {
                    // Update stores
                    // Redirect
                }
                else {
                    this.state.username = '';
                    this.state.password = '';
                    this.state.banner = <div><p className="alert alert-danger">{res.message}</p></div>;
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
                    <label for="user">Username</label>
                    <input type="text" class="form-control" value={this.state.username} onChange={this.onUsernameChange} />
                    <label for="password">Password</label>
                    <input type="password" class="form-control" value={this.state.password} onChange={this.onPasswordChange} />
                </div>
                <button className="btn btn-success" id="submit" onClick={this.submit}>Login</button>
                <p>Don't have an account? Register <NavLink to="/registration">here</NavLink>.</p>
            </div>
        );
    }
}