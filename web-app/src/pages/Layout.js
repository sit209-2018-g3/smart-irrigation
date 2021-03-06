import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

//Pages
import Devices from "../pages/Devices";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AddSensor from "../pages/AddSensor";
import AddController from "../pages/AddController";
import EditSensor from "../pages/EditSensor";
import EditController from "../pages/EditController";

// Components
import Navigation from "../components/layout/Navigation";
import Footer from "../components/layout/Footer";

class Layout extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Navigation history={Router.history} />
                    <div className="container">
                        <Route exact path="/" component={Devices} />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route path="/add-sensor" component={AddSensor} />
                        <Route path="/add-controller" component={AddController} />
                        <Route path="/sensors/:sensorId" component={EditSensor} />
                        <Route path="/controllers/:controllerId" component={EditController} />
                    </div>
                    <Footer />
                </div>
            </Router>
        );
    }
}

export default Layout;