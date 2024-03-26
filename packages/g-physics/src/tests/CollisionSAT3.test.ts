import { GVector2 } from "../math/GVector2";
import { GVector3, Axis } from "../math/GVector3";
import { Rectangle } from "../shape";
import { GBox3, GBox3Vertex } from "../shape/GBox3";

import { CollisionSAT3 } from "../physics/CollisionSAT3";

describe("SAT3 Box Collision", function () {
  it("Overlapped should be colliding", function () {
    let r1 = new GBox3(new GVector3(0, 0, 0), 2, 2, 2);
    let r2 = new GBox3(new GVector3(1, 1, 1), 2, 2, 2);

    let result = CollisionSAT3.rectanglesCollideSAT(r1, r2);
    expect(result).toBe(true);
  });

  it("Not Overlapped should not be colliding", function () {
    let r1 = new GBox3(new GVector3(0, 0, 0), 2, 2, 2);
    let r2 = new GBox3(new GVector3(0, 8, 0), 2, 2, 2);

    let result = CollisionSAT3.rectanglesCollideSAT(r1, r2);
    expect(result).toBe(false);
  });

  it("Not Overlapped then rotated should be colliding", function () {
    let r1 = new GBox3(new GVector3(0, 0, 0), 2, 2, 2);
    let r2 = new GBox3(new GVector3(0, 8, 0), 20, 2, 2);

    let result = CollisionSAT3.rectanglesCollideSAT(r1, r2);
    expect(result).toBe(false);

    r2.rotate(90, Axis.Z);
    let result2 = CollisionSAT3.rectanglesCollideSAT(r1, r2);
    expect(result2).toBe(true);
  });

  it("Not Overlapped then rotated on Y axis should be colliding", function () {
    let r1 = new GBox3(new GVector3(0, 0, 0), 2, 2, 2);
    let r2 = new GBox3(new GVector3(6, 0, 0), 2, 2, 20);

    let result = CollisionSAT3.rectanglesCollideSAT(r1, r2);
    expect(result).toBe(false);

    r2.rotate(90, Axis.Y);
    let result2 = CollisionSAT3.rectanglesCollideSAT(r1, r2);
    expect(result2).toBe(true);
  });

  it("Not Overlapped then diagonal rotated should be colliding", function () {
    let r1 = new GBox3(new GVector3(0, 0, 0), 2, 2, 2);
    let r2 = new GBox3(new GVector3(4, 4, 0), 8, 2, 2);

    let result = CollisionSAT3.rectanglesCollideSAT(r1, r2);
    expect(result).toBe(false);

    r2.rotate(45, Axis.Z);
    let result2 = CollisionSAT3.rectanglesCollideSAT(r1, r2);
    expect(result2).toBe(true);

    r1.move(-5, 0, 0);
    let result3 = CollisionSAT3.rectanglesCollideSAT(r1, r2);
    expect(result3).toBe(false);
  });

  it("Rotate over 2 axis and move to be colliding", function () {
    let r1 = new GBox3(new GVector3(0, 0, 0), 2, 2, 2);
    let r2 = new GBox3(new GVector3(6, 6, 0), 2, 2, 20);

    let result = CollisionSAT3.rectanglesCollideSAT(r1, r2);
    expect(result).toBe(false);

    r2.rotate(90, Axis.Y);
    let result2 = CollisionSAT3.rectanglesCollideSAT(r1, r2);
    expect(result2).toBe(false);

    r2.rotate(90, Axis.Z);
    r2.moveX(-6);
    let result3 = CollisionSAT3.rectanglesCollideSAT(r1, r2);
    expect(result3).toBe(true);

    r2.rotate(90, Axis.Z);
    let result4 = CollisionSAT3.rectanglesCollideSAT(r1, r2);
    expect(result4).toBe(false);
  });
});
