"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnLocations = void 0;
const g_physics_1 = require("@cubic-eng/g-physics");
exports.spawnLocations = [
    // 0
    {
        loc: { x: -4400, y: 0, z: -2900 },
        rot: { angle: 45, axis: g_physics_1.Axis.Y }
    },
    // 1
    {
        loc: { x: -4400, y: 0, z: 2900 },
        rot: { angle: 135, axis: g_physics_1.Axis.Y }
    },
    // 2
    {
        loc: { x: 4400, y: 0, z: -2900 },
        rot: { angle: -45, axis: g_physics_1.Axis.Y }
    },
    // 3
    {
        loc: { x: 4400, y: 0, z: 2900 },
        rot: { angle: -135, axis: g_physics_1.Axis.Y }
    },
    // 4
    {
        loc: { x: 0, y: 0, z: -2900 },
        rot: { angle: 0, axis: g_physics_1.Axis.Y }
    }
    // ogre chief: {x:0, y:100, z:2900},
];
