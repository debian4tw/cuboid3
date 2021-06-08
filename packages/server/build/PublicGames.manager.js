"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicGamesManager = void 0;
class PublicGamesManager {
    constructor() {
        this.maxPlayers = 4;
        this.games = [];
    }
    join() {
        //
    }
    getNextAvailableGame() {
        return this.games.find((game) => game.getPlayersAmount() < this.maxPlayers);
    }
    addGame(game) {
        // tslint:disable-next-line:no-console
        console.log("adding public game v2", game.getId());
        this.games.push(game);
        game.startScenarioSwitchLoop();
        //console.log("force set scenario 7")
        //game.setScenario(7)
    }
    removeGame(gameId) {
        this.games = this.games.filter(game => game.getId() !== gameId);
    }
}
exports.PublicGamesManager = PublicGamesManager;
