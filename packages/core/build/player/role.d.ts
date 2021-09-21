import { Actor } from '../actor/Actor';
import { Player } from './player';
import { IActor } from '../actor/IActor';
import { ISpawnLocationDef } from '../scenario/ISpawnLocationManager';
import { IScenario } from '../scenario';
export declare class Role {
    player: Player;
    commands: any;
    actors: IActor[];
    primaryActorId: string;
    roleCommands: any;
    id: string;
    label: string;
    constructor(player: Player, roleCommands: any, config: any);
    setLabel(label: string): void;
    getLabel(): string;
    getPlayer(): Player;
    getId(): string;
    setPrimaryActorId(id: string): void;
    getPrimaryActorId(): string;
    respawn(location: ISpawnLocationDef): void;
    addCommands(actor: Actor, scenario: IScenario): void;
    runCommand(command: string, value?: any): void;
    addBehavior(scenario: IScenario, roleCommand: any): void;
}
