import { Random } from "../util";
import {
  ISpawnLocationManager,
  ISpawnLocationSlot,
  ISpawnLocationDef
} from "./ISpawnLocationManager";

export class SpawnLocationManager implements ISpawnLocationManager{

  spawnLocations: ISpawnLocationSlot[]
  spawnLocationsCount: number
  busyTime = 8 * 1000 // 8s

  constructor(spawnLocations: ISpawnLocationDef[]) {
    this.spawnLocations = []
    spawnLocations.forEach((spawnLoc) => {
      this.spawnLocations.push({
        busy: false,
        slot: spawnLoc
      })
    })
    this.spawnLocationsCount = spawnLocations.length
  }


  getNextAvailable(): ISpawnLocationDef {
    const loc = this.getFreeSlot()
    loc.busy = true
    setTimeout(() => {
      loc.busy = false
    }, this.busyTime)

    return loc.slot
  }

  private getFreeSlot(): ISpawnLocationSlot{
    let loc: ISpawnLocationSlot | undefined;
    loc = this.spawnLocations[Random.getRandomInt(this.spawnLocationsCount-1,0)]
    if(loc.busy === true) {
      loc = this.spawnLocations.find((item) => item.busy === false)
      if(!loc) {
        loc = this.spawnLocations[Random.getRandomInt(this.spawnLocationsCount-1,0)]
      }
    }
    return loc
  }

  getSlots() {
    return this.spawnLocations
  }
}