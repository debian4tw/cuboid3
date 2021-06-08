"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GVector3_1 = require("../math/GVector3");
//import * as THREE from 'three'
describe('Vector 3 Test', function () {
    it('should rotate 90 deg on Z', function () {
        let m1 = new GVector3_1.GVector3(4, 1, 1);
        m1.rotate3D(90, GVector3_1.Axis.Z);
        let result = m1;
        console.log('rotatec vec', m1);
        expect(result.x).toBe(-1);
        expect(result.y).toBe(4);
    });
    it('should rotate 90 deg on X', function () {
        let m1 = new GVector3_1.GVector3(4, 1, 0);
        m1.rotate3D(90, GVector3_1.Axis.X);
        let result = m1;
        console.log('rotatec vec', m1);
        expect(result.x).toBe(4);
        expect(result.y).toBe(0);
    });
});
describe('Vector 3 Normalize', function () {
    it('normalized should get direction only', function () {
        let m1 = new GVector3_1.GVector3(4, 1, -3);
        m1.normalize();
        /*
            x: 0.7844645405527362,
            y: 0.19611613513818404,
            z: -0.5883484054145521
        */
        expect(m1.serialize()).toEqual({
            x: 0.78446,
            y: 0.19612,
            z: -0.58835
        });
    });
});
describe('Vector3 crossProduct', function () {
    it('cross should get (0,2,0)', function () {
        let m1 = new GVector3_1.GVector3(1, 0, 1);
        let m2 = new GVector3_1.GVector3(1, 0, -1);
        let res = m1.crossProduct(m2);
        console.log('cross res', res);
        expect(res.serialize()).toEqual({
            x: 0,
            y: 2,
            z: 0
        });
    });
});
describe('Calculate Angle between vector', function () {
    it('should get 90', function () {
        let m1 = new GVector3_1.GVector3(1, 1, 0);
        let m2 = new GVector3_1.GVector3(-1, 1, 0);
        expect(m1.calculateAngleWithVector(m2)).toEqual(90);
    });
    it('should get 45', function () {
        let m1 = new GVector3_1.GVector3(1, 1, 0);
        let m2 = new GVector3_1.GVector3(1, 0, 0);
        expect(m1.calculateAngleWithVector(m2)).toEqual(45);
    });
    it('should get 180', function () {
        let m1 = new GVector3_1.GVector3(-1, 0, 0);
        let m2 = new GVector3_1.GVector3(1, 0, 0);
        expect(m1.calculateAngleWithVector(m2)).toEqual(180);
    });
    it('should get -45', function () {
        let m1 = new GVector3_1.GVector3(1, 0, 0);
        let m2 = new GVector3_1.GVector3(1, 0, -1);
        expect(m1.calculateAngleOnPlaneXZ(m2)).toEqual(-45);
    });
});
describe('calculateAngleOnPlaneXZ tests', function () {
    it('should return 0 angle for 0,0,0 vector', function () {
        let v1 = new GVector3_1.GVector3(4, 1, -3);
        let v2 = new GVector3_1.GVector3(0, 0, 0);
        let angle = v1.calculateAngleOnPlaneXZ(v2);
        expect(angle).toBe(0);
    });
});
