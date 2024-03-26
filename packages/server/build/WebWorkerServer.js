"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebWorkerNetworkAdapter = void 0;
class WebWorkerNetworkAdapter {
    constructor(io) {
        this.io = io;
        // console.log('alllsockets', this.io.sockets)
    }
    onConnect(callback) {
        /*this.io.on("connect", (socket: SocketIO.Socket) => {
          callback(socket);
        });*/
        console.log("onconnet");
    }
    sendToRoom(gameId, eventName, data = null) {
        // this.io.to(game.getId()).emit('scenarioDiff', NetworkUtils.encodeString(JSON.stringify(status)))
        //this.io.to(gameId).emit(eventName, data);
        this.io.postMessage({ name: eventName, args: data });
    }
    sendToSocketId(socketId, eventName, data) {
        // this.io.sockets.connected[socketId].emit('primaryActorAdded', {actorId: actorId})
        // console.log("sendToSocketId", eventName, data)
        //this.io.sockets.connected[socketId]?.emit(eventName, data);
        this.io.postMessage({ name: eventName, args: data });
    }
    joinToRoom(socket, gameId) {
        //socket.join(gameId);
    }
    leaveRoom(socket, gameId) {
        //socket.leave(gameId);
    }
    getSocketbyId(socketId) {
        //return this.io.sockets.connected[socketId];
        return 123;
    }
}
exports.WebWorkerNetworkAdapter = WebWorkerNetworkAdapter;
