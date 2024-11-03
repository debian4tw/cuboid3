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
    hasEvents() {
        return this.events.length > 0;
    }
}
exports.GameEventBus = GameEventBus;
