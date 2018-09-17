import { EventEmitter } from "events";

import dispatcher from "../dispatcher";

class SensorStore extends EventEmitter {
    constructor() {
        super()
        this.sensors = [];
    }

    getAll() {
        return this.sensors
            ? this.sensors
            : []
    }

    getOne(sensorId) {
        return this.sensors
            ? this.sensors.find(item => {
                  return item.sensorId === sensorId;
              })
            : []
    }

    getLinkedTo(controllerId) {
        return this.sensors
            ? this.sensors.filter(item => {
                  return item.controllerId === controllerId;
              })
            : []
    }

    getUnlinked() {
        return this.sensors
            ? this.sensors.filter(item => {
                  return item.controllerId === '';
              })
            : []
    }

    handleActions(action) {
        switch (action.type) {
            case "SET_SENSORS": {
                this.sensors = action.sensors;
                this.emit("change");
                break;
            }
            default: {
                break;
            }
        }
    }
}

const sensorStore = new SensorStore();
dispatcher.register(sensorStore.handleActions.bind(sensorStore));

export default sensorStore;