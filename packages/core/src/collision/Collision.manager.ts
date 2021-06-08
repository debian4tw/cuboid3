import { IScenario } from "../scenario/IScenario";
import { IActor } from "../actor/IActor";
import { ICollisionManager } from './ICollisionManager'

export class CollisionManager implements ICollisionManager {

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
    this.attemptRegisterCollision()
    this.iterateRegisteredCollisions()
  }

  removeRegisteredCollisionsForActorLabel(actorLabel: string) {
    this.registeredCollisions = this.registeredCollisions.filter((collision) => collision.name.indexOf(actorLabel) === -1)
  }

  onActorAdd() {

  }

  onActorRemove(actorLabel: string) {
    this.removeRegisteredCollisionsForActorLabel(actorLabel)
  }
 
  public attemptRegisterCollision() {
    this.scenarioCollisions.forEach((configCollision: any) => {
        if (this.registeredCollisions.find((regColl) => regColl.name === configCollision.name)) {
            //console.log(col.name, 'collision already registered')
            return
        }

        let implicatedScenarioActors: IActor[] = [];
        configCollision.actors.forEach((label: string) => {
            let act = this.scenario.findActorByLabel(label)
            if (act !== undefined) {
                implicatedScenarioActors.push(act)
            }
        })

        //check if all collision actors are loaded in scenario
        if (implicatedScenarioActors.length === configCollision.actors.length) {
            this.registeredCollisions.push({
                name: configCollision.name,
                cb: () => {
                    configCollision.callback(this.gameId, ...implicatedScenarioActors)
                }
            })
        }
    })
  }

  public iterateRegisteredCollisions() {
    this.registeredCollisions.forEach(collision => {
      collision.cb();
    })
  }
}