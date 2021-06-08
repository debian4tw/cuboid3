import { ICollisionManager } from "./ICollisionManager";
import { IScenario } from "../scenario/IScenario";
export declare class OnDemandCollisionManager implements ICollisionManager {
    scenarioCollisions: any;
    registeredCollisions: any[];
    scenario: IScenario;
    gameId: string;
    constructor(scenario: IScenario, configCollisions: any);
    init(gameId: string): void;
    update(): void;
    onActorRemove(actorLabel: string): void;
    onActorAdd(actorLabel: string): void;
}
