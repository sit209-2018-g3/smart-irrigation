import { EventEmitter } from "events";

import dispatcher from "../dispatcher";

class UserStore extends EventEmitter {
    constructor() {
        super()
        this.userId = "";
        this.username = "";
        this.firstName = "";
        this.lastName = "";
    }

    getUserId() {
        return this.userId;
    }

    getUsername() {
        return this.username;
    }

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.firstName;
    }

    handleActions(action) {
        switch (action.type) {
            case "SET_USERID": {
                this.userId = action.userId;
                break;
            }
            case "SET_USERNAME": {
                this.username = action.username;
                break;
            }
            case "SET_FIRSTNAME": {
                this.firstName = action.firstName;
                break;
            }
            case "SET_LASTNAME": {
                this.lastName = action.lastName;
                break;
            }
        }
    }
}

const userStore = new UserStore();
dispatcher.register(userStore.handleActions.bind(userStore))

export default userStore;