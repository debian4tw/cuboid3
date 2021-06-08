"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameEventBus = void 0;
class GameEventBus {
    constructor() {
        this.events = [];
    }
    addEvent(event) {
        this.events.push(event);
    }
    popEvents() {
        return this.events;
    }
    flush() {
        this.events = [];
    }
}
exports.GameEventBus = GameEventBus;
