"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeometryFactory = void 0;
const g_physics_1 = require("@cuboid3/g-physics");
const THREE = __importStar(require("three"));
class GeometryFactory {
    static createGeometry(shape, rect) {
        switch (shape) {
            case g_physics_1.Shape.Box:
                return new THREE.BoxGeometry(rect.w, rect.h, rect.d);
            case g_physics_1.Shape.Circle:
                return new THREE.CircleGeometry(rect.w / 2, 12, 0);
            case g_physics_1.Shape.Cylinder:
                return new THREE.CylinderGeometry(rect.w / 2, rect.w / 2, rect.h, 4, 1);
            case g_physics_1.Shape.Sphere:
                return new THREE.SphereGeometry(rect.w / 2, 12, 10);
        }
    }
}
exports.GeometryFactory = GeometryFactory;
