"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const Scenario_1 = require("../scenario/Scenario");
const EventHandler_1 = require("../event/EventHandler");
const GameEventBus_1 = require("../event/GameEventBus");
const player_1 = require("../player/player");
class Game {
    constructor(id, importedScenarios) {
        this.scenarios = {};
        this.scenariosNameMap = {};
        console.log("*****v2 eng creating game");
        this.id = id;
        this.gamePlayers = [];
        this.registerScenarios(importedScenarios);
        this.scenario = this.setScenario(1); // empty scenario
        this.switchInterval = false;
        this.gameEventBus = new GameEventBus_1.GameEventBus();
        this.attachEvents();
    }
    registerScenarios(importedScenarios) {
        importedScenarios.forEach((scenarioDefinition) => {
            this.scenarios[scenarioDefinition.id] = scenarioDefinition;
            this.scenariosNameMap[scenarioDefinition.name] = scenarioDefinition.id;
        });
    }
    getPlayersIds() {
        const ids = [];
        this.gamePlayers.forEach((pl) => {
            ids.push(pl.getId());
        });
        return ids;
    }
    getRegisteredScenarios() {
        return this.scenarios;
    }
    attachEvents() {
        // placeholder
    }
    getPlayersAmount() {
        return this.gamePlayers.length;
    }
    getPlayers() {
        return this.gamePlayers;
    }
    getPlayer(playerId) {
        return this.gamePlayers.filter((player) => player.getId() === playerId)[0];
    }
    resetLives() {
        this.gamePlayers.forEach(player => {
            player.lives = 5;
        });
        // console.log('resetLives', this.id, this.gamePlayers);
        EventHandler_1.EventHandler.publish('gameStateChanged', this.id);
    }
    setScenario(scenarioId) {
        if (typeof this.scenarios[scenarioId] === "undefined") {
            throw new Error((`scenarioId ${scenarioId} not found`));
        }
        const scenarioDefinition = this.scenarios[scenarioId];
        // @todo validate scenarioDefinition and throw explaining error message
        this.scenario = new Scenario_1.Scenario(scenarioDefinition);
        this.onScenarioChange();
        return this.getScenario();
    }
    onTeamWon(team) {
        // tslint:disable-next-line:no-console
        console.log('Team ', team, 'won');
        clearInterval(this.switchInterval);
        this.setEndScenario();
        // EventHandler.publish('server:teamWon', this.id, team)
    }
    onScenarioChange() {
        EventHandler_1.EventHandler.publish('scenarioChanged', this.getScenarioName());
    }
    setEmptyScenario() {
        clearInterval(this.switchInterval);
        const scenarioDef = this.scenarios[this.scenariosNameMap.empty];
        this.scenario = new Scenario_1.Scenario(scenarioDef);
        return this.scenario;
    }
    setEndScenario() {
        clearInterval(this.switchInterval);
        const scenarioDef = this.scenarios[this.scenariosNameMap.end];
        this.scenario = new Scenario_1.Scenario(scenarioDef);
        return this.scenario;
    }
    getScenario() {
        return this.scenario;
    }
    getScenarioName() {
        if (this.scenario !== null) {
            return this.scenario.getName();
        }
        return null;
    }
    startScenarioSwitchLoop() {
        console.log("eng game start scenarioswitch", this.id);
        const switchToId = 0;
        clearInterval(this.switchInterval);
        this.setScenario(7).init(this.getPlayers(), this.id);
        setTimeout(() => {
            console.log("players", this.getPlayers());
            console.log("triggering roleSelected");
            this.getScenario().roleSelected(this.gamePlayers[0], 'axer');
        }, 8000);
        this.resetLives();
        // console.log('starting startScenarioSwitchLoop')
        /*this.switchInterval = setInterval(() => {
            if (this.getScenarioName() == 'empty') {
                switchToId = 1
            } else if(this.getScenarioName() == 'space'){
                switchToId = 2;
            } else if (this.getScenarioName() == 'kong'){
                switchToId = 3;
            } else if (this.getScenarioName() == 'cannon') {
                switchToId = 1
            }
            console.log(Date.now(), '*switching scenario to ', switchToId, this.id)
            this.setScenario(switchToId).init(this.getPlayers(), this.id)
        },25000);*/
    }
    addPlayer(socketId, playerName) {
        // socket.join(this.id)
        const player = new player_1.Player(socketId, playerName);
        this.gamePlayers.push(player);
        if (this.scenario !== null) {
            this.scenario.addPlayer(player);
        }
    }
    removePlayer(socketId) {
        if (this.scenario !== null) {
            const player = this.getPlayer(socketId);
            const { minutes, seconds } = player.playedTime(new Date());
            // tslint:disable-next-line:no-console
            console.log(`Removing Player ${player.name} after ${minutes}:${seconds} playTime`);
            this.scenario.removePlayer(socketId);
        }
        this.gamePlayers = this.gamePlayers.filter(pl => pl.getId() !== socketId);
    }
    onPlayerCommand(playerId, command, value = false) {
        // console.log('Game:onPlayerCommand', playerId, command, value)
        if (this.scenario) {
            this.scenario.onRoleCommand(playerId, command, value);
        }
    }
    getId() {
        return this.id;
    }
    getState() {
        const state = [];
        this.gamePlayers.forEach((player) => {
            state.push(player.serialize());
        });
        return {
            createdAt: Date.now(),
            state
        };
    }
    setGameState(state) {
        this.gamePlayers = state.state;
    }
    getScenarioState() {
        let ret = {
            state: []
        };
        if (this.scenario) {
            // let start = performance.now()
            ret = this.scenario.getState();
            // let end = performance.now()
            // console.log('processed scenario step in: (ms)', end - start)
        }
        // ret.events = []
        // let events = this.gameEventBus.popEvents()
        if (this.gameEventBus.popEvents().length > 0) {
            // console.log('adding events', events)
            ret.events = this.gameEventBus.popEvents();
        }
        this.gameEventBus.flush();
        return ret;
    }
    getScenarioDiffState() {
        let ret = {
            state: []
        };
        if (this.scenario) {
            // let start = performance.now()
            ret = this.scenario.getDiffState();
            // let end = performance.now()
            // console.log('processed scenario step in: (ms)', end - start)
        }
        if (this.gameEventBus.popEvents().length > 0) {
            // console.log('adding events', events)
            ret.events = this.gameEventBus.popEvents();
        }
        this.gameEventBus.flush();
        return ret;
    }
    setState(state) {
        if (this.scenario !== null) {
            this.scenario.setState(state);
        }
    }
    onScenarioEvent(socketId, data) {
        this.scenario.onEvent(socketId, data);
    }
}
exports.Game = Game;
