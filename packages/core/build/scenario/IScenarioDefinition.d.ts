import { ICollisionManagerClass } from "../collision/ICollisionManager";
import { IRoleManagerClass } from "../role/IRoleManager";
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
    roleManager?: IRoleManagerClass | undefined;
    collisionManager?: ICollisionManagerClass | undefined;
    initScene(scene: THREE.Scene): void;
    events?: any;
    uiComps?: any;
}
