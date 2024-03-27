"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebWorkerLocalSocketClient = void 0;
const core_1 = require("@cuboid3/core");
/*
 * Fake socket interface wrapping onmessage/postMessage of WebWorker
 * To be used by GameClient talking with GameServer running on a
 * browser WebWorker
 */
class WebWorkerLocalSocketClient {
    constructor(worker) {
        this.worker = worker;
        this.id = core_1.Random.getRandomInt(1000000, 100).toString();
        this.eventResolvers = {};
        this.worker.onmessage = (ev) => {
            //console.log("this.worker.onmessage", ev.data["name"]);
            //console.log(this.eventResolvers);
            this.eventResolvers[ev.data["name"]](...ev.data["args"]);
        };
    }
    connect(name, gameId) {
        this.worker.postMessage({ name: "connect", args: [name, gameId] });
    }
    on(event, callback) {
        this.eventResolvers[event] = callback;
    }
    off(event) {
        delete this.eventResolvers[event];
    }
    emit(name, ...args) {
        this.worker.postMessage({ name, args });
    }
    disconnect() {
        this.worker.terminate();
    }
}
exports.WebWorkerLocalSocketClient = WebWorkerLocalSocketClient;
