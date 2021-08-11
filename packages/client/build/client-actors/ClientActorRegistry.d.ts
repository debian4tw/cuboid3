import * as THREE from "three";
import { Game } from '@cubic-eng/core';
import { IActor } from "@cubic-eng/core";
import { IClientActor } from ".";
export declare class ClientActorRegistry {
    private clientActors;
    private scene;
    private clientActorFactory;
    constructor(game: Game, scene: THREE.Scene, clientDefs: any[]);
    findById(id: string): IClientActor | undefined;
    create(actor: IActor): Promise<IClientActor>;
    clean(): void;
    delete(cliActor: IClientActor): void;
    deleteById(actorId: string): void;
    getArr(): IClientActor[];
}
