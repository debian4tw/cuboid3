import * as THREE from "three";
import { ClientActor } from './ClientActor';
import { IActor } from "@cubic-eng/core";
export declare class ClientSingleTranslatedActor extends ClientActor {
    id: string;
    isMultiple: boolean;
    constructor(actor: IActor);
    update(): void;
    updateMesh(actor: IActor): void;
    createMesh(callback: Function): THREE.Mesh<THREE.BoxGeometry | THREE.CircleGeometry | THREE.CylinderGeometry | THREE.SphereGeometry, THREE.MeshBasicMaterial>;
    getMesh(): any;
    addToScene(scene: THREE.Scene): void;
}
