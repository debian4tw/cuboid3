"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollisionSystem = void 0;
//import {Actor} from '../../game/actor/Actor'
const GVector2_1 = require("../math/GVector2");
class CollisionSystem {
    static chance(chancePercent) {
        const max = 100;
        const min = 1;
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (num <= chancePercent) {
            return true;
        }
    }
    static getRoleLabelFromActorLabel(label) {
        return 'role' + label[label.length - 1];
    }
    static isCollidingWithOneOf(rect, act2) {
        for (let i = 0; i < act2.qty; i++) {
            if (act2.active[i] && CollisionSystem.AABBCollided(rect, act2.getIndexCoordsAndDimensions(i))) {
                return i;
            }
        }
        return -1;
    }
    static isCollidingWithOneOfOnXZ(rect, act2) {
        for (let i = 0; i < act2.qty; i++) {
            if (act2.active[i] && CollisionSystem.AABBCollidedOnXZ(rect, act2.getIndexCoordsAndDimensions(i))) {
                return i;
            }
        }
        return -1;
    }
    static AABBCollided(A, B) {
        // The sides of the rectangle angles
        let leftA, leftB, rightA, rightB, topA, topB, bottomA, bottomB;
        // Calculate the sides of rectangle A
        leftA = A.x;
        rightA = A.x + A.w;
        topA = A.y;
        bottomA = A.y + A.h;
        // Calculate the sides of rectangle B
        leftB = B.x;
        rightB = B.x + B.w;
        topB = B.y;
        bottomB = B.y + B.h;
        // Here we have the actual function that checks for a collision.
        // First thing the function does is take in the SDL_rectangles and calculate their sides.
        // If any of the sides from A are outside of B
        if (bottomA <= topB) {
            return false;
        }
        if (topA >= bottomB) {
            return false;
        }
        if (rightA <= leftB) {
            return false;
        }
        if (leftA >= rightB) {
            return false;
        }
        // If none of the sides from A are outside B
        return true;
    }
    static AABBCollidedOnXZ(A, B) {
        // The sides of the rectangle angles
        let leftA, leftB, rightA, rightB, topA, topB, bottomA, bottomB;
        // Calculate the sides of rectangle A
        leftA = A.x;
        rightA = A.x + A.w;
        topA = A.z;
        bottomA = A.z + A.d;
        // Calculate the sides of rectangle B
        leftB = B.x;
        rightB = B.x + B.w;
        topB = B.z;
        bottomB = B.z + B.d;
        // Here we have the actual function that checks for a collision.
        // First thing the function does is take in the SDL_rectangles and calculate their sides.
        // If any of the sides from A are outside of B
        if (bottomA <= topB) {
            return false;
        }
        if (topA >= bottomB) {
            return false;
        }
        if (rightA <= leftB) {
            return false;
        }
        if (leftA >= rightB) {
            return false;
        }
        // If none of the sides from A are outside B
        return true;
    }
    static rectanglesCollideSAT(rect1, rect2) {
        return CollisionSystem.checkRectangleOverlapSat(rect1, rect2) &&
            CollisionSystem.checkRectangleOverlapSat(rect2, rect1);
    }
    static checkRectangleOverlapSat(rect1, rect2) {
        const axisProy = [
            new GVector2_1.GVector2((rect1.getBottomRight().y - rect1.getBottomLeft().y) * -1, rect1.getBottomRight().x - rect1.getBottomLeft().x),
            new GVector2_1.GVector2((rect1.getTopLeft().y - rect1.getBottomLeft().y) * -1, rect1.getTopLeft().x - rect1.getBottomLeft().x)
        ];
        for (let i = 0; i < axisProy.length; i++) {
            let min_r1 = Infinity, max_r1 = -Infinity;
            rect1.getVerticesArray().forEach((v) => {
                const proyected = v.dotProduct(axisProy[i]);
                min_r1 = Math.min(min_r1, proyected);
                max_r1 = Math.max(max_r1, proyected);
            });
            let min_r2 = Infinity, max_r2 = -Infinity;
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
exports.CollisionSystem = CollisionSystem;
