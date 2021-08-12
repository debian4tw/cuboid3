import { Rectangle3 } from '@cuboid3/core';
import { Shape } from '@cuboid3/g-physics';
import * as THREE from "three";
export declare class GeometryFactory {
    static createGeometry(shape: Shape, rect: Rectangle3): THREE.BoxGeometry | THREE.CircleGeometry | THREE.CylinderGeometry | THREE.SphereGeometry;
}
