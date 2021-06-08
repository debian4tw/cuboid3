"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandler = void 0;
class EventHandler {
    constructor() {
        this.events = {};
    }
    static getInstance() {
        if (this.instance === null) {
            this.instance = new EventHandler();
        }
        return this.instance;
    }
    publish(eventName, ...args) {
        //console.log('publishEvent', eventName, ...args)
        if (typeof this.events[eventName] === "undefined") {
            return;
        }
        this.events[eventName].forEach((eventCallback) => {
            eventCallback(...args);
        });
    }
    subscribe(eventName, callback) {
        if (typeof this.events[eventName] === "undefined") {
            this.events[eventName] = [];
        }
        //console.log('subscribeEvent', eventName)
        this.events[eventName].push(callback);
    }
    cleanEvent(eventName) {
        this.events[eventName] = [];
    }
}
EventHandler.instance = null;
let handler = EventHandler.getInstance();
exports.EventHandler = handler;
