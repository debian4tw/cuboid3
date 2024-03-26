import { Socket } from "socket.io";
import { INetworkAdapter } from "./INetworkAdapter";
export declare class SocketIONetworkAdapter implements INetworkAdapter {
    private io;
    constructor(io: SocketIO.Server);
    onConnect(callback: (socket: SocketIO.Socket) => void): void;
    sendToRoom(gameId: string, eventName: string, data?: object | null): void;
    sendToSocketId(socketId: string, eventName: string, data: object | undefined): void;
    joinToRoom(socket: SocketIO.Socket, gameId: string): void;
    leaveRoom(socket: SocketIO.Socket, gameId: string): void;
    getSocketbyId(socketId: string): Socket;
}
