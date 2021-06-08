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
exports.ClientSingleActor = void 0;
const THREE = __importStar(require("three"));
const ClientActor_1 = require("./ClientActor");
const GeometryFactory_1 = require("./GeometryFactory");
class ClientSingleActor extends ClientActor_1.ClientActor {
    constructor(actor) {
        super(actor);
        this.isMultiple = false;
        this.actor = actor;
        this.id = this.actor.getId();
    }
    update() {
        // this.actor.setState(status);
        this.updateMesh(this.actor);
        // this.actor.getState();
    }
    updateMesh(actor) {
        this.mesh.position.x = actor.getX() + actor.getW() / 2;
        this.mesh.position.y = actor.getY() + actor.getH() / 2;
        if (actor.getZ() !== 0) {
            this.mesh.position.z = actor.getZ() + actor.getD() / 2;
        }
        if (actor.isActive === 0) {
            this.mesh.visible = false;
        }
        else if (actor.isActive === 1) {
            this.mesh.visible = true;
        }
        this.mesh.rotation.z = actor.getR().z * Math.PI / 180;
        this.mesh.rotation.x = actor.getR().x * Math.PI / 180;
        this.mesh.rotation.y = actor.getR().y * Math.PI / 180;
    }
    createMesh(callback) {
        const geometry = GeometryFactory_1.GeometryFactory.createGeometry(this.actor.shape, this.actor.getCoordsAndDimensions());
        // @todo: vertexColors param?
        const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: this.actor.getColor(), vertexColors: true, wireframe: this.actor.wireframe })
        // color: 0x00ff00
        );
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        /*
        mesh.position.x = this.actor.getX() + this.actor.getW() / 2;
        mesh.position.y = this.actor.getY() + this.actor.getH() / 2;
        mesh.position.z = this.actor.getZ() ? (this.actor.getZ() + this.actor.getD() / 2) : 0
        */
        mesh.position.x = this.actor.getX() + this.actor.getW() / 2;
        mesh.position.y = this.actor.getY() + this.actor.getH() / 2;
        mesh.position.z = this.actor.getZ() ? (this.actor.getZ() + this.actor.getD() / 2) : 0;
        if (!this.actor.wireframe) {
            const geo = new THREE.EdgesGeometry(geometry);
            const mat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 8 });
            const geoWireframe = new THREE.LineSegments(geo, mat);
            mesh.add(geoWireframe);
            geoWireframe.renderOrder = 1;
        }
        // wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
        this.mesh = mesh;
        callback();
        return mesh;
    }
    getMesh() {
        return this.mesh;
    }
    addToScene(scene) {
        scene.add(this.mesh);
    }
}
exports.ClientSingleActor = ClientSingleActor;
