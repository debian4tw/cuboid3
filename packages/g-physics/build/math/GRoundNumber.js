"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GRoundNumber = void 0;
function GRoundNumber(number, precision = 10000) {
    return Math.round(((number) + Number.EPSILON) * precision) / precision;
}
exports.GRoundNumber = GRoundNumber;
