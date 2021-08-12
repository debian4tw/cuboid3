import * as THREE from "three";

import {EventHandler} from '@cuboid3/core'
import {ICameraStrategy} from '@cuboid3/core'
import { IActor } from "@cuboid3/core";
import { IScenarioDefinition } from "@cuboid3/core";

export class CameraHandler {

  private camera: THREE.PerspectiveCamera
  private followedMesh: THREE.Mesh | false
  private followedActor: IActor
  private cameraStrategy: ICameraStrategy | false

  private folowedActorId: string

  private strategies: any = {}

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera
    this.followedMesh = false
  }

  public getCamera() {
    return this.camera
  }

  public setFollowedActorId(actorId: string) {
    this.folowedActorId = actorId
  }

  public getFollowedActorId() {
    return this.folowedActorId
  }

  public updateCamera() {
    if (!this.followedMesh) {
      return
    }

    if (this.cameraStrategy !== false) {
      this.cameraStrategy.updateCamera(this.camera)
    }

  }

  public setCameraParams(params: object) {
    if (!this.followedMesh) {
      return
    }

    if (this.cameraStrategy !== false) {
      this.cameraStrategy.setCameraParams(params)
    }
  }

  public registerStrategy(actorName: string, strategyClass: new() => ICameraStrategy) {
    this.strategies[actorName] = strategyClass
  }

  public followSubject(actor: IActor, mesh: THREE.Mesh) {
    // console.log('CameraHandler:attaching followed subject', mesh)
    this.followedActor = actor
    this.followedMesh = mesh

    this.setCameraTop()

    const strategyForActor = this.findStrategyForActor(actor.name)
    if (!strategyForActor) {
      // tslint:disable-next-line:no-console
      console.log("cameraStrategy not found")
      this.cameraStrategy = false
      this.followedMesh = false
    } else {
      this.cameraStrategy = new strategyForActor(this.followedMesh, this.followedActor)
      if (this.cameraStrategy !== false) {
        this.cameraStrategy.setupCamera(this.camera)
      }
    }
  }

  findStrategyForActor(actorName: string) {
    if (typeof this.strategies[actorName] === "undefined") {
      return false
    }
    return this.strategies[actorName]
  }
  public registerStrategies(scenariosDefinition: IScenarioDefinition[]) {
    scenariosDefinition.forEach((scenarioDef) => {
      if (scenarioDef.cameraStrategy) {
        if (scenarioDef.cameraStrategy instanceof Array) {
          scenarioDef.cameraStrategy.forEach((camStrategy) => {
            this.registerStrategy(
              camStrategy.actorName,
              camStrategy.strategy
            )
          })
        } else {
          this.registerStrategy(
            scenarioDef.cameraStrategy.actorName,
            scenarioDef.cameraStrategy.strategy
          )
        }

      }
    })
  }
  init(scenarios: IScenarioDefinition[]) {
    // tslint:disable-next-line:no-console
    // console.log("init cameraHandler", )
    this.registerStrategies(scenarios)
    this.setDefaultCamera()
    this.attachEvents()

  }

  public attachEvents() {
    EventHandler.subscribe('scenarioChanged', () => {
      this.setDefaultCamera()
    })

    EventHandler.subscribe('setCameraParams', (params: any) => {
      this.setCameraParams(params)
    })
  }

  setDefaultCamera() {
    this.setCameraTop();
    this.setCameraBehind()
  }

  setCameraTop() {
    const centerX = 400;
    const centerY = 300;
    this.camera.position.x = centerX;
    this.camera.position.y = centerY;
    this.camera.position.z = 800;

    this.camera.rotation.x = 0;
    this.camera.rotation.y = 0;
    this.camera.rotation.z = 0;
  }


  setCameraBehind() {
    this.camera.position.x = -4800;
    this.camera.position.y = 1400;
    this.camera.position.z = -1800;

    this.camera.lookAt(0,100,400)
    return
  }
}