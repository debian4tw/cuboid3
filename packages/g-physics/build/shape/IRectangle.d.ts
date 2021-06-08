import { GVector2 } from '../math/GVector2';
export interface IRectangle {
    rotate(rotation: number): void;
    getBottomLeft(): GVector2;
    getTopLeft(): GVector2;
    getBottomRight(): GVector2;
    getTopRight(): GVector2;
    getVertices(): Object;
    getVerticesArray(): Array<GVector2>;
}
