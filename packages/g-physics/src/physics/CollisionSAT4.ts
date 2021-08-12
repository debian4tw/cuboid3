/* eslint-disable camelcase */
// import { GVector2 } from '../math/GVector2'
import { GVector3 } from '../math/GVector3'
import { GBox3Vertex } from '../shape/GBox3'

import { GBox4 } from '../shape/GBox4'

export abstract class CollisionSAT4 {
  public static rectanglesCollideSAT (rect1: GBox4, rect2: GBox4) {
    return CollisionSAT4.checkRectangleOverlapSat(rect1, rect2) &&
    CollisionSAT4.checkRectangleOverlapSat(rect2, rect1)
  }

  public static checkRectangleOverlapSat (rect1: GBox4, rect2: GBox4) {
    const axisProy = [
      new GVector3(
        rect1.getNode(GBox3Vertex.LDB).z - rect1.getNode(GBox3Vertex.LDF).z,
        rect1.getNode(GBox3Vertex.LDB).y - rect1.getNode(GBox3Vertex.LDF).y,
        rect1.getNode(GBox3Vertex.LDB).x - rect1.getNode(GBox3Vertex.LDF).x
      ),
      new GVector3(
        rect1.getNode(GBox3Vertex.LUF).z - rect1.getNode(GBox3Vertex.LDF).z,
        rect1.getNode(GBox3Vertex.LUF).y - rect1.getNode(GBox3Vertex.LDF).y,
        rect1.getNode(GBox3Vertex.LUF).x - rect1.getNode(GBox3Vertex.LDF).x
      ),
      new GVector3(
        rect1.getNode(GBox3Vertex.RDF).z - rect1.getNode(GBox3Vertex.LDF).z,
        rect1.getNode(GBox3Vertex.RDF).y - rect1.getNode(GBox3Vertex.LDF).y,
        rect1.getNode(GBox3Vertex.RDF).x - rect1.getNode(GBox3Vertex.LDF).x
      )
    ]

    for (let i = 0; i < axisProy.length; i++) {
      let min_r1: number = Infinity; let max_r1: number = -Infinity
      rect1.getNodes().forEach((v: any) => {
        const vec = new GVector3(v[0], v[1], v[2])
        const proyected = vec.dotProduct(axisProy[i])
        min_r1 = Math.min(min_r1, proyected)
        max_r1 = Math.max(max_r1, proyected)
      })

      let min_r2: number = Infinity; let max_r2: number = -Infinity
      rect2.getNodes().forEach((v: any) => {
        const vec = new GVector3(v[0], v[1], v[2])
        const proyected = vec.dotProduct(axisProy[i])
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
