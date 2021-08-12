import { Actor, IActor } from '@cuboid3/core';
export interface IClientActor {
    id: string;
    update(): void;
    updateActor(status: string): void;
    updateMesh(actor: IActor): void;
    createMesh(callback: Function): void;
    addToScene(scene: THREE.Scene): void;
    getActor(): IActor;
    getMesh(): any;
}
export interface IClientActorConstructor {
    new (actor: Actor): IClientActor;
}
