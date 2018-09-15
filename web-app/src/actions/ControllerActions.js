import axios from "axios";
import dispatcher from "../dispatcher";

export function setControllers(controllers) {
    dispatcher.dispatch({
        type: "SET_SENSORS",
        controllers
    });
}

export function fetchControllers(userId) {
    axios.get(`${process.env.API_URL}/users/${userId}/controllers`)
        .then(res => {
            if (res.success) {
                dispatcher.dispatch({
                    type: "SET_SENSORS",
                    controllers: res.controllers
                });
            }
        })
        .catch(err => {
            console.log(`Error: ${err}.`);
        })
}