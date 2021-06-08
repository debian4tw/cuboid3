export declare enum Axis {
    X = 0,
    Y = 1,
    Z = 2
}
import { GPoint3 } from './GPoint3';
export declare class GVector3 {
    x: number;
    y: number;
    z: number;
    private precision;
    constructor(x: number, y: number, z: number);
    copy(): GVector3;
    set(x: number, y: number, z: number): void;
    serialize(): GPoint3;
    subtract(vec: GVector3): GVector3;
    add(vec: GVector3): GVector3;
    addScalar(scalar: number): this;
    addScaledVector(vector: GVector3, scale: number): void;
    multiply(vec: GVector3): void;
    multiplyScalar(scalar: number): this;
    divideScalar(scalar: number): this;
    magnitude(): number;
    normalize(): GVector3;
    calculateAngleWithVector(vec: GVector3): number;
    calculateAngleOnPlaneXZ(vec: GVector3): number;
    dotProduct(vec: GVector3): number;
    crossProduct(vec: GVector3): GVector3;
    angleOnAxis(axis: Axis): number;
    rotate3D(angle: number, axis: Axis): void;
    rotateOnZ(angle: number): void;
    rotateOnX(angle: number): void;
    rotateOnY(angle: number): void;
}
