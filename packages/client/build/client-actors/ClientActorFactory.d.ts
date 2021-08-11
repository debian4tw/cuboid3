import { IActor } from '@cubic-eng/core';
import { ClientActorType } from '@cubic-eng/core';
import { IClientActor, IClientActorConstructor } from './IClientActor';
export declare class ClientActorFactory {
    cliActors: Map<ClientActorType, IClientActorConstructor>;
    constructor(clientDefs: any[]);
    createClientActorType(actor: IActor): IClientActor;
    registerClientActorType(label: ClientActorType, cliActor: IClientActorConstructor): void;
}
