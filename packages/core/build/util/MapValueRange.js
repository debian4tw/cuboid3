"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapValueRange = void 0;
function MapValueRange(val, sourceMin, sourceMax, targetMin, targetMax) {
    const t = (val - sourceMin) / (sourceMax - sourceMin);
    return (targetMax - targetMin) * t + targetMin;
}
exports.MapValueRange = MapValueRange;
