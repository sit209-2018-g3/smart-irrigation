import axios from "axios";
import dispatcher from "../dispatcher";

export function setUserId(userId) {
    dispatcher.dispatch({
        type: "SET_USERID",
        userId
    });
}

export function setUsername(username) {
    dispatcher.dispatch({
        type: "SET_USERNAME",
        username
    });
}

export function setFirstName(firstName) {
    dispatcher.dispatch({
        type: "SET_FIRSTNAME",
        firstName
    });
}

export function setLastName(lastName) {
    dispatcher.dispatch({
        type: "SET_LASTNAME",
        lastName
    });
}

export function fetchUser(userId) {
    axios.get(`${process.env.API_URL}/users/${userId}/details`)
        .then(res => {
            if (res.success) {
                dispatcher.dispatch({
                    type: "SET_USERID",
                    userId
                });
                dispatcher.dispatch({
                    type: "SET_USERNAME",
                    username: res.username
                });
                dispatcher.dispatch({
                    type: "SET_FIRSTNAME",
                    firstName: res.firstName
                });
                dispatcher.dispatch({
                    type: "SET_LASTNAME",
                    lastName: res.lastName
                });
            }
        })
        .catch(err => {
            console.log(`Error: ${err}.`);
        })
}