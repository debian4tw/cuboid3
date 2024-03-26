import { GVector2 } from "../math/GVector2";
import { Rectangle } from "../shape";

import { RectangleCentered } from "../shape/RectangleCentered";

describe("DotProduct", function () {
  it("should be 0 with orthogonal vectors", function () {
    let m1 = new GVector2(1, 0);
    let m2 = new GVector2(0, 1);
    let result = m1.dotProduct(m2);
    expect(result).toBe(0);
  });

  it("should be 0 with orthogonal vectors", function () {
    let m1 = new GVector2(1, 1);
    let m2 = new GVector2(-1, 1);
    let result = m1.dotProduct(m2);
    expect(result).toBe(0);
  });

  it("should be 1", function () {
    let m1 = new GVector2(1, 0);
    let result = m1.dotProduct(m1);
    expect(result).toBe(1);
  });
});

describe("Rectangle", function () {
  it("Dimensions should match 1", function () {
    let origin = new GVector2(1, 1);
    let rect = new Rectangle(origin, 10, 10);

    let topRight = rect.getTopRight();
    let bottomRight = rect.getBottomRight();
    let topLeft = rect.getTopLeft();
    let bottomLeft = rect.getBottomLeft();

    expect(topRight.x).toBe(11);
    expect(topRight.y).toBe(11);

    expect(bottomRight.x).toBe(11);
    expect(bottomRight.y).toBe(1);

    expect(topLeft.x).toBe(1);
    expect(topLeft.y).toBe(11);

    expect(bottomLeft.x).toBe(1);
    expect(bottomLeft.y).toBe(1);
  });

  it("Dimensions should match 2", function () {
    let origin = new GVector2(0, 0);
    let rect = new Rectangle(origin, 1, 1);

    let topRight = rect.getTopRight();
    let bottomRight = rect.getBottomRight();
    let topLeft = rect.getTopLeft();
    let bottomLeft = rect.getBottomLeft();

    expect(topRight.x).toBe(1);
    expect(topRight.y).toBe(1);

    expect(bottomRight.x).toBe(1);
    expect(bottomRight.y).toBe(0);

    expect(topLeft.x - 0).toBeLessThan(0.0001);
    expect(topLeft.y).toBe(1);

    expect(bottomLeft.x).toBe(0);
    expect(bottomLeft.y).toBe(0);
  });

  it("rotated dimensions should match", function () {
    let origin = new GVector2(0, 0);
    let rect = new Rectangle(origin, Math.sqrt(2), Math.sqrt(2), 45);

    let topRight = rect.getTopRight();
    let bottomRight = rect.getBottomRight();
    let topLeft = rect.getTopLeft();
    let bottomLeft = rect.getBottomLeft();

    expect(topRight.x).toBe(0);
    expect(topRight.y).toBe(2);

    expect(bottomRight.x).toBe(1);
    expect(bottomRight.y).toBe(1);

    expect(topLeft.x).toBe(-1);
    expect(topLeft.y).toBe(1);

    expect(bottomLeft.x).toBe(0);
    expect(bottomLeft.y).toBe(0);
  });
});

describe("RectangleCentered tests", function () {
  let m1 = new RectangleCentered(new GVector2(0, 0), 2, 2);
  it("not rotated with origin at 0", function () {
    let topRight = m1.getTopRight();
    let bottomRight = m1.getBottomRight();
    let topLeft = m1.getTopLeft();
    let bottomLeft = m1.getBottomLeft();

    console.log(m1.getVertices());
    expect(topRight.x).toBe(1);
    expect(topRight.y).toBe(1);

    expect(bottomRight.x).toBe(1);
    expect(bottomRight.y).toBe(-1);

    expect(topLeft.x).toBe(-1);
    expect(topLeft.y).toBe(1);

    expect(bottomLeft.x).toBe(-1);
    expect(bottomLeft.y).toBe(-1);
  });
});

describe("RectangleCentered tests", function () {
  it("rotated 45 with origin at 0", function () {
    let m1 = new RectangleCentered(
      new GVector2(0, 0),
      Math.sqrt(2),
      Math.sqrt(2),
      45
    );
    let topRight = m1.getTopRight();
    let bottomRight = m1.getBottomRight();
    let topLeft = m1.getTopLeft();
    let bottomLeft = m1.getBottomLeft();

    console.log(m1.getVertices());
    expect(topRight.x).toBe(0);
    expect(topRight.y).toBe(1);

    expect(bottomRight.x).toBe(1);
    expect(bottomRight.y).toBeCloseTo(0, 10);

    expect(topLeft.x).toBe(-1);
    expect(topLeft.y).toBe(0);

    expect(bottomLeft.x).toBe(0);
    expect(bottomLeft.y).toBe(-1);
  });

  it("rotated -45 with origin at 1,1", function () {
    let m1 = new RectangleCentered(
      new GVector2(1, 1),
      Math.sqrt(2),
      Math.sqrt(2),
      -45
    );
    let topRight = m1.getTopRight();
    let bottomRight = m1.getBottomRight();
    let topLeft = m1.getTopLeft();
    let bottomLeft = m1.getBottomLeft();

    console.log(m1.getVertices());

    expect(topRight.x).toBe(2);
    expect(topRight.y).toBe(1);

    expect(bottomRight.x).toBe(1);
    expect(bottomRight.y).toBe(0);

    expect(topLeft.x).toBe(1);
    expect(topLeft.y).toBe(2);

    expect(bottomLeft.x).toBe(0);
    expect(bottomLeft.y).toBe(1);
  });

  it("long rect with origin at 0,0", function () {
    let m1 = new RectangleCentered(new GVector2(0, 0), 20, 2, 0);
    let topRight = m1.getTopRight();
    let bottomRight = m1.getBottomRight();
    let topLeft = m1.getTopLeft();
    let bottomLeft = m1.getBottomLeft();

    console.log(m1.getVertices());

    expect(topRight.x).toBe(10);
    expect(topRight.y).toBe(1);

    expect(bottomRight.x).toBe(10);
    expect(bottomRight.y).toBe(-1);

    expect(topLeft.x).toBe(-10);
    expect(topLeft.y).toBe(1);

    expect(bottomLeft.x).toBe(-10);
    expect(bottomLeft.y).toBe(-1);
  });

  it("long rect rotated 90 with origin at 0,0", function () {
    let m1 = new RectangleCentered(new GVector2(0, 0), 20, 2, 90);
    let topRight = m1.getTopRight();
    let bottomRight = m1.getBottomRight();
    let topLeft = m1.getTopLeft();
    let bottomLeft = m1.getBottomLeft();

    console.log(m1.getVertices());

    expect(topRight.x).toBe(-1);
    expect(topRight.y).toBe(10);

    expect(bottomRight.x).toBe(1);
    expect(bottomRight.y).toBe(10);

    expect(topLeft.x).toBe(-1);
    expect(topLeft.y).toBe(-10);

    expect(bottomLeft.x).toBe(1);
    expect(bottomLeft.y).toBe(-10);
  });

  it("long rect rotated 90 with origin at 0,0", function () {
    let m1 = new RectangleCentered(new GVector2(0, 0), 20, 2, 90);
    let topRight = m1.getTopRight();
    let bottomRight = m1.getBottomRight();
    let topLeft = m1.getTopLeft();
    let bottomLeft = m1.getBottomLeft();

    console.log(m1.getVertices());

    expect(topRight.x).toBe(-1);
    expect(topRight.y).toBe(10);

    expect(bottomRight.x).toBe(1);
    expect(bottomRight.y).toBe(10);

    expect(topLeft.x).toBe(-1);
    expect(topLeft.y).toBe(-10);

    expect(bottomLeft.x).toBe(1);
    expect(bottomLeft.y).toBe(-10);
  });

  it("long rect rotated 90 with origin at 0,0", function () {
    let m2 = new RectangleCentered(new GVector2(10, 0), 10, 2, 0);
    m2.rotateOnPivot(new GVector2(0, 0), 90);
    console.log("m1 rotated on pivot", m2);
    console.log(m2.getVertices());
    let topRight = m2.getTopRight();
    let bottomRight = m2.getBottomRight();
    let topLeft = m2.getTopLeft();
    let bottomLeft = m2.getBottomLeft();

    expect(bottomRight.y).toBe(15);
  });
});
