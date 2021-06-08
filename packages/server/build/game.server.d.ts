/// <reference types="socket.io" />
import { Game } from '@cubic-eng/core';
import { IScenarioDefinition } from '@cubic-eng/core';
export declare class GameServer {
    private gameDefs;
    private games;
    private publicGamesManager;
    private network;
    private processedFrames;
    constructor(io: SocketIO.Server, gameDefs: IScenarioDefinition[]);
    private attachEvents;
    onGameStateChanged(gameId: string): void;
    onPlayerLostLive(gameId: string, roleLabel: string): void;
    createGame(gameId: string): Game;
    setRandomScenario(): void;
    getGamesList(): any[];
    iterateGames(): void;
    deleteGame(gameId: string): void;
    findGame(socket: SocketIO.Socket): Game | undefined;
    findGameById(gameId: string): Game | undefined;
    onClientConnect(socket: SocketIO.Socket, data: any): void;
    attachSocketEvents(socket: SocketIO.Socket): void;
    onClientDisconnect(socket: SocketIO.Socket): void;
    removeGame(gameId: string): void;
}
