"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnDemandCollisionManager = void 0;
class OnDemandCollisionManager {
    constructor(scenario, configCollisions) {
        this.scenario = scenario;
        this.scenarioCollisions = configCollisions;
        this.registeredCollisions = [];
    }
    init(gameId) {
        this.gameId = gameId;
    }
    update() {
        let checked = [];
        this.scenario.getActors().forEach((actor) => {
            if (typeof this.scenarioCollisions[actor.name] !== "undefined") {
                this.scenario.getActors().forEach((collidingActor) => {
                    //console.log("checking collisions for", actor.name)
                    //console.log(this.scenarioCollisions[actor.name])
                    if (actor === collidingActor) {
                        return;
                    }
                    if (typeof this.scenarioCollisions[actor.name].collisions[collidingActor.name] !== "undefined") {
                        //console.log('onDemandCollision gameId:', this.gameId)
                        this.scenarioCollisions[actor.name].collisions[collidingActor.name](this.scenario, actor, collidingActor);
                    }
                });
            }
        });
    }
    onActorRemove(actorLabel) {
    }
    onActorAdd(actorLabel) {
    }
}
exports.OnDemandCollisionManager = OnDemandCollisionManager;
