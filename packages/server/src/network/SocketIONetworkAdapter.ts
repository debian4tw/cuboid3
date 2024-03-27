import { Socket } from "socket.io";
import { INetworkAdapter } from "./INetworkAdapter";

export class SocketIONetworkAdapter implements INetworkAdapter {
  private io: SocketIO.Server;

  constructor(io: SocketIO.Server) {
    this.io = io;
    // console.log('alllsockets', this.io.sockets)
  }

  public onConnect(callback: (socket: SocketIO.Socket) => void) {
    this.io.on("connect", (socket: SocketIO.Socket) => {
      callback(socket);
    });
  }

  sendToRoom(gameId: string, eventName: string, data: object | null = null) {
    // this.io.to(game.getId()).emit('scenarioDiff', NetworkUtils.encodeString(JSON.stringify(status)))
    // @ts-ignore
    this.io.to(gameId).emit(eventName, data);
  }

  sendToSocketId(
    socketId: string,
    eventName: string,
    data: object | undefined
  ) {
    // this.io.sockets.connected[socketId].emit('primaryActorAdded', {actorId: actorId})
    // console.log("sendToSocketId", eventName, data)
    // @ts-ignore
    this.io.sockets.connected[socketId]?.emit(eventName, data);
  }

  joinToRoom(socket: SocketIO.Socket, gameId: string) {
    socket.join(gameId);
  }

  leaveRoom(socket: SocketIO.Socket, gameId: string) {
    socket.leave(gameId);
  }

  getSocketbyId(socketId: string) {
    return this.io.sockets.connected[socketId];
  }
}
