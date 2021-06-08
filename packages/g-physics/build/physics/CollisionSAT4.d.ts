import { GBox4 } from '../shape/GBox4';
export declare abstract class CollisionSAT4 {
    static rectanglesCollideSAT(rect1: GBox4, rect2: GBox4): boolean;
    static checkRectangleOverlapSat(rect1: GBox4, rect2: GBox4): boolean;
}
