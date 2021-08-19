import { IScenario } from ".";
import { IActor } from "../actor";
export declare class ScenarioHooks {
    constructor(scenario: IScenario);
    afterUpdate(actor: IActor): void;
    init(): void;
}
export interface IScenarioHooksClass {
    new (scenario: IScenario): ScenarioHooks;
}
