import { INetworkAdapter } from "../";
import { WebWorkerLocalSocket } from "./WebWorkerLocalSocket";

export class WebWorkerNetworkAdapter implements INetworkAdapter {
  socket: WebWorkerLocalSocket;

  constructor() {
    this.socket = new WebWorkerLocalSocket();
  }

  public onConnect(callback: (socket: SocketIO.Socket) => void) {
    this.socket.on("connect", (name: string, gameId: any) => {
      // console.log('WebWorkerNetworkAdapter onconnect', name, gameId);
      this.socket.setHandshake(name, gameId);
      callback(this.socket as unknown as SocketIO.Socket);
      this.socket.emit("connect");
    });
  }

  sendToRoom(gameId: string, eventName: string, data: object | null = null) {
    // this.io.to(game.getId()).emit('scenarioDiff', NetworkUtils.encodeString(JSON.stringify(status)))
    this.socket.emit(eventName, data);
  }

  sendToSocketId(
    socketId: string,
    eventName: string,
    data: object | undefined
  ) {
    // this.io.sockets.connected[socketId].emit('primaryActorAdded', {actorId: actorId})
    // console.log("sendToSocketId", eventName, data)
    this.socket.emit(eventName, data);
  }

  joinToRoom(socket: SocketIO.Socket, gameId: string) {
    this.socket.join(gameId);
  }

  leaveRoom(socket: SocketIO.Socket, gameId: string) {
    //socket.leave(gameId)
  }

  getSocketbyId(socketId: string) {
    return this.socket;
  }
}
