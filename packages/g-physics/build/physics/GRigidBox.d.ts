import { GVector3 } from '../math/GMath';
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
export declare type GBodyNode = {
    x: number;
    y: number;
    z: number;
};
export declare class GRigidBox {
    protected position: GVector3;
    protected velocity: GVector3;
    protected acceleration: GVector3;
    orientation: number;
    private mass;
    private inverseMass;
    private center;
    private nodes;
    forceAccum: GVector3;
    torqueAccum: GVector3;
    lastFrameAcceleration: GVector3;
    constructor();
}
