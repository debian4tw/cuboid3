"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIONetworkAdapter = void 0;
class SocketIONetworkAdapter {
    constructor(io) {
        this.io = io;
        // console.log('alllsockets', this.io.sockets)
    }
    onConnect(callback) {
        this.io.on("connect", (socket) => {
            callback(socket);
        });
    }
    sendToRoom(gameId, eventName, data = null) {
        // this.io.to(game.getId()).emit('scenarioDiff', NetworkUtils.encodeString(JSON.stringify(status)))
        this.io.to(gameId).emit(eventName, data);
    }
    sendToSocketId(socketId, eventName, data) {
        var _a;
        // this.io.sockets.connected[socketId].emit('primaryActorAdded', {actorId: actorId})
        // console.log("sendToSocketId", eventName, data)
        (_a = this.io.sockets.connected[socketId]) === null || _a === void 0 ? void 0 : _a.emit(eventName, data);
    }
    joinToRoom(socket, gameId) {
        socket.join(gameId);
    }
    leaveRoom(socket, gameId) {
        socket.leave(gameId);
    }
    getSocketbyId(socketId) {
        return this.io.sockets.connected[socketId];
    }
}
exports.SocketIONetworkAdapter = SocketIONetworkAdapter;
