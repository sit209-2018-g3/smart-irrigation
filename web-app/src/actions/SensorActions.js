import axios from "axios";
import dispatcher from "../dispatcher";

import * as env from "../env";

export function setSensors(sensors) {
    dispatcher.dispatch({
        type: "SET_SENSORS",
        sensors
    });
}

export function fetchSensors(userId) {
    axios.get(`${env.API_URL}/users/${userId}/sensors`)
        .then(res => {
            res = res.data;
            if (res.success) {
                dispatcher.dispatch({
                    type: "SET_SENSORS",
                    sensors: res.sensors
                });
            }
        })
        .catch(err => {
            console.log(`Error: ${err}.`);
        })
}