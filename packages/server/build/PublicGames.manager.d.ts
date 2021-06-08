import { Game } from "@cubic-eng/core";
export declare class PublicGamesManager {
    private games;
    private maxPlayers;
    constructor();
    join(): void;
    getNextAvailableGame(): Game | undefined;
    addGame(game: Game): void;
    removeGame(gameId: string): void;
}
