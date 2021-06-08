"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GVector2_1 = require("../math/GVector2");
describe('Vector Test', function () {
    it('should add', function () {
        let m1 = new GVector2_1.GVector2(1, 0);
        let m2 = new GVector2_1.GVector2(0, 1);
        m1.add(m2);
        let result = m1;
        expect(result.x).toBe(1);
        expect(result.y).toBe(1);
    });
    it('should rotate 90 deg around pivot', function () {
        let m1 = new GVector2_1.GVector2(4, 1);
        let v1 = new GVector2_1.GVector2(4, 1);
        //let v2 = v1.rotateAround(new THREE.Vector2(0,0), 90 * Math.PI / 180)
        m1.rotate(90);
        let result = m1;
        //console.log('three rotated', v1, v2)
        console.log('rotatec vec', m1);
        expect(result.x).toBe(-1);
        expect(result.y).toBe(4);
    });
    it('should rotate 90 deg rotate2D', function () {
        let m1 = new GVector2_1.GVector2(4, 1);
        m1.rotate2D(90);
        let result = m1;
        console.log('rotatec vec', m1);
        expect(result.x).toBe(-1);
        expect(result.y).toBe(4);
    });
});
