import { IScenario } from "../scenario/IScenario";
export interface ICollisionManagerClass {
    new (scenario: IScenario, configCollisions: any): ICollisionManager;
}
export interface ICollisionManager {
    init(gameId: string): void;
    update(): void;
    onActorRemove(actorLabel: string): void;
    onActorAdd(actorlLabel: string): void;
}
