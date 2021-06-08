import { GBox3 } from '../shape/GBox3';
export declare abstract class CollisionSAT3 {
    static rectanglesCollideSAT(rect1: GBox3, rect2: GBox3): boolean;
    static checkRectangleOverlapSat(rect1: GBox3, rect2: GBox3): boolean;
}
