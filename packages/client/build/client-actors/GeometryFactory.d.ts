import { Rectangle3 } from '@cubic-eng/core';
import { Shape } from '@cubic-eng/g-physics';
import * as THREE from "three";
export declare class GeometryFactory {
    static createGeometry(shape: Shape, rect: Rectangle3): THREE.BoxGeometry | THREE.CircleGeometry | THREE.CylinderGeometry | THREE.SphereGeometry;
}
