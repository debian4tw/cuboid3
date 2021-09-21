import { Axis } from "@cuboid3/g-physics";
import { ISpawnLocationDef } from "./ISpawnLocationManager";


export const spawnLocations: ISpawnLocationDef[] = [
  // 0
  {
    loc: {x: -4400, y: 0, z: -2900 },
    rot: {angle: 45, axis: Axis.Y}
  },
  // 1
  {
    loc: {x: -4400, y: 0, z: 2900 },
    rot: {angle: 135, axis: Axis.Y}
  },
  // 2
  {
    loc: {x: 4400, y: 0, z: -2900 },
    rot: {angle: -45, axis: Axis.Y}
  },
  // 3
  {
    loc: {x: 4400, y: 0, z: 2900 },
    rot: {angle: -135, axis: Axis.Y}
  },
  // 4
  {
    loc: {x:0, y:0 , z: -2900},
    rot: {angle: 0, axis: Axis.Y}
  }
  // ogre chief: {x:0, y:100, z:2900},
]