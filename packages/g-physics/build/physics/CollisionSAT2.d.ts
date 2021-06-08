import { Rectangle } from '../shape/rectangle';
export declare abstract class CollisionSAT2 {
    static rectanglesCollideSATOnXY(rect1: Rectangle, rect2: Rectangle): boolean;
    static checkRectangleOverlapSATOnXY(rect1: Rectangle, rect2: Rectangle): boolean;
}
