import { IScenario } from "./IScenario";
export interface IScenarioComponent {
    init(): void;
}
export interface IScenarioComponentClass {
    new (scenario?: IScenario): IScenarioComponent;
}
