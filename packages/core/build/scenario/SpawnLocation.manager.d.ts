import { ISpawnLocationManager, ISpawnLocationSlot, ISpawnLocationDef } from "./ISpawnLocationManager";
export declare class SpawnLocationManager implements ISpawnLocationManager {
    spawnLocations: ISpawnLocationSlot[];
    spawnLocationsCount: number;
    busyTime: number;
    constructor(spawnLocations: ISpawnLocationDef[]);
    getNextAvailable(team?: number): ISpawnLocationDef;
    private getFreeSlot;
    getSlots(): ISpawnLocationSlot[];
}
