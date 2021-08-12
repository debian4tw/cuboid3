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
}
interface ISpawnLocationSlot {
    slot: ISpawnLocationDef;
    busy: boolean;
}
export declare class SpawnLocationManager {
    spawnLocations: ISpawnLocationSlot[];
    spawnLocationsCount: number;
    busyTime: number;
    constructor(spawnLocations: ISpawnLocationDef[]);
    getNextAvailable(): ISpawnLocationDef;
    private getFreeSlot;
    getSlots(): ISpawnLocationSlot[];
}
export {};
