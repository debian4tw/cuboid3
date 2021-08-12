import { Game, IGameHooksClass } from '@cuboid3/core';
import { IScenarioDefinition } from '@cuboid3/core';
import { Random, NetworkUtils } from '@cuboid3/core';
import {EventHandler} from '@cuboid3/core'

import {GPoint3} from '@cuboid3/g-physics'

import { PublicGamesManager} from "./PublicGames.manager"
import { SocketIONetworkAdapter } from './SocketIONetworkAdapter'
import { INetworkAdapter } from './INetworkAdapter';
// tslint:disable-next-line:no-var-requires
const { performance } = require("perf_hooks")


export class GameServer {
    // private io: SocketIO.Server
  private gameDefs: IScenarioDefinition[]
  private games: Game[];
  private publicGamesManager: PublicGamesManager
  private network: INetworkAdapter
  private processedFrames: number
  gameHooksClass: IGameHooksClass

  constructor(io: SocketIO.Server, gameDefs: IScenarioDefinition[], gameHooks: IGameHooksClass) {
    // tslint:disable-next-line:no-console
    console.log('Starting cuboid3 game server: version', process.env.npm_package_version)
    this.gameDefs = gameDefs
    this.games = [];
    this.publicGamesManager = new PublicGamesManager()
    this.processedFrames = 0
    this.network = new SocketIONetworkAdapter(io)
    this.gameHooksClass = gameHooks

    this.attachEvents()

    setInterval(() => {
      this.iterateGames()
    },30)

    this.network.onConnect((socket: SocketIO.Socket) => {
      const name: any = socket.handshake.query.name // | 'user'+ getRandomInt(10000,100) as any
      const gameId: any = socket.handshake.query.gameId

      // tslint:disable-next-line:no-console
      console.log('name connected', name)
      this.onClientConnect(socket, {name, gameId})
    })
  }

  private attachEvents() {
    EventHandler.subscribe('gameStateChanged', (gameId: string) => {
      this.onGameStateChanged(gameId)
    })

    EventHandler.subscribe('server:primaryActorAdded', ( socketId: string, actorId: string ) => {
      // console.log('primaryActorAdded', socketId, actorId)
      if (this.network.getSocketbyId(socketId)) {
        this.network.sendToSocketId(socketId, 'primaryActorAdded', {actorId})
      }
    })

    EventHandler.subscribe('playerLostLive', (gameId: string, position: GPoint3, roleLabel: string, actorId: string) => {
            // console.log('event playerLostLive', gameId, position, roleLabel, actorId)
      this.onPlayerLostLive(gameId, roleLabel)
      const game = this.findGameById(gameId)
      if (game !== undefined) {
        game.gameEventBus.addEvent({label: 'playerLostLive', position, value: actorId})
      }
    })

    EventHandler.subscribe('server:teamWon', (gameId: string, team: number) => {
      // console.log('Team ', team, 'won')
      const game = this.findGameById(gameId)
      if (!game) {
        return
      }
      game.onTeamWon(team)
      this.network.sendToRoom(gameId, 'teamWon', team)
    })

    EventHandler.subscribe('server:gameCollision', (gameId: string, position: GPoint3, label: string) => {
      // console.log('server:gameCollision', gameId)
      const game = this.findGameById(gameId)
      if (game !== undefined) {
        game.gameEventBus.addEvent({label: 'gameCollision', position, value: label})
      }
    })

    EventHandler.subscribe('server:gameEvent', (gameId: string, label: string, position: GPoint3, data: any) => {
      // console.log('server:gameCollision', gameId)
      const game = this.findGameById(gameId)
      if (game !== undefined) {
        game.gameEventBus.addEvent({label, position, value: data})
      }
    })

        // @todo: scenarioEvent sub
    EventHandler.subscribe('server:displayPickRole', (socketId: string) => {
      if (this.network.getSocketbyId(socketId)) {
        this.network.sendToSocketId(socketId, 'displayPickRole')
      }
    })

        // @todo: scenarioEvent sub
    EventHandler.subscribe('server:BotDied', (gameId: string, botLabel: string) => {
            // console.log('playerLostLive gameId', gameId)
      const game = this.findGameById(gameId)
      if (!game) {
        return;
      }
      const botRespawnTime = 6 * 1000
      setTimeout(() => {
        if (game) {
          game.getScenario().respawnActorByLabel(botLabel)
        }
      }, botRespawnTime);
    })

    EventHandler.subscribe('removeActor', (gameId: string, actorLabel: string) => {
      const game = this.findGameById(gameId)
      if (!game) {
        return
      }
      game.getScenario()?.removeActorByLabel(actorLabel);
    })

        /*EventHandler.subscribe('server:gameEnded', ( gameId: string, winner: string ) => {
            let game = this.findGameById(gameId)
            if (typeof game !== "undefined") {
                this.io.to(game.getId()).emit('gameEnded', {winner: winner})
            }
        })*/

    EventHandler.subscribe("sendSocketMessage", (socketId: string, msg: any) => {
            // console.log("sendSocketMessage", socketId, msg)
      this.network.sendToSocketId(socketId, "servMessage", msg)
    })
  }

  onGameStateChanged(gameId: string) {
    console.log("onGameStateChanged", gameId)
    const game = this.findGameById(gameId)
    console.log("gameId", gameId)
    if (game?.getId() === gameId) {
      const gameState = game?.getState()
      this.network.sendToRoom(game.getId(), 'gameStatus', gameState)
    }
  }

  onPlayerLostLive(gameId: string, roleLabel: string) {
    const game = this.findGameById(gameId)
    if (game) {
      const role = game.getScenario().findRoleByLabel(roleLabel)
      if (role) {
        role.getPlayer().removeLive()
                // console.log('playerLostLive', gameId, game.getId(), roleLabel)
                // EventHandler.publish('gameStateChanged', gameId)
        this.onGameStateChanged(gameId)
                // game.resetLives()
                // @todo: check if player won/lost
                // game.checkWinCondition()
        game.getScenario().checkWinCondition()
      }
    }
  }

  createGame(gameId: string) {
    // tslint:disable-next-line:no-console
    console.log('createGame from engv2', gameId)
    const game = new Game(gameId, this.gameDefs, this.gameHooksClass)
    this.games.push(game)

    return game
  }

  setRandomScenario() {
    //
  }

  getGamesList() {
    const gamesList : any[] = []
    this.games.forEach((game : Game) => {
      gamesList.push({
        id: game.getId(),
        playersAmount: game.getPlayersAmount()
      })
    })
    return gamesList
  }

  iterateGames() {
    if (this.games.length < 1) {
      return
    }

    this.games.forEach((game) => {
      // -- performance measure
      const start = performance.now()
      game.getScenario().update2()
      const updateTime = performance.now() - start

      const start1 = performance.now()
      game.getScenario().updateCollisions()
      const collisionsTime = performance.now() - start1

      const start2 = performance.now()
      const status = game.getScenarioDiffState()
      //const status = game.getScenarioState()
      const statusTime = performance.now() - start2

      const start3 = performance.now()
      //this.network.sendToRoom(game.getId(), 'scenarioStatus', NetworkUtils.encodeString(JSON.stringify(status)))
      this.network.sendToRoom(game.getId(), 'scenarioDiff', NetworkUtils.encodeString(JSON.stringify(status)))
      const emitTime = performance.now() - start3

      const totalTime = performance.now() - start
      if(totalTime > 4) {
                // "\x1b[31m",
                // console.log("LongF", totalTime, updateTime, collisionsTime, statusTime, emitTime)
      } else {
                // console.log(totalTime, updateTime, collisionsTime, statusTime, emitTime)
      }
    });

        /*this.processedFrames++
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
        }*/
  }


  deleteGame(gameId: string) {
    //
  }

  findGame(socket: SocketIO.Socket): Game | undefined{
    const gameId  = Object.keys(socket.rooms)[0]
    return this.findGameById(gameId)
  }

  findGameById(gameId: string) {
    return this.games.find(game => game.getId() === gameId)
  }

  onClientConnect(socket: SocketIO.Socket, data: any) {
    let joinGame: Game | undefined
    // tslint:disable-next-line:no-console
    console.log('client connected', data)
    if (typeof data.name === "undefined") {
      return
    }
        // gameId present?
    if (typeof data.gameId !== "undefined" && data.gameId !=="") {
      joinGame = this.findGameById(data.gameId)
      if (!joinGame) {
        joinGame = this.createGame(data.gameId)
      }
    } else {
      // tslint:disable-next-line:no-console
      console.log("no gameId, find or create public")
      joinGame = this.publicGamesManager.getNextAvailableGame()
      if (!joinGame) {
        const gameId = Random.getRandomInt(50000,1000).toString()
        joinGame = this.createGame(gameId)
        this.publicGamesManager.addGame(joinGame)

        joinGame.onGameCreate()
        // joinGame.getScenario().addBot(0, joinGame.getScenario().getSpawnLocationManager().getNextAvailable())
        // joinGame.getScenario().addBot(1, joinGame.getScenario().getSpawnLocationManager().getNextAvailable())
      } else {
                // remove bot
          joinGame.onPlayerConnect()
        //joinGame.getScenario().removeBot()
      }
    }

    if (joinGame !== undefined) {
            // this.games.push(joinGame)
      this.network.joinToRoom(socket, joinGame.getId())
      joinGame.addPlayer(socket.id, data.name)
     
            // @todo: send full msg, as scenarioStatus will be a diff
      this.network.sendToRoom(joinGame.getId(), 'gameStatus', joinGame.getState())

      this.network.sendToSocketId(socket.id, "scenarioStatus", JSON.stringify(joinGame.getScenario()?.getState()))

      this.attachSocketEvents(socket)
    }

  }

  attachSocketEvents(socket: SocketIO.Socket) {

    socket.on('playAgain', () => {
      const game = this.findGame(socket)
      if (game) {
        game.startScenarioSwitchLoop()
      }
    })

        // @todo: maybe transform it to roleSelected and keep it in game.server
    socket.on('heroSelected', (data) => {
      const game = this.findGame(socket)
      const roleName = data.hero;
            // console.log("heroSelected", data)
      if (game) {
        const player = game.getPlayer(socket.id)
        game.getScenario().roleSelected(player, roleName)
      }
      this.network.sendToSocketId(socket.id, "scenarioStatus", JSON.stringify(game?.getScenario().getState()))
    })

        // @todo: scenarioEvent - ok
    socket.on('respawn', () => {
      const game = this.findGame(socket)
      if (game) {
        const role = game.getScenario().findRoleById(socket.id)
        const location = game.getScenario().getSpawnLocationManager().getNextAvailable()
        role?.respawn(location)
      }
    })

    socket.on('scenarioEvent', (data) => {
            // console.log("received scenarioEvent", data)
      const game = this.findGame(socket)
      if (game) {
        game.onScenarioEvent(socket.id, data)
      }
    })

    socket.on('disconnecting', () => {
      // console.log('disconnecting')
      this.onClientDisconnect(socket)
    })

    socket.on('close', () => {
      // console.log('close socket')
      this.onClientDisconnect(socket)
    })

    socket.on('command', (data) => {
      // console.log('socket command', socket.id, data)
      let value = false;
      if (typeof data.value !== "undefined") {
        value = data.value
      }
      const game = this.findGame(socket)
      if (game) {
        game.onPlayerCommand(socket.id, data.label, value)
      }
    })
  }

  onClientDisconnect(socket: SocketIO.Socket) {
    const game = this.findGame(socket)
    if (game) {
      // console.log('******disconecting from: ', game.getId())
      // socket.leaveAll()
      game.removePlayer(socket.id);
      if (game.getPlayersAmount() > 0) {
        game.onPlayerDisconnect()
        EventHandler.publish('gameStateChanged', game.getId())
      } else {
        this.removeGame(game.getId())
      }

    }
  }

  removeGame(gameId: string) {
    console.log("removing game", gameId)
    this.publicGamesManager.removeGame(gameId)
    const game = this.findGameById(gameId)
    game?.beforeRemove()
    this.games = this.games.filter(game => game.getId() !== gameId)
  }
}