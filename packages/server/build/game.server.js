"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameServer = void 0;
const core_1 = require("@cuboid3/core");
const core_2 = require("@cuboid3/core");
const core_3 = require("@cuboid3/core");
const PublicGames_manager_1 = require("./PublicGames.manager");
const SocketIONetworkAdapter_1 = require("./SocketIONetworkAdapter");
// tslint:disable-next-line:no-var-requires
const { performance } = require("perf_hooks");
class GameServer {
    constructor(io, gameDefs, gameHooks) {
        // tslint:disable-next-line:no-console
        console.log('Starting cuboid3 game server: version', process.env.npm_package_version);
        this.gameDefs = gameDefs;
        this.games = [];
        this.publicGamesManager = new PublicGames_manager_1.PublicGamesManager();
        this.processedFrames = 0;
        this.network = new SocketIONetworkAdapter_1.SocketIONetworkAdapter(io);
        this.gameHooksClass = gameHooks;
        this.attachEvents();
        setInterval(() => {
            this.iterateGames();
        }, 30);
        this.network.onConnect((socket) => {
            const name = socket.handshake.query.name; // | 'user'+ getRandomInt(10000,100) as any
            const gameId = socket.handshake.query.gameId;
            // tslint:disable-next-line:no-console
            console.log('name connected', name);
            this.onClientConnect(socket, { name, gameId });
        });
    }
    attachEvents() {
        core_3.EventHandler.subscribe('gameStateChanged', (gameId) => {
            this.onGameStateChanged(gameId);
        });
        core_3.EventHandler.subscribe('server:primaryActorAdded', (socketId, actorId) => {
            // console.log('primaryActorAdded', socketId, actorId)
            if (this.network.getSocketbyId(socketId)) {
                this.network.sendToSocketId(socketId, 'primaryActorAdded', { actorId });
            }
        });
        core_3.EventHandler.subscribe('playerLostLive', (gameId, position, roleLabel, actorId) => {
            // console.log('event playerLostLive', gameId, position, roleLabel, actorId)
            this.onPlayerLostLive(gameId, roleLabel);
            const game = this.findGameById(gameId);
            if (game !== undefined) {
                game.gameEventBus.addEvent({ label: 'playerLostLive', position, value: actorId });
            }
        });
        core_3.EventHandler.subscribe('server:teamWon', (gameId, team) => {
            // console.log('Team ', team, 'won')
            const game = this.findGameById(gameId);
            if (!game) {
                return;
            }
            game.onTeamWon(team);
            this.network.sendToRoom(gameId, 'teamWon', team);
        });
        core_3.EventHandler.subscribe('server:gameCollision', (gameId, position, label) => {
            // console.log('server:gameCollision', gameId)
            const game = this.findGameById(gameId);
            if (game !== undefined) {
                game.gameEventBus.addEvent({ label: 'gameCollision', position, value: label });
            }
        });
        core_3.EventHandler.subscribe('server:gameEvent', (gameId, label, position, data) => {
            // console.log('server:gameCollision', gameId)
            const game = this.findGameById(gameId);
            if (game !== undefined) {
                game.gameEventBus.addEvent({ label, position, value: data });
            }
        });
        // @todo: scenarioEvent sub
        core_3.EventHandler.subscribe('server:displayPickRole', (socketId) => {
            if (this.network.getSocketbyId(socketId)) {
                this.network.sendToSocketId(socketId, 'displayPickRole');
            }
        });
        // @todo: scenarioEvent sub
        core_3.EventHandler.subscribe('server:BotDied', (gameId, botLabel) => {
            // console.log('playerLostLive gameId', gameId)
            const game = this.findGameById(gameId);
            if (!game) {
                return;
            }
            const botRespawnTime = 6 * 1000;
            setTimeout(() => {
                if (game) {
                    game.getScenario().respawnActorByLabel(botLabel);
                }
            }, botRespawnTime);
        });
        core_3.EventHandler.subscribe('removeActor', (gameId, actorLabel) => {
            var _a;
            const game = this.findGameById(gameId);
            if (!game) {
                return;
            }
            (_a = game.getScenario()) === null || _a === void 0 ? void 0 : _a.removeActorByLabel(actorLabel);
        });
        /*EventHandler.subscribe('server:gameEnded', ( gameId: string, winner: string ) => {
            let game = this.findGameById(gameId)
            if (typeof game !== "undefined") {
                this.io.to(game.getId()).emit('gameEnded', {winner: winner})
            }
        })*/
        core_3.EventHandler.subscribe("sendSocketMessage", (socketId, msg) => {
            // console.log("sendSocketMessage", socketId, msg)
            this.network.sendToSocketId(socketId, "servMessage", msg);
        });
    }
    onGameStateChanged(gameId) {
        console.log("onGameStateChanged", gameId);
        const game = this.findGameById(gameId);
        console.log("gameId", gameId);
        if ((game === null || game === void 0 ? void 0 : game.getId()) === gameId) {
            const gameState = game === null || game === void 0 ? void 0 : game.getState();
            this.network.sendToRoom(game.getId(), 'gameStatus', gameState);
        }
    }
    onPlayerLostLive(gameId, roleLabel) {
        const game = this.findGameById(gameId);
        if (game) {
            const role = game.getScenario().findRoleByLabel(roleLabel);
            if (role) {
                role.getPlayer().removeLive();
                // console.log('playerLostLive', gameId, game.getId(), roleLabel)
                // EventHandler.publish('gameStateChanged', gameId)
                this.onGameStateChanged(gameId);
                // game.resetLives()
                // @todo: check if player won/lost
                // game.checkWinCondition()
                game.getScenario().checkWinCondition();
            }
        }
    }
    createGame(gameId) {
        // tslint:disable-next-line:no-console
        console.log('createGame from engv2', gameId);
        const game = new core_1.Game(gameId, this.gameDefs, this.gameHooksClass);
        this.games.push(game);
        return game;
    }
    setRandomScenario() {
        //
    }
    getGamesList() {
        const gamesList = [];
        this.games.forEach((game) => {
            gamesList.push({
                id: game.getId(),
                playersAmount: game.getPlayersAmount()
            });
        });
        return gamesList;
    }
    iterateGames() {
        if (this.games.length < 1) {
            return;
        }
        this.games.forEach((game) => {
            // -- performance measure
            const start = performance.now();
            game.getScenario().update2();
            const updateTime = performance.now() - start;
            const start1 = performance.now();
            game.getScenario().updateCollisions();
            const collisionsTime = performance.now() - start1;
            const start2 = performance.now();
            const status = game.getScenarioDiffState();
            //const status = game.getScenarioState()
            const statusTime = performance.now() - start2;
            const start3 = performance.now();
            //this.network.sendToRoom(game.getId(), 'scenarioStatus', NetworkUtils.encodeString(JSON.stringify(status)))
            this.network.sendToRoom(game.getId(), 'scenarioDiff', core_2.NetworkUtils.encodeString(JSON.stringify(status)));
            const emitTime = performance.now() - start3;
            const totalTime = performance.now() - start;
            /*
            if(totalTime > 4) {
              // "\x1b[31m",
              // console.log("LongF", totalTime, updateTime, collisionsTime, statusTime, emitTime)
            } else {
              // console.log(totalTime, updateTime, collisionsTime, statusTime, emitTime)
            }
            */
        });
        /*
        this.processedFrames++
        if (this.processedFrames > 60) {
            this.processedFrames = 0
            try {
                if (global.gc) {
                    //global.gc();
                    //global.gc(true);
                }
            } catch (e) {
                process.exit();
            }
        }
        */
    }
    deleteGame(gameId) {
        //
    }
    findGame(socket) {
        const gameId = Object.keys(socket.rooms)[0];
        return this.findGameById(gameId);
    }
    findGameById(gameId) {
        return this.games.find(game => game.getId() === gameId);
    }
    onClientConnect(socket, data) {
        var _a;
        let joinGame;
        // tslint:disable-next-line:no-console
        console.log('client connected', data);
        if (typeof data.name === "undefined") {
            return;
        }
        // gameId present?
        if (typeof data.gameId !== "undefined" && data.gameId !== "") {
            joinGame = this.findGameById(data.gameId);
            if (!joinGame) {
                joinGame = this.createGame(data.gameId);
            }
        }
        else {
            // tslint:disable-next-line:no-console
            console.log("no gameId, find or create public");
            joinGame = this.publicGamesManager.getNextAvailableGame();
            if (!joinGame) {
                const gameId = core_2.Random.getRandomInt(50000, 1000).toString();
                joinGame = this.createGame(gameId);
                this.publicGamesManager.addGame(joinGame);
                joinGame.onGameCreate();
            }
            else {
                // remove bot
                joinGame.onPlayerConnect();
                //joinGame.getScenario().removeBot()
            }
        }
        if (joinGame !== undefined) {
            // this.games.push(joinGame)
            this.network.joinToRoom(socket, joinGame.getId());
            joinGame.addPlayer(socket.id, data.name);
            // @todo: send full msg, as scenarioStatus will be a diff
            this.network.sendToRoom(joinGame.getId(), 'gameStatus', joinGame.getState());
            this.network.sendToSocketId(socket.id, "scenarioStatus", JSON.stringify((_a = joinGame.getScenario()) === null || _a === void 0 ? void 0 : _a.getState()));
            this.attachSocketEvents(socket);
        }
    }
    attachSocketEvents(socket) {
        socket.on('playAgain', () => {
            const game = this.findGame(socket);
            if (game) {
                game.startScenarioSwitchLoop();
            }
        });
        // @todo: maybe transform it to roleSelected and keep it in game.server
        socket.on('heroSelected', (data) => {
            const game = this.findGame(socket);
            const roleName = data.hero;
            // console.log("heroSelected", data)
            if (game) {
                const player = game.getPlayer(socket.id);
                game.getScenario().roleSelected(player, roleName);
            }
            this.network.sendToSocketId(socket.id, "scenarioStatus", JSON.stringify(game === null || game === void 0 ? void 0 : game.getScenario().getState()));
        });
        // @todo: scenarioEvent - ok
        socket.on('respawn', () => {
            var _a;
            const game = this.findGame(socket);
            if (game) {
                const role = game.getScenario().findRoleById(socket.id);
                const location = (_a = game.getScenario().getSpawnLocationManager()) === null || _a === void 0 ? void 0 : _a.getNextAvailable(role.getPlayer().team);
                if (location) {
                    role === null || role === void 0 ? void 0 : role.respawn(location);
                }
            }
        });
        socket.on('scenarioEvent', (data) => {
            // console.log("received scenarioEvent", data)
            const game = this.findGame(socket);
            if (game) {
                game.onScenarioEvent(socket.id, data);
            }
        });
        socket.on('disconnecting', () => {
            // console.log('disconnecting')
            this.onClientDisconnect(socket);
        });
        socket.on('close', () => {
            // console.log('close socket')
            this.onClientDisconnect(socket);
        });
        socket.on('command', (data) => {
            // console.log('socket command', socket.id, data)
            let value = false;
            if (typeof data.value !== "undefined") {
                value = data.value;
            }
            const game = this.findGame(socket);
            if (game) {
                game.onPlayerCommand(socket.id, data.label, value);
            }
        });
    }
    onClientDisconnect(socket) {
        const game = this.findGame(socket);
        if (game) {
            // console.log('******disconecting from: ', game.getId())
            // socket.leaveAll()
            game.removePlayer(socket.id);
            if (game.getPlayersAmount() > 0) {
                game.onPlayerDisconnect();
                core_3.EventHandler.publish('gameStateChanged', game.getId());
            }
            else {
                this.removeGame(game.getId());
            }
        }
    }
    removeGame(gameId) {
        console.log("removing game", gameId);
        this.publicGamesManager.removeGame(gameId);
        const game = this.findGameById(gameId);
        game === null || game === void 0 ? void 0 : game.beforeRemove();
        this.games = this.games.filter(game => game.getId() !== gameId);
    }
}
exports.GameServer = GameServer;
