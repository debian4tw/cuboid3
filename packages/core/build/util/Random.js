"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Random = void 0;
class Random {
    static getRandomInt(max, min) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
exports.Random = Random;
