import { GPoint3 } from "@cuboid3/g-physics";

export interface GameEvent {
  label: string
  position: GPoint3
  value: string
}