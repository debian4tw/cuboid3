import { IScenario } from "../scenario/IScenario";
import { ICollisionManager } from './ICollisionManager';
export declare class CollisionManager implements ICollisionManager {
    scenarioCollisions: any;
    registeredCollisions: any[];
    scenario: IScenario;
    gameId: string;
    constructor(scenario: IScenario, configCollisions: any);
    init(gameId: string): void;
    update(): void;
    removeRegisteredCollisionsForActorLabel(actorLabel: string): void;
    onActorAdd(): void;
    onActorRemove(actorLabel: string): void;
    attemptRegisterCollision(): void;
    iterateRegisteredCollisions(): void;
}
