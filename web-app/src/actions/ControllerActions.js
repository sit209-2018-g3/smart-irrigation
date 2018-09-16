import axios from "axios";
import dispatcher from "../dispatcher";

import * as env from "../env";

export function setControllers(controllers) {
    dispatcher.dispatch({
        type: "SET_CONTROLLERS",
        controllers
    });
}

export function fetchControllers(userId) {
    axios.get(`${env.API_URL}/users/${userId}/controllers`)
        .then(res => {
            res = res.data;
            if (res.success) {
                dispatcher.dispatch({
                    type: "SET_CONTROLLERS",
                    controllers: res.controllers
                });
            }
        })
        .catch(err => {
            console.log(`Error: ${err}.`);
        })
}