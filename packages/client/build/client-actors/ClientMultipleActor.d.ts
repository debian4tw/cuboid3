import * as THREE from "three";
import { Actor } from '@cubic-eng/core';
import { ClientActor } from './ClientActor';
import { IClientActor } from "./IClientActor";
export declare class ClientMultipleActor extends ClientActor implements IClientActor {
    multipleMesh: Array<any>;
    id: string;
    isMultiple: boolean;
    protected actor: Actor;
    constructor(actor: Actor);
    update(): void;
    updateMesh(actor: Actor): void;
    createMesh(callback: Function): any[];
    addToScene(scene: THREE.Scene): void;
    getMesh(): any;
}
