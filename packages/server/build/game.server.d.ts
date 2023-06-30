/// <reference types="socket.io" />
import { Game, IGameHooksClass } from "@cuboid3/core";
import { IScenarioDefinition } from "@cuboid3/core";
export declare class GameServer {
    private gameDefs;
    private games;
    private publicGamesManager;
    private network;
    private processedFrames;
    gameHooksClass: IGameHooksClass;
    gameClassFactory: (id: string, importedScenarios: IScenarioDefinition[], gameHooksClass?: any) => Game;
    constructor(io: SocketIO.Server, gameDefs: IScenarioDefinition[], gameHooks: IGameHooksClass, gameClassFactory?: (id: string, importedScenarios: IScenarioDefinition[], gameHooksClass?: any) => Game);
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
