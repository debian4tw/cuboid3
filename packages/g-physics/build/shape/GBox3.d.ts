import { GVector3, Axis } from "../math/GVector3";
export declare enum GBox3Vertex {
    RUF = 0,
    RDF = 1,
    LUF = 2,
    LDF = 3,
    RUB = 4,
    RDB = 5,
    LUB = 6,
    LDB = 7
}
export interface GRotationCoords {
    x: number;
    y: number;
    z: number;
}
export declare class GBox3 {
    private nodes;
    origin: GVector3;
    private rotationX;
    private rotationY;
    private rotationZ;
    w: number;
    h: number;
    d: number;
    r: GRotationCoords;
    constructor(origin: GVector3, w: number, h: number, d: number, r?: GRotationCoords | null);
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
    moveX(x: number): void;
    moveY(y: number): void;
    moveZ(z: number): void;
    round(n: number): number;
    rotateOnPivot2(pivot: GVector3, angle: number, axis: Axis): void;
    rotate(angle: number, axis: Axis): void;
    rotateZ(theta: number): void;
    rotateX(theta: number): void;
    private capAngle;
    rotateY(theta: number): void;
    rotateOnPivot(pivot: GVector3, angle: number, axis: Axis): void;
}
