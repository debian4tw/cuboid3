import { IScenario } from ".";
import { IActor } from "../actor";

export class ScenarioHooks {

  constructor(scenario: IScenario) {

  }

  afterUpdate(actor: IActor) {

  }
}

export interface IScenarioHooksClass {
  new (scenario: IScenario): ScenarioHooks
}