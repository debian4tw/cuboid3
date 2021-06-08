import { GVector3, Axis } from "../math/GVector3";
import { GParticle } from "../physics/GParticle";
import { GBox3Vertex, GRotationCoords } from './GBox3';
export declare class GBox4 {
    private nodes;
    origin: GParticle;
    private rotationX;
    private rotationY;
    private rotationZ;
    w: number;
    h: number;
    d: number;
    r: GRotationCoords;
    constructor(origin: GParticle, w: number, h: number, d: number, r?: GRotationCoords | null);
    serialize(): {
        x: number;
        y: number;
        z: number;
        r: {
            x: number;
            y: number;
            z: number;
        };
        w: number;
        h: number;
        d: number;
    };
    setRotation(r: GRotationCoords): void;
    getNodes(): any;
    getNode(vertex: GBox3Vertex): GVector3;
    move(x: number, y: number, z: number): void;
    moveNodes(x: number, y: number, z: number): void;
    moveX(x: number, moveOrigin?: boolean): void;
    moveY(y: number, moveOrigin?: boolean): void;
    moveZ(z: number, moveOrigin?: boolean): void;
    round(n: number): number;
    rotate(angle: number, axis: Axis): void;
    rotateZ(theta: number): void;
    rotateX(theta: number): void;
    private capAngle;
    rotateY(theta: number): void;
    rotateOnPivot(pivot: GVector3, angle: number, axis: Axis): void;
    rotateOnPivot2(pivot: GVector3, angle: number, axis: Axis): void;
}
