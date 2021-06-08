import { IActor } from '@cubic-eng/core';
import * as THREE from "three";
import { IClientActor } from '.';
export declare class ClientActor implements IClientActor {
    protected mesh: THREE.Mesh;
    protected actor: IActor;
    id: string;
    constructor(actor: IActor);
    update(): void;
    updateActor(status: string): void;
    updateMesh(actor: IActor): void;
    createMesh(callback: Function): void;
    addToScene(scene: THREE.Scene): void;
    getActor(): IActor;
    getMesh(): any;
}
