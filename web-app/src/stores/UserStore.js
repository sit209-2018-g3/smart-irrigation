import { EventEmitter } from "events";

import dispatcher from "../dispatcher";

class UserStore extends EventEmitter {
    constructor() {
        super()
        this.userId = "";
        this.firstName = "";
        this.lastName = "";
    }

    getUserId() {
        return this.userId;
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
                this.emit("change");
                break;
            }
            case "SET_FIRSTNAME": {
                this.firstName = action.firstName;
                this.emit("change");
                break;
            }
            case "SET_LASTNAME": {
                this.lastName = action.lastName;
                this.emit("change");
                break;
            }
            default: {
                break;
            }
        }
    }
}

const userStore = new UserStore();
dispatcher.register(userStore.handleActions.bind(userStore))

export default userStore;