"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollisionManager = void 0;
class CollisionManager {
    constructor(scenario, configCollisions) {
        this.scenario = scenario;
        this.scenarioCollisions = configCollisions;
        this.registeredCollisions = [];
    }
    init(gameId) {
        this.gameId = gameId;
    }
    update() {
        this.attemptRegisterCollision();
        this.iterateRegisteredCollisions();
    }
    removeRegisteredCollisionsForActorLabel(actorLabel) {
        this.registeredCollisions = this.registeredCollisions.filter((collision) => collision.name.indexOf(actorLabel) === -1);
    }
    onActorAdd() {
    }
    onActorRemove(actorLabel) {
        this.removeRegisteredCollisionsForActorLabel(actorLabel);
    }
    attemptRegisterCollision() {
        this.scenarioCollisions.forEach((configCollision) => {
            if (this.registeredCollisions.find((regColl) => regColl.name === configCollision.name)) {
                //console.log(col.name, 'collision already registered')
                return;
            }
            let implicatedScenarioActors = [];
            configCollision.actors.forEach((label) => {
                let act = this.scenario.findActorByLabel(label);
                if (act !== undefined) {
                    implicatedScenarioActors.push(act);
                }
            });
            //check if all collision actors are loaded in scenario
            if (implicatedScenarioActors.length === configCollision.actors.length) {
                this.registeredCollisions.push({
                    name: configCollision.name,
                    cb: () => {
                        configCollision.callback(this.gameId, ...implicatedScenarioActors);
                    }
                });
            }
        });
    }
    iterateRegisteredCollisions() {
        this.registeredCollisions.forEach(collision => {
            collision.cb();
        });
    }
}
exports.CollisionManager = CollisionManager;
