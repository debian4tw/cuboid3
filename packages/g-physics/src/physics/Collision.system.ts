//import {Actor} from '../../game/actor/Actor'
import {GVector2} from '../math/GVector2'
import {Rectangle} from '../shape/rectangle'

export abstract class CollisionSystem {


  public static chance(chancePercent: number) {
    const max = 100;
    const min = 1;
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    if (num <= chancePercent) {
      return true
    }
  }


  public static getRoleLabelFromActorLabel(label: string) {
    return 'role' + label[label.length-1]
  }

  public static isCollidingWithOneOf(rect: any, act2: any) {
    for (let i=0; i<act2.qty; i++) {
      if (act2.active[i] && CollisionSystem.AABBCollided(rect, act2.getIndexCoordsAndDimensions(i)) ) {
        return i
      }
    }
    return -1
  }


  public static isCollidingWithOneOfOnXZ(rect: any, act2: any) {
    for (let i=0; i<act2.qty; i++) {
      if (act2.active[i] && CollisionSystem.AABBCollidedOnXZ(rect, act2.getIndexCoordsAndDimensions(i)) ) {
        return i
      }
    }
    return -1
  }

  public static AABBCollided(A: any, B: any) {
  // The sides of the rectangle angles
    let leftA, leftB,
      rightA, rightB,
      topA, topB,
      bottomA, bottomB;

  // Calculate the sides of rectangle A
    leftA = A.x;
    rightA = A.x+ A.w;
    topA = A.y;
    bottomA = A.y + A.h;

  // Calculate the sides of rectangle B
    leftB = B.x;
    rightB = B.x + B.w;
    topB = B.y;
    bottomB = B.y + B.h;
  // Here we have the actual function that checks for a collision.

  // First thing the function does is take in the SDL_rectangles and calculate their sides.
  // If any of the sides from A are outside of B
    if (bottomA <= topB) {
      return false;
    }

    if (topA >= bottomB) {
      return false;
    }

    if (rightA <= leftB) {
      return false;
    }

    if (leftA >= rightB) {
      return false;
    }

  // If none of the sides from A are outside B
    return true;
  }

  public static AABBCollidedOnXZ(A: any, B: any) {
    // The sides of the rectangle angles
    let leftA, leftB,
      rightA, rightB,
      topA, topB,
      bottomA, bottomB;

    // Calculate the sides of rectangle A
    leftA = A.x;
    rightA = A.x+ A.w;
    topA = A.z;
    bottomA = A.z + A.d;

    // Calculate the sides of rectangle B
    leftB = B.x;
    rightB = B.x + B.w;
    topB = B.z;
    bottomB = B.z + B.d;
    // Here we have the actual function that checks for a collision.

    // First thing the function does is take in the SDL_rectangles and calculate their sides.
    // If any of the sides from A are outside of B
    if (bottomA <= topB) {
      return false;
    }

    if (topA >= bottomB) {
      return false;
    }

    if (rightA <= leftB) {
      return false;
    }

    if (leftA >= rightB) {
      return false;
    }

    // If none of the sides from A are outside B
    return true;
  }


  public static rectanglesCollideSAT(rect1: Rectangle, rect2: Rectangle) {
    return CollisionSystem.checkRectangleOverlapSat(rect1, rect2) &&
    CollisionSystem.checkRectangleOverlapSat(rect2, rect1)
  }

  public static checkRectangleOverlapSat(rect1: Rectangle, rect2: Rectangle) {

    const axisProy = [
      new GVector2(
            (rect1.getBottomRight().y - rect1.getBottomLeft().y) * -1,
            rect1.getBottomRight().x - rect1.getBottomLeft().x
        ),
      new GVector2(
            (rect1.getTopLeft().y - rect1.getBottomLeft().y) * -1,
            rect1.getTopLeft().x - rect1.getBottomLeft().x
        )
    ]

    for (let i=0; i< axisProy.length; i++) {
      let min_r1: number = Infinity, max_r1: number = -Infinity
      rect1.getVerticesArray().forEach((v: GVector2) => {
        const proyected = v.dotProduct(axisProy[i])
        min_r1 = Math.min(min_r1, proyected)
        max_r1 = Math.max(max_r1, proyected)
      })

      let min_r2: number = Infinity, max_r2: number = -Infinity
      rect2.getVerticesArray().forEach((v: GVector2) => {
        const proyected = v.dotProduct(axisProy[i])
        min_r2 = Math.min(min_r2, proyected)
        max_r2 = Math.max(max_r2, proyected)
      })
        // console.log('MinMax', min_r1,max_r1, min_r2, max_r2)
      if (!(max_r2 >= min_r1 && max_r1 >= min_r2)) {
        return false
      }
    }

    return true
  }

}