import { Axis } from "@cuboid3/g-physics";
export interface ISpawnLocationDef {
    loc: {
        x: number;
        y: number;
        z: number;
    };
    rot: {
        angle: number;
        axis: Axis;
    };
    team?: number;
}
export interface ISpawnLocationSlot {
    slot: ISpawnLocationDef;
    busy: boolean;
    team?: number;
}
export interface ISpawnLocationManager {
    getNextAvailable(team?: number): ISpawnLocationDef;
}
export interface ISpawnLocationManagerClass {
    new (spawnLocations: ISpawnLocationDef[]): ISpawnLocationManager;
}
