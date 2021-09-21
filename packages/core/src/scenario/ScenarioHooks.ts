import { IScenario } from ".";
import { IActor } from "../actor";

export class ScenarioHooks {

  constructor(scenario: IScenario) {

  }

  afterUpdate(actor: IActor) {

  }

  init() {

  }

  onDestroy() {

  }

  checkWinCondition() {

  }
}

export interface IScenarioHooksClass {
  new (scenario: IScenario): ScenarioHooks
}