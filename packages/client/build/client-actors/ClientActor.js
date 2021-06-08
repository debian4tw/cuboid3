"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientActor = void 0;
class ClientActor {
    //private scene: THREE.Scene;
    constructor(actor) {
        //this.scene = scene;
        this.actor = actor;
        //console.log('construct clientActor2', actor);
        //console.log('ClientActor:constructor with id', actor.getId())
        this.id = this.actor.getId();
        /*if (typeof this.actor.qty !== "undefined") {
          this.createMultipleMesh(this.actor);
        } else {*/
        //this.createMesh(this.actor);
        /*}*/
    }
    update() {
        //this.actor.setState(status);
        this.updateMesh(this.actor);
        //this.actor.getState();
    }
    updateActor(status) {
        var _a;
        (_a = this.actor) === null || _a === void 0 ? void 0 : _a.setState(status);
    }
    updateMesh(actor) {
        this.mesh.position.x = this.actor.getX();
        this.mesh.position.y = this.actor.getY();
    }
    createMesh(callback) {
    }
    addToScene(scene) {
    }
    getActor() {
        return this.actor;
    }
    getMesh() {
        return this.mesh;
    }
}
exports.ClientActor = ClientActor;
