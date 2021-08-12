"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollisionSAT2 = void 0;
/* eslint-disable camelcase */
const GVector2_1 = require("../math/GVector2");
class CollisionSAT2 {
    static rectanglesCollideSATOnXY(rect1, rect2) {
        return CollisionSAT2.checkRectangleOverlapSATOnXY(rect1, rect2) &&
            CollisionSAT2.checkRectangleOverlapSATOnXY(rect2, rect1);
    }
    static checkRectangleOverlapSATOnXY(rect1, rect2) {
        const axisProy = [
            new GVector2_1.GVector2((rect1.getBottomRight().y - rect1.getBottomLeft().y) * -1, rect1.getBottomRight().x - rect1.getBottomLeft().x),
            new GVector2_1.GVector2((rect1.getTopLeft().y - rect1.getBottomLeft().y) * -1, rect1.getTopLeft().x - rect1.getBottomLeft().x)
        ];
        for (let i = 0; i < axisProy.length; i++) {
            let min_r1 = Infinity;
            let max_r1 = -Infinity;
            rect1.getVerticesArray().forEach((v) => {
                const proyected = v.dotProduct(axisProy[i]);
                min_r1 = Math.min(min_r1, proyected);
                max_r1 = Math.max(max_r1, proyected);
            });
            let min_r2 = Infinity;
            let max_r2 = -Infinity;
            rect2.getVerticesArray().forEach((v) => {
                const proyected = v.dotProduct(axisProy[i]);
                min_r2 = Math.min(min_r2, proyected);
                max_r2 = Math.max(max_r2, proyected);
            });
            // console.log('MinMax', min_r1,max_r1, min_r2, max_r2)
            if (!(max_r2 >= min_r1 && max_r1 >= min_r2)) {
                return false;
            }
        }
        return true;
    }
}
exports.CollisionSAT2 = CollisionSAT2;
