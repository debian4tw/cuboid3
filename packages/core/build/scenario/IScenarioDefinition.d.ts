import { ICollisionManagerClass } from "../collision/ICollisionManager";
import { IRoleManagerClass } from "../role/IRoleManager";
import { ISpawnLocationDef, ISpawnLocationManagerClass } from "./ISpawnLocationManager";
import { IScenarioHooksClass } from "./ScenarioHooks";
export interface IScenarioDefinition {
    id: number;
    name: string;
    opts: object;
    actors: object;
    envActors: any;
    roleActors: any;
    collisions: any;
    roleCommands: any;
    cameraStrategy: any;
    roleManager?: IRoleManagerClass;
    collisionManager?: ICollisionManagerClass;
    spawnLocationManager?: ISpawnLocationManagerClass;
    spawnLocations?: ISpawnLocationDef[];
    initScene(scene: THREE.Scene): void;
    events?: any;
    uiComps?: any;
    scenarioHooks?: IScenarioHooksClass;
}
