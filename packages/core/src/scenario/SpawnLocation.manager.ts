import { Axis } from "@cubic-eng/g-physics";
import { Random } from "../util";
import { IScenario } from "./IScenario";

// import { spawnLocations} from './SpawnLocations'

export interface ISpawnLocationDef {
  loc: {x: number, y: number, z: number}
  rot: {angle: number, axis: Axis}
}

interface ISpawnLocationSlot {
  slot: ISpawnLocationDef,
  busy: boolean
}

const b: ISpawnLocationSlot = {
  slot: {
    loc: {x:1,y:1, z: 1},
    rot: {angle: 1, axis: Axis.Y},
  },
  busy: true,
}

export class SpawnLocationManager {

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