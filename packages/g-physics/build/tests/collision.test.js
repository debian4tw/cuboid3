"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collision_system_1 = require("../physics/collision.system");
const GVector2_1 = require("../math/GVector2");
const rectangle_1 = require("../shape/rectangle");
describe('SAT Rectangle Collision', function () {
    let r1 = new rectangle_1.Rectangle(new GVector2_1.GVector2(0, 0), 2, 2);
    let r2 = new rectangle_1.Rectangle(new GVector2_1.GVector2(1, 1), 2, 2);
    let result = collision_system_1.CollisionSystem.rectanglesCollideSAT(r1, r2);
    it('Overlapped should be colliding', function () {
        expect(result).toBe(true);
    });
    it('Should not be colliding', function () {
        let r3 = new rectangle_1.Rectangle(new GVector2_1.GVector2(0, 0), 3, 3);
        let r4 = new rectangle_1.Rectangle(new GVector2_1.GVector2(10, 10), 3, 3);
        let result = collision_system_1.CollisionSystem.rectanglesCollideSAT(r3, r4);
        expect(result).toBe(false);
    });
    it('Almost touching rects should not be colliding', function () {
        let r3 = new rectangle_1.Rectangle(new GVector2_1.GVector2(0, 0), 2, 2);
        let r4 = new rectangle_1.Rectangle(new GVector2_1.GVector2(0.5, 2.01), 2, 2);
        let result = collision_system_1.CollisionSystem.rectanglesCollideSAT(r3, r4);
        expect(result).toBe(false);
    });
    it('With rotation rects should be colliding', function () {
        let r3 = new rectangle_1.Rectangle(new GVector2_1.GVector2(0, 0), 2, 2, 45);
        let r4 = new rectangle_1.Rectangle(new GVector2_1.GVector2(0.5, 2.01), 2, 2);
        let result = collision_system_1.CollisionSystem.rectanglesCollideSAT(r3, r4);
        expect(result).toBe(true);
    });
});
describe('SAT Rotating Sword Collision', function () {
    let sword = new rectangle_1.Rectangle(new GVector2_1.GVector2(0, 0), 10, 2);
    let r2 = new rectangle_1.Rectangle(new GVector2_1.GVector2(0, 6), 2, 2);
    it('Rotation 0 should not be colliding', function () {
        let result = collision_system_1.CollisionSystem.rectanglesCollideSAT(sword, r2);
        expect(result).toBe(false);
    });
    it('Rotation 20 should not be colliding', function () {
        sword.rotate(20);
        let result = collision_system_1.CollisionSystem.rectanglesCollideSAT(sword, r2);
        expect(result).toBe(false);
    });
    it('Rotation 45 should not be colliding', function () {
        sword.rotate(25);
        let result = collision_system_1.CollisionSystem.rectanglesCollideSAT(sword, r2);
        expect(result).toBe(false);
    });
    it('Rotation 90 should be colliding', function () {
        sword.rotate(45);
        let result = collision_system_1.CollisionSystem.rectanglesCollideSAT(sword, r2);
        expect(result).toBe(true);
    });
    it('Rotation 135 should not be colliding', function () {
        sword.rotate(45);
        let result = collision_system_1.CollisionSystem.rectanglesCollideSAT(sword, r2);
        expect(result).toBe(false);
    });
});
describe('SAT Centered Rect Collision', function () {
    let sword = new rectangle_1.Rectangle(new GVector2_1.GVector2(0, 0), 10, 2);
    let r2 = new rectangle_1.Rectangle(new GVector2_1.GVector2(0, 6), 2, 2);
    it('Rotation 0 should not be colliding', function () {
        let result = collision_system_1.CollisionSystem.rectanglesCollideSAT(sword, r2);
        expect(result).toBe(false);
    });
    it('Rotation 20 should not be colliding', function () {
        sword.rotate(20);
        let result = collision_system_1.CollisionSystem.rectanglesCollideSAT(sword, r2);
        expect(result).toBe(false);
    });
    it('Rotation 45 should not be colliding', function () {
        sword.rotate(25);
        let result = collision_system_1.CollisionSystem.rectanglesCollideSAT(sword, r2);
        expect(result).toBe(false);
    });
    it('Rotation 90 should be colliding', function () {
        sword.rotate(45);
        let result = collision_system_1.CollisionSystem.rectanglesCollideSAT(sword, r2);
        expect(result).toBe(true);
    });
    it('Rotation 135 should not be colliding', function () {
        sword.rotate(45);
        let result = collision_system_1.CollisionSystem.rectanglesCollideSAT(sword, r2);
        expect(result).toBe(false);
    });
});
