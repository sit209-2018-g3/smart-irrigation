import { EventEmitter } from "events";

import dispatcher from "../dispatcher";

class ControllerStore extends EventEmitter {
    constructor() {
        super()
        this.controllers = [];
    }

    getAll() {
        return this.controllers;
    }

    getOne(controllerId) {
        return this.controllers.find(item => {
            item.controllerId == controllerId;
        });
    }

    handleActions(action) {
        switch (action.type) {
            case "SET_CONTROLLERS": {
                this.controllers = action.controllers;
                this.emit("change");
                break;
            }
        }
    }
}

const controllerStore = new ControllerStore();
dispatcher.register(controllerStore.handleActions.bind(controllerStore));

export default controllerStore;