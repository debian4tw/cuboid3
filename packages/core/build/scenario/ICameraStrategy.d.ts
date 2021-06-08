import * as THREE from "three";
export interface ICameraStrategy {
    setCameraParams(params: object): void;
    setupCamera(camera: THREE.Camera): void;
    updateCamera(camera: THREE.Camera): void;
}
