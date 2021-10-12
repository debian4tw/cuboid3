"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScenarioHooks = void 0;
class ScenarioHooks {
    constructor(scenario) {
    }
    afterUpdate(actor) {
    }
    init() {
    }
    onDestroy() {
    }
    checkWinCondition() {
        const teamLives = {
            1: 0,
            2: 0
        };
        for (const [key, value] of Object.entries(this.scenario.getRoleManager().getRoles())) {
            // console.log(key, value);
            const player = value.getPlayer();
            if (typeof player.team !== "undefined") {
                // console.log('count team live')
                teamLives[player.team] += player.getLives();
            }
            else {
                // @todo: no teams for now it means FFA so there is no win cond
                // later on this should be configurable by scenario
                return;
            }
        }
        /*this.gamePlayers.forEach((player: Player) => {
            //this.getScenario()
            if (typeof player.team !== "undefined") {
                console.log('count team live')
                teamLives[player.team]+= player.getLives()
            }
        })*/
        // @todo: move to some other place
        if (teamLives[1] === 0) {
            this.scenario.onTeamWon(2);
        }
        if (teamLives[2] === 0) {
            this.scenario.onTeamWon(1);
        }
    }
}
exports.ScenarioHooks = ScenarioHooks;
