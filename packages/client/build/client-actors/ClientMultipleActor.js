"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientMultipleActor = void 0;
const THREE = __importStar(require("three"));
const ClientActor_1 = require("./ClientActor");
const GeometryFactory_1 = require("./GeometryFactory");
const g_physics_1 = require("@cubic-eng/g-physics");
class ClientMultipleActor extends ClientActor_1.ClientActor {
    constructor(actor) {
        super(actor);
        this.isMultiple = true;
        this.id = actor.getId();
        this.actor = actor;
        // console.log("multiple check actor", this.actor)
        this.multipleMesh = [];
    }
    update() {
        this.updateMesh(this.actor);
    }
    updateMesh(actor) {
        for (var i = 0; i < actor.qty; i++) {
            if (actor.active[i]) {
                this.multipleMesh[i].visible = true;
            }
            else {
                this.multipleMesh[i].visible = false;
            }
            this.multipleMesh[i].position.x = actor.rectangle[i].x + actor.rectangle[i].w / 2;
            this.multipleMesh[i].position.y = actor.rectangle[i].y + actor.rectangle[i].h / 2;
            if (typeof actor.rectangle[i].z !== "undefined" && actor.rectangle[i].z !== 0) {
                this.multipleMesh[i].position.z = actor.rectangle[i].z + actor.rectangle[i].h / 2;
            }
        }
    }
    createMesh(callback) {
        console.log('createMultipleMesh', this.actor.name, this.actor.shape);
        this.multipleMesh = [];
        for (let i = 0; i < this.actor.qty; i++) {
            let mesh = new THREE.Mesh(GeometryFactory_1.GeometryFactory.createGeometry(this.actor.shape, this.actor.getIndexCoordsAndDimensions(i)), new THREE.MeshBasicMaterial({ color: this.actor.getColor(), wireframe: false }));
            //mesh.receiveShadow = true;
            //mesh.castShadow = true;
            mesh.position.x = this.actor.rectangle[i].x + this.actor.rectangle[i].w / 2;
            mesh.position.y = this.actor.rectangle[i].y + this.actor.rectangle[i].h / 2;
            mesh.position.z = (this.actor.rectangle[i].z + this.actor.rectangle[i].d / 2) | 0;
            if (!this.actor.wireframe && this.actor.shape !== g_physics_1.Shape.Sphere) {
                var geo = new THREE.EdgesGeometry(mesh.geometry);
                var mat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 8 });
                var geoWireframe = new THREE.LineSegments(geo, mat);
                mesh.add(geoWireframe);
                geoWireframe.renderOrder = 1;
                //wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
            }
            if (this.actor.active[i]) {
                mesh.visible = true;
            }
            this.multipleMesh.push(mesh);
        }
        callback();
        return this.multipleMesh;
    }
    addToScene(scene) {
        let me = this.getMesh();
        for (let i = 0; i < me.length; i++) {
            scene.add(me[i]);
        }
    }
    getMesh() {
        return this.multipleMesh;
    }
}
exports.ClientMultipleActor = ClientMultipleActor;
