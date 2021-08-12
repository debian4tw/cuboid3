import base64id from 'base64id';
import {IScenario} from '../scenario/IScenario'
import {Scenario} from '../scenario/Scenario'
import {EventHandler} from '../event/EventHandler'
import {GameEventBus} from '../event/GameEventBus'
import {Player} from '../player/player'

import { IScenarioDefinition } from '../scenario/IScenarioDefinition'
import { IGameHooks } from './IGameHooks';

export class Game {
  private id: string
  private gamePlayers: Player[]
  private scenario: IScenario;
  private switchInterval: any

  public scenarios: any = {}

  public scenariosNameMap: any = {}

  public gameEventBus: GameEventBus
  public createdAt: Date
  public timeLimit: number // seconds
  configuredSwitchLoop: any
  private gameHooks: IGameHooks

  constructor(id: string, importedScenarios: IScenarioDefinition[], gameHooksClass?: any) {
    this.id = id
    this.gamePlayers = []
    this.registerScenarios(importedScenarios)
    this.scenario = this.setScenario(1); // empty scenario
    this.switchInterval = false
    this.gameEventBus = new GameEventBus()
    this.attachEvents()
    if (gameHooksClass) {
      this.gameHooks = new gameHooksClass(this)
      this.configuredSwitchLoop = this.gameHooks.startScenarioSwitchLoop
    }

  }

  public registerScenarios(importedScenarios: IScenarioDefinition[]) {
    importedScenarios.forEach((scenarioDefinition: IScenarioDefinition) => {
      this.scenarios[scenarioDefinition.id] = scenarioDefinition
      this.scenariosNameMap[scenarioDefinition.name] = scenarioDefinition.id
    })
  }

  public getPlayersIds() {
    const ids: any = []
    this.gamePlayers.forEach((pl: Player ) => {
      ids.push(pl.getId())
    })

    return ids
  }
  public getRegisteredScenarios() {
    return this.scenarios
  }

  public attachEvents() {
    // placeholder
  }

  public getPlayersAmount() {
    //return this.gamePlayers.length
    const reducer: any = (accumulator: number, currentPlayer: Player) => accumulator + (currentPlayer.isBotPlayer() ? 0 : 1);
    let playersAmount = this.gamePlayers.reduce(reducer, 0)
    return playersAmount
  }

  public getPlayers() {
    return this.gamePlayers
  }

  public getPlayer(playerId: string) {
    return this.gamePlayers.filter((player) => player.getId() === playerId)[0]
  }

  public resetLives() {
    this.gamePlayers.forEach(player => {
      player.lives = 5
      player.resetScore()
    })
    // console.log('resetLives', this.id, this.gamePlayers);
    EventHandler.publish('gameStateChanged', this.id)
  }

  setScenario(scenarioId: number): IScenario  {
    if (typeof this.scenarios[scenarioId] === "undefined") {
      throw new Error((`scenarioId ${scenarioId} not found`))
    }

    const scenarioDefinition = this.scenarios[scenarioId]
        // @todo validate scenarioDefinition and throw explaining error message
    this.scenario = new Scenario(scenarioDefinition)

    this.onScenarioChange()
    return this.getScenario()
  }

  public onTeamWon(team: number) {
    // tslint:disable-next-line:no-console
    console.log('Team ', team, 'won')
    clearInterval(this.switchInterval)
    this.setEndScenario()
    // EventHandler.publish('server:teamWon', this.id, team)
  }

  public onScenarioChange() {
    EventHandler.publish('scenarioChanged', this.getScenarioName())
  }

  setEmptyScenario(): IScenario {
    clearInterval(this.switchInterval)
    const scenarioDef = this.scenarios[this.scenariosNameMap.empty]
    this.scenario = new Scenario(scenarioDef)
    return this.scenario;
  }

  setEndScenario(): IScenario {
    clearInterval(this.switchInterval)
    const scenarioDef = this.scenarios[this.scenariosNameMap.end]
    this.scenario = new Scenario(scenarioDef)
    return this.scenario;
  }

  getScenario() {
    return this.scenario;
  }

  getScenarioName(): string | null {
    if(this.scenario !== null) {
      return this.scenario.getName();
    }
    return null;
  }

  startScenarioSwitchLoop() {
    this.configuredSwitchLoop(this)

    /*console.log("eng game start scenarioswitch", this.id)
    const switchToId = 0
    clearInterval(this.switchInterval)

    this.setScenario(7).init(this.getPlayers(), this.id)

    this.resetLives()*/


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

  addPlayer(socketId: string, playerName: string, isBot: boolean = false) {
    //socket.join(this.id)
    const player = new Player(socketId, playerName, isBot)
    this.gamePlayers.push(player)
    if (this.scenario !== null) {
      this.scenario.addPlayer(player);
    }
  }

  removePlayer(socketId: string) {
    if (this.scenario !== null) {
      const player = this.getPlayer(socketId)
      const {minutes, seconds} = player.playedTime(new Date())
      // tslint:disable-next-line:no-console
      console.log(`Removing Player ${player.name} after ${minutes}:${seconds} playTime`)
      this.scenario.removePlayer(socketId);
    }
    this.gamePlayers = this.gamePlayers.filter(pl => pl.getId() !== socketId);
  }

  onPlayerCommand(playerId: string, command: string, value: any = false) {
    // console.log('Game:onPlayerCommand', playerId, command, value)
    if(this.scenario) {
      this.scenario.onRoleCommand(playerId, command, value)
    }
  }

  getId() {
    return this.id
  }

  getState() {
    const state: any = []
    this.gamePlayers.forEach((player) => {
      state.push(player.serialize())
    })
    return {
      createdAt: this.createdAt,
      timeLimit: this.timeLimit,
      state
    }
  }

  setGameState(state: any) {
    this.gamePlayers = state.state
  }


  getScenarioState() {
    let ret: any = {
      state: []
    };
    if(this.scenario) {
            // let start = performance.now()
      ret = this.scenario.getState()
            // let end = performance.now()
            // console.log('processed scenario step in: (ms)', end - start)
    }
        // ret.events = []
        // let events = this.gameEventBus.popEvents()
    if (this.gameEventBus.popEvents().length > 0) {
            // console.log('adding events', events)
      ret.events = this.gameEventBus.popEvents()
    }

    this.gameEventBus.flush()
    return ret;
  }

  getScenarioDiffState() {
    let ret: any = {
      state: []
    };
    if(this.scenario) {
            // let start = performance.now()
      ret = this.scenario.getDiffState()
            // let end = performance.now()
            // console.log('processed scenario step in: (ms)', end - start)
    }
    if (this.gameEventBus.popEvents().length > 0) {
            // console.log('adding events', events)
      ret.events = this.gameEventBus.popEvents()
    }
    this.gameEventBus.flush()
    return ret;
  }

  setState(state: any) {
    if (this.scenario !== null) {
      this.scenario.setState(state);
    }
  }

  onScenarioEvent(socketId: string, data: any) {
    this.scenario.onEvent(socketId, data)
  }

  setCreatedAt(createdAt: Date) {
    this.createdAt = new Date(createdAt)
  }

  setTimeLimit(timeLimit: number) {
    this.timeLimit = timeLimit
  }

  setSwitchInterval(switchInterval: any) {
    clearTimeout(this.switchInterval)
    clearInterval(this.switchInterval)
    this.switchInterval = switchInterval
  }

  beforeRemove() {
    clearTimeout(this.switchInterval)
    clearInterval(this.switchInterval)
  }

  public getBotPlayers() {
    return this.gamePlayers.filter(player => player.isBotPlayer())
  }

  addBot(botName: string) {
    this.addPlayer(base64id.generateId(), botName, true)
  }

  removeBot() {
      const bot = this.gamePlayers.find(player => player.isBotPlayer())
      if (!bot) {
          return
      }
      this.removePlayer(bot.getId())
  }

  //@todo: hooks, moght be mooved somewhere else

  onPlayerConnect() {
    this.gameHooks.onClientConnect(this)
  }

  onPlayerDisconnect() {
    this.gameHooks.onClientDisconnect(this)
  }

  onGameCreate() {
    this.gameHooks.onGameCreate(this)
  }
}