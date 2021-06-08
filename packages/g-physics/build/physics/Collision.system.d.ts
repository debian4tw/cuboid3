import { Rectangle } from '../shape/rectangle';
export declare abstract class CollisionSystem {
    static chance(chancePercent: number): true | undefined;
    static getRoleLabelFromActorLabel(label: string): string;
    static isCollidingWithOneOf(rect: any, act2: any): number;
    static isCollidingWithOneOfOnXZ(rect: any, act2: any): number;
    static AABBCollided(A: any, B: any): boolean;
    static AABBCollidedOnXZ(A: any, B: any): boolean;
    static rectanglesCollideSAT(rect1: Rectangle, rect2: Rectangle): boolean;
    static checkRectangleOverlapSat(rect1: Rectangle, rect2: Rectangle): boolean;
}
