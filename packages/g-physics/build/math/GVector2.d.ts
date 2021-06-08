export declare class GVector2 {
    x: number;
    y: number;
    constructor(x: number, y: number);
    getX(): number;
    sumScalar(scalar: number): void;
    dotProduct(vec: GVector2): number;
    clone(): GVector2;
    subtract(vec: GVector2): void;
    add(vec: GVector2): void;
    magnitude(): number;
    angle(): number;
    rotate(angle: number): void;
    rotate2D(angle: number): void;
}
