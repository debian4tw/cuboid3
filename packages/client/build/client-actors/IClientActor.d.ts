import { IActor } from '@cubic-eng/core';
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
