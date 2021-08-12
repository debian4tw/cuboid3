/* eslint-disable camelcase */
import { GVector2 } from '../math/GVector2'
import { Rectangle } from '../shape/rectangle'

export abstract class CollisionSAT2 {
  public static rectanglesCollideSATOnXY (rect1: Rectangle, rect2: Rectangle) {
    return CollisionSAT2.checkRectangleOverlapSATOnXY(rect1, rect2) &&
        CollisionSAT2.checkRectangleOverlapSATOnXY(rect2, rect1)
  }

  public static checkRectangleOverlapSATOnXY (rect1: Rectangle, rect2: Rectangle) {
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

    for (let i = 0; i < axisProy.length; i++) {
      let min_r1: number = Infinity
      let max_r1: number = -Infinity
      rect1.getVerticesArray().forEach((v: GVector2) => {
        const proyected = v.dotProduct(axisProy[i])
        min_r1 = Math.min(min_r1, proyected)
        max_r1 = Math.max(max_r1, proyected)
      })

      let min_r2: number = Infinity; let max_r2: number = -Infinity
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
