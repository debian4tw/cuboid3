import { Socket } from "socket.io";

type GameSocket = Socket

export interface INetworkAdapter {

  onConnect(callback: Function): void

  sendToRoom(gameId: string, eventName: string, data: Object | null): void

  sendToSocketId(socketId: string, eventName: string, data?: Object): void

  joinToRoom(socket: GameSocket, gameId: string): void

  leaveRoom(socket: GameSocket, gameId: string): void

  getSocketbyId(socketId: string): any
}