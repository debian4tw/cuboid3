import * as io from "socket.io-client";
import * as THREE from "three";

import {Game} from '@cubic-eng/core';
import {EventHandler} from '@cubic-eng/core'
import { NetworkUtils } from "@cubic-eng/core";
import { GameEvent } from "@cubic-eng/core";
import { IScenarioDefinition } from "@cubic-eng/core";

import { ClientActorRegistry } from './client-actors/ClientActorRegistry';
import {InputHandler} from './InputHandler'
import {CameraHandler} from './CameraHandler'
import {AudioManager} from './managers/AudioManager'
import { RenderManager } from "./managers/RenderManager"

export class GameClient {
  private sock : SocketIOClient.Socket;
  private game: Game;
  private clientActorRegistry: ClientActorRegistry;
  private scene : THREE.Scene;
  private inputHandler: InputHandler
  private cameraHandler: CameraHandler
  private renderManager: RenderManager
  // private audioManager: any
  // private effect: any
  private url: string
  scenarioDefs: IScenarioDefinition[]

  clientScenarios: any = {}

  constructor(url: string, scenarioDefs: IScenarioDefinition[]) {
    this.url = url
    this.scenarioDefs = scenarioDefs
    // tslint:disable-next-line:no-console
    console.log('%c CubicEngine Started','color: white;font-weight:bold;background-color: black; padding:10px;')
    this.registerClientScenarios([])
  }

  public registerClientScenarios(importedScenarios: any[]) {
    importedScenarios.forEach((scenarioDefinition: any) => {
      this.clientScenarios[scenarioDefinition.name] = scenarioDefinition
    })
  }

  connect(name: string, gameId: any) {
    const params: any = {
      name,
      gameId
    }

    const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    this.sock =  io.connect(this.url, {
      query: queryString,
      // 'forceNew': true,
    })

    this.sock.on('connect_error', () => {
      // tslint:disable-next-line:no-console
      console.log('connect error')
      EventHandler.publish('client:connectError')
    })

    this.sock.on('connect', () => {
      EventHandler.publish('client:connected', name)

      this.attachNetworkEvents();

      this.scene = new THREE.Scene();

      this.game = new Game(gameId, this.scenarioDefs);
      this.clientActorRegistry = new ClientActorRegistry(this.game, this.scene);

      this.renderManager = new RenderManager()
      const {width, height} = this.renderManager.calculateCanvassize()

      this.cameraHandler = new CameraHandler(
        new THREE.PerspectiveCamera( 60, width/height, 0.1, 12000 )
      )
      this.cameraHandler.init(this.scenarioDefs)

      this.inputHandler = new InputHandler(this.sock, document, this.clientScenarios)
      this.inputHandler.init()

      this.renderManager.init(this.scene, this.cameraHandler)
    })

    this.sock.on("disconnect", () => {
      // console.log("client disconnected from server")
    })
  }

  disconnect() {
    if (typeof this.sock !== "undefined") {
      this.sock.disconnect()
    }
  }


  onSocketGameEvents(events: GameEvent[]) {
    if (typeof events === "undefined" || events.length === 0) {
      return
    }

    // @todo: refactor into polymorphic gameEventResolver.resolve()
    events.forEach((event) => {
      // console.log(event)
      if (event.label === 'gameCollision') {
        AudioManager.getInstance().play(event.value)
      }

      if (event.label === 'playerLostLive') {
        EventHandler.publish('client:playerLostLive', event.value)
      }

      if (event.label === 'swingMiss') {
        EventHandler.publish('client:swingMiss', event.position)
      }

    })
  }

  clientScenarioChange(status: any) {
    this.clientActorRegistry.clean()
    this.renderManager.clearThreeScene(this.scene)

    const scenarioId = this.game.scenariosNameMap[status.type]
    const scenarioDef = this.game.scenarios[scenarioId]

    if (!scenarioDef) {
      return
    }

    this.game.setScenario(scenarioId);

    if (typeof scenarioDef.initScene !== "undefined") {
      scenarioDef.initScene(this.scene);
    }

    if (typeof this.clientScenarios[scenarioDef.name] !== "undefined") {
      const cliScenarioDef = this.clientScenarios[scenarioDef.name]
      cliScenarioDef.uiComps?.forEach((comp: any) => {
        EventHandler.publish(
          'client:addUIComponent',
          comp
        )
      })
    }

    if (typeof scenarioDef.opts.lockScreen !== "undefined" && scenarioDef.opts.lockScreen === true) {
      EventHandler.publish('client:lockScreen')
    } else {
      EventHandler.publish('client:unlockScreen')
    }
  }

  onSocketStatus(status: any) {
    status = JSON.parse(NetworkUtils.decodeString(status))
    // console.log("onSocketStatus", status)
    this.onSocketGameEvents(status.events)
    if (status.type !== this.game.getScenarioName()) {
      this.clientScenarioChange(status)
    }

    if (typeof status.state === "undefined" || status.state.length === 0) {
      return
    }

    status.state.forEach((remoteObj : any) => {
      this.processRemoteActorObj(remoteObj)
    })

    this.cameraHandler.updateCamera()
    this.cleanupOldActorsObj(status)
  }

  onSocketDiff(status: any) {
    status = JSON.parse(NetworkUtils.decodeString(status))
    // console.log("onSocketDiff", status)
    this.onSocketGameEvents(status.events)
    if (typeof status.state === "undefined" || status.state.length === 0) {
      return
    }
    status.state.forEach((remoteObj : any) => {
      this.processRemoteActorDiffObj(remoteObj)
    })

    if (status.removed) {
      status.removed.forEach((removedId: string) => {
        this.clientActorRegistry.deleteById(removedId)
      })
    }
    this.cameraHandler.updateCamera()
  }

  cleanupOldActorsObj(status: any) {
    if (status.state.length < this.clientActorRegistry.getArr().length) {

      this.clientActorRegistry.getArr().forEach((cliAct) => {
        const found = status.state.find((remoteObj: any) => remoteObj.id === cliAct.id);
        if (!found) {
          this.clientActorRegistry.delete(cliAct);
        }
      })
    }
  }

  processRemoteActorObj(remoteObj: any) {
    // console.log(remoteObj);
    if (!this.validateRemoteObj(remoteObj)) {
      return
    }

    const cliAct = this.clientActorRegistry.findById(remoteObj.id);

    if(typeof cliAct === "undefined") {
      this.clientActorRegistry.create(
        this.game.getScenario().addRemoteActor(remoteObj)
      ).then((newCliAct) => {
        if (remoteObj.id === this.cameraHandler.getFollowedActorId()) {
          this.onPrimaryActorAdded(newCliAct.id)
        }
      })
    }

    if (typeof cliAct !== "undefined") {
      cliAct.updateActor(remoteObj)
      // @todo: update should be independent of receiving msg
      // probably should be called by render loop
      cliAct.update();
    }
  }

  processRemoteActorDiffObj(remoteObj: any) {
    if (typeof remoteObj.id === "undefined") {
      return
    }

    const cliAct = this.clientActorRegistry.findById(remoteObj.id);

    if (typeof cliAct !== "undefined") {
      cliAct.getActor().setProps(remoteObj)
      // @todo: update should be independent of receiving msg
      // probably should be called by render loop
      cliAct.update();
    } else {
      if (this.validateRemoteObj(remoteObj)) {
        // console.log("diff did not exist - creating", remoteObj.label, remoteObj)
        this.clientActorRegistry.create(
          this.game.getScenario().addRemoteActor(remoteObj)
        ).then((newCliAct) => {
          newCliAct.getActor().setProps(remoteObj)
          newCliAct.update();
        })
      }
    }
    // fow now ignoring if it doesnt exist,
    // it should probabl;y ask to the server for fullState of actor
  }


  validateRemoteObj(remoteObj: any) {
    if (typeof remoteObj.id === "undefined") {
      // tslint:disable-next-line:no-console
      console.log('id not defined on remoteObj')
      return false
    }
    if (typeof remoteObj.label === "undefined") {
      // tslint:disable-next-line:no-console
      console.log('label not defined on remoteObj', remoteObj)
      return false
    }
    if (typeof remoteObj.name === "undefined") {
      // tslint:disable-next-line:no-console
      console.log('name not defined on remoteObj')
      return false
    }
    return true
  }

  onGameStatus(gameStatus: any) {
    // console.log(gameStatus);
    this.game.setGameState(gameStatus)
    EventHandler.publish('gameStatus', gameStatus)
  }

  onPrimaryActorAdded(actorId: string) {
    // console.log('onPrimaryActorAdded', actorId)
    this.cameraHandler.setFollowedActorId(actorId)

    const cliActor = this.clientActorRegistry.findById(actorId)
    if (cliActor) {
      this.cameraHandler.followSubject(cliActor.getActor() ,cliActor.getMesh())
      EventHandler.publish('attachAudioListener', cliActor.getMesh())
      EventHandler.publish('client:primaryActorTypeAdded', cliActor.getActor().name)
    } else {
      // tslint:disable-next-line:no-console
      console.log('onPrimaryActorAdded: actor not found', actorId)
      // console.log(this.game.getScenario().getState())
    }

    // EventHandler.cleanEvent('client:actorDashed')
    EventHandler.subscribe('client:actorDashed', (actId: string) => {
      if (actorId === actId) {
        EventHandler.publish('client:dashReload')
      }
    })
    EventHandler.cleanEvent('client:playerLostLive')
    EventHandler.subscribe('client:playerLostLive', (actId: string) => {
      if (actorId === actId) {
        EventHandler.publish('client:displayRespawnOverlay')
        EventHandler.publish('client:resetStatsPanel')
      }
    })

  }

  onTeamWon(team: number) {
    EventHandler.publish('client:teamWon', team)
  }

  attachNetworkEvents() {
    this.sock.off('status')
    this.sock.off('pong')
    this.sock.off('gameStatus')
    this.sock.off('primaryActorAdded')
    this.sock.off('teamWon')
    this.sock.off('scenarioStatus')
    this.sock.off('pickRole')
    this.sock.off('levelIncreased')
    this.sock.off('scenarioDiff')
    this.sock.off('servMessage')

    this.sock.on('gameStatus', (gameStatus: any) => {
      this.onGameStatus(gameStatus)
    })
    this.sock.on('scenarioStatus', (status: any) => {
      this.onSocketStatus(status)
    })

    this.sock.on('scenarioDiff', (status: any) => {
      this.onSocketDiff(status)
    } )

    this.sock.on('primaryActorAdded', ( status: any) => {
      this.onPrimaryActorAdded(status.actorId)
    })

    this.sock.on('teamWon', ( team: any) => {
      // console.log('team won')
      this.onTeamWon(team)
    })

    this.sock.on('displayPickRole', () => {
      EventHandler.publish('client:displayPickRole')
    })

    this.sock.on('pong', (ms: any) => {
      const latency = ms;
      const container  = document.getElementById('latency');
      if (container !== null) {
        container.innerHTML = latency;
      }
    })

    this.sock.on("levelIncreased", () => {
      EventHandler.publish('client:levelIncreased')
    })

    this.sock.on("servMessage", (msg: {name: string, data: any}) => {
      // console.log("received servMessage", msg)
      EventHandler.publish('client:'+msg.name, msg.data)
    })
  }
}