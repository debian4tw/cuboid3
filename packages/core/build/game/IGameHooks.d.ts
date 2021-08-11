import { Game } from "./game";
export interface IGameHooks {
    startScenarioSwitchLoop(game: Game): void;
    onGameCreate(game: Game): void;
    onClientConnect(game: Game): void;
    onClientDisconnect(game: Game): void;
}
export interface IGameHooksClass {
    new (game: Game): IGameHooks;
}
