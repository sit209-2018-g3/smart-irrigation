import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

//Pages
import Devices from "../pages/Devices";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Components
import Navigation from "../components/layout/Navigation";
import Footer from "../components/layout/Footer";

class Layout extends Component {
    render() {
        return (
            <Router>
                <div className="container">
                    <Navigation history={Router.history}/>
                    <Route exact path="/" component={Devices} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Footer />
                </div>
            </Router>
        );
    }
}

export default Layout;