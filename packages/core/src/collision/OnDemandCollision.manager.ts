import { ICollisionManager } from "./ICollisionManager";
import { IScenario } from "../scenario/IScenario";
import { Actor3 } from "../actor/Actor3";

export class OnDemandCollisionManager implements ICollisionManager{
  
  scenarioCollisions: any
  registeredCollisions: any[]
  scenario: IScenario
  gameId: string

  constructor(scenario: IScenario, configCollisions: any) {
    this.scenario = scenario

    this.scenarioCollisions = configCollisions
    this.registeredCollisions = []
  }


  init(gameId: string) {
    this.gameId = gameId
  }

  update() {

    let checked = []
    this.scenario.getActors().forEach((actor) => {
      if (typeof this.scenarioCollisions[actor.name] !== "undefined") {
        this.scenario.getActors().forEach((collidingActor) => {
          //console.log("checking collisions for", actor.name)
          //console.log(this.scenarioCollisions[actor.name])
          if (actor === collidingActor) {
            return
          }
          
          if (typeof this.scenarioCollisions[actor.name].collisions[collidingActor.name] !== "undefined") {
            //console.log('onDemandCollision gameId:', this.gameId)
            this.scenarioCollisions[actor.name].collisions[collidingActor.name](this.scenario, actor as Actor3, collidingActor as Actor3)
          }
        })
      }
    })

  }

  onActorRemove(actorLabel: string) {

  }

  onActorAdd(actorLabel: string) {

  }
}