import axios from "axios";
import dispatcher from "../dispatcher";

export function setSensors(sensors) {
    dispatcher.dispatch({
        type: "SET_SENSORS",
        sensors
    });
}

export function fetchSensors(userId) {
    axios.get(`${process.env.API_URL}/users/${userId}/sensors`)
        .then(res => {
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