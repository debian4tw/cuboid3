import { GVector2 } from '../math/GVector2';
import { IRectangle } from './IRectangle';
export declare class Rectangle implements IRectangle {
    origin: GVector2;
    width: number;
    height: number;
    rotation: number;
    constructor(origin: GVector2, width: number, height: number, rotation?: number);
    rotate(rotation: number): void;
    getBottomLeft(): GVector2;
    getTopLeft(): GVector2;
    getBottomRight(): GVector2;
    getTopRight(): GVector2;
    getVertices(): Object;
    getVerticesArray(): Array<GVector2>;
}
