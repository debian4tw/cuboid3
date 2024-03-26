"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebWorkerLocalSocket = void 0;
const core_1 = require("@cuboid3/core");
/*
 * Fake socket interface wrapping onmessage/postMessage of WebWorkers
 * to be used by GameServer running on client browser
 */
class WebWorkerLocalSocket {
    constructor() {
        this.id = core_1.Random.getRandomInt(1000000, 100).toString();
        this.eventResolvers = {};
        this.attachOnMessage();
        this.rooms = {};
    }
    setHandshake(name, gameId) {
        //@todo: refactor each network adapter should know how to get data, no need to mimic socketio
        this.handshake = {
            query: {
                name,
                gameId,
            },
        };
    }
    join(gameId) {
        this.rooms[gameId] = {};
    }
    attachOnMessage() {
        onmessage = (ev) => {
            //console.log('WorkerSocketServer onmessage', ev);
            if (ev.data && typeof ev.data["name"] !== "undefined") {
                if (typeof ev.data["args"] !== "undefined" && ev.data["args"].length) {
                    this.eventResolvers[ev.data["name"]](...ev === null || ev === void 0 ? void 0 : ev.data["args"]);
                }
                else {
                    this.eventResolvers[ev.data["name"]]();
                }
            }
        };
    }
    /*connect() {
      postMessage({ name: "connect" }, "*");
    }*/
    on(event, callback) {
        this.eventResolvers[event] = callback;
    }
    off(event) {
        delete this.eventResolvers[event];
    }
    emit(name, ...args) {
        /*if (!this.eventResolvers.hasOwnProperty(name)) {
          return;
        }*/
        if (typeof args === "undefined" || args === null) {
            args = [];
        }
        // @ts-ignore
        postMessage({ name: name, args: args });
    }
    disconnect() { }
}
exports.WebWorkerLocalSocket = WebWorkerLocalSocket;
