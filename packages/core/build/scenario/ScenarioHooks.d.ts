import { IScenario } from ".";
import { IActor } from "../actor";
export declare class ScenarioHooks {
    constructor(scenario: IScenario);
    afterUpdate(actor: IActor): void;
    init(): void;
    onDestroy(): void;
    checkWinCondition(): void;
}
export interface IScenarioHooksClass {
    new (scenario: IScenario): ScenarioHooks;
}
