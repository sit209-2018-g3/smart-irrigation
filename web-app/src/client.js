import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";

import Devices from "./pages/Devices";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";

require('dotenv').config();
const app = document.getElementById("app");

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={Layout}>
            <IndexRoute component={Devices}></IndexRoute>
            <Route path="login" component={Login}></Route>
            <Route path="register" component={Register}></Route>
        </Route>
    </Router>,
app);