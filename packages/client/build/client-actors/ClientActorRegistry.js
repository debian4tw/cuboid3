"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientActorRegistry = void 0;
const ClientActorFactory_1 = require("./ClientActorFactory");
const ClientMultipleActor_1 = require("./ClientMultipleActor");
const core_1 = require("@cubic-eng/core");
class ClientActorRegistry {
    constructor(game, scene, clientDefs) {
        this.scene = scene;
        this.clientActors = [];
        this.clientActorFactory = new ClientActorFactory_1.ClientActorFactory(clientDefs);
    }
    findById(id) {
        //console.log('getById', id, this.clientActors);
        return this.clientActors.find(cliActor => cliActor.id == id);
    }
    create(actor) {
        //let cliActor = ClientActorFactory.createClientActor(actor)
        let cliActor = this.clientActorFactory.createClientActorType(actor);
        this.clientActors.push(cliActor);
        return new Promise((resolve) => {
            cliActor.createMesh((child) => {
                cliActor.addToScene(this.scene);
                if (child !== undefined) {
                    child.addToScene(this.scene);
                }
                resolve(cliActor);
            });
        });
    }
    clean() {
        this.clientActors.forEach((cliActor) => {
            this.delete(cliActor);
        });
        this.clientActors = [];
        //this.scene.dispose()
    }
    delete(cliActor) {
        //console.log('deleteCliActor', cliActor);
        core_1.EventHandler.publish('remove2DCanvasUI', cliActor);
        if (cliActor instanceof ClientMultipleActor_1.ClientMultipleActor) {
            let me = cliActor.getMesh();
            for (let i = 0; i < me.length; i++) {
                this.scene.remove(me[i]);
            }
        }
        else {
            if (typeof cliActor.child !== "undefined") {
                console.log("Should delete child");
                this.scene.remove(cliActor.child.getMesh());
            }
            this.scene.remove(cliActor.getMesh());
        }
        this.clientActors = this.clientActors.filter(cliAct => cliAct.id != cliActor.id);
    }
    deleteById(actorId) {
        const cliAct = this.findById(actorId);
        if (cliAct) {
            this.delete(cliAct);
        }
    }
    getArr() {
        return this.clientActors;
    }
}
exports.ClientActorRegistry = ClientActorRegistry;
