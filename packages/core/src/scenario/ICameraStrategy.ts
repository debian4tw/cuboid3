import * as THREE from "three";
import {Actor} from '../actor/Actor'

export interface ICameraStrategy{
  setCameraParams(params: object): void
  setupCamera(camera: THREE.Camera): void
  updateCamera(camera: THREE.Camera) :void
}