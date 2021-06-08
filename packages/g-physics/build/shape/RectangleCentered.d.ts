import { GVector2 } from '../math/GVector2';
import { IRectangle } from './IRectangle';
export declare class RectangleCentered implements IRectangle {
    origin: GVector2;
    width: number;
    height: number;
    rotation: number;
    hypotenuse: number;
    baseVerticesAngle: number;
    constructor(origin: GVector2, width: number, height: number, rotation?: number);
    calculateHypotenuse(): void;
    calculateBaseVerticesAngle(): void;
    rotate(rotation: number): void;
    rotateOnPivot(pivot: GVector2, rotation: number): void;
    getBottomLeft(): GVector2;
    getTopLeft(): GVector2;
    getBottomRight(): GVector2;
    getTopRight(): GVector2;
    getVertices(): Object;
    getVerticesArray(): Array<GVector2>;
}
