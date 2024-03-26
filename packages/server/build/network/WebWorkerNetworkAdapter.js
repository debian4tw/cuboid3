"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebWorkerNetworkAdapter = void 0;
const WebWorkerLocalSocket_1 = require("./WebWorkerLocalSocket");
class WebWorkerNetworkAdapter {
    constructor() {
        this.socket = new WebWorkerLocalSocket_1.WebWorkerLocalSocket();
    }
    onConnect(callback) {
        this.socket.on("connect", (name, gameId) => {
            // console.log('WebWorkerNetworkAdapter onconnect', name, gameId);
            this.socket.setHandshake(name, gameId);
            callback(this.socket);
            this.socket.emit("connect");
        });
    }
    sendToRoom(gameId, eventName, data = null) {
        // this.io.to(game.getId()).emit('scenarioDiff', NetworkUtils.encodeString(JSON.stringify(status)))
        this.socket.emit(eventName, data);
    }
    sendToSocketId(socketId, eventName, data) {
        // this.io.sockets.connected[socketId].emit('primaryActorAdded', {actorId: actorId})
        // console.log("sendToSocketId", eventName, data)
        this.socket.emit(eventName, data);
    }
    joinToRoom(socket, gameId) {
        this.socket.join(gameId);
    }
    leaveRoom(socket, gameId) {
        //socket.leave(gameId)
    }
    getSocketbyId(socketId) {
        return this.socket;
    }
}
exports.WebWorkerNetworkAdapter = WebWorkerNetworkAdapter;
