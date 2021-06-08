import { GVector3, Axis } from "../math/GVector3";
import { GParticle } from "../physics/GParticle";
import {GBox3Vertex,GRotationCoords } from './GBox3'

export class GBox4 {

  private nodes: any
  public origin: GParticle

  private rotationX: number
  private rotationY: number
  private rotationZ: number

  public w: number
  public h: number
  public d: number

  public r: GRotationCoords

  constructor(origin: GParticle, w: number, h: number, d: number, r: GRotationCoords | null = null){
    this.origin = origin
    let {x,y,z} = origin.getPosition()

    this.w = w
    this.h = h
    this.d = d
    this.r = {x:0,y:0,z:0}
    this.rotationX = 0
    this.rotationY = 0
    this.rotationZ = 0

    this.nodes = [
        [x+w/2, y+h/2, z+d/2], //RUF
        [x+w/2, y-h/2, z+d/2], //RDF
        [x-w/2, y+h/2, z+d/2], //LUF
        [x-w/2, y-h/2, z+d/2], //LDF
        [x+w/2, y+h/2, z-d/2], //RUB
        [x+w/2, y-h/2, z-d/2], //RDB
        [x-w/2, y+h/2, z-d/2], //LUB
        [x-w/2, y-h/2, z-d/2]  //LDB
    ]

    if (r !== null && (r.x !== 0 || r.y !== 0 || r.z !== 0)) {
      this.setRotation(r)
    }
  }

  serialize() {

    return {
      x: this.origin.getPosition().x,
      y: this.origin.getPosition().y,
      z: this.origin.getPosition().z,
      r: {
        x: this.r.x,
        y: this.r.y,
        z: this.r.z
      },
      w: this.w,
      h: this.h,
      d: this.d
    }
  }

  public setRotation(r: GRotationCoords) {
    this.rotate(r.x, Axis.X)
    this.rotate(r.y, Axis.Y)
    this.rotate(r.z,Axis.Z)
  }

  public getNodes() {
    return this.nodes
  }

  public getNode(vertex: GBox3Vertex) {
    let ret
    switch(vertex) {
      case GBox3Vertex.RUF: 
        ret = this.nodes[0]
      break
      case GBox3Vertex.RDF:
        ret = this.nodes[1]
      break
      case GBox3Vertex.LUF:
        ret = this.nodes[2]
      break
      case GBox3Vertex.LDF:
        ret =  this.nodes[3]
      break
      case GBox3Vertex.RUB:
        ret = this.nodes[4]
      break
      case GBox3Vertex.RDB:
        ret = this.nodes[5]
      break
      case GBox3Vertex.LUB:
        ret = this.nodes[6]
      break
      case GBox3Vertex.LDB:
        ret = this.nodes[7]
      break
    }

    return new GVector3(this.round(ret[0]), this.round(ret[1]), this.round(ret[2]))
  }

  move(x: number,y: number,z: number) {
    this.moveX(x)
    this.moveY(y)
    this.moveZ(z)
  }

  moveNodes(x: number,y: number,z: number) {
    this.moveX(x, false)
    this.moveY(y, false)
    this.moveZ(z, false)
  }

  moveX(x: number, moveOrigin: boolean = true) {
    for (let i=0; i<this.nodes.length;i++) {
      this.nodes[i][0] +=x
    }
    //this.origin.x += x
    if (moveOrigin) {
      this.origin.setPosition(
        this.origin.getPosition().x + x,
        this.origin.getPosition().y,
        this.origin.getPosition().z
      )
    }

  }

  moveY(y: number,  moveOrigin: boolean = false) {
    for (let i=0; i<this.nodes.length;i++) {
      this.nodes[i][1] +=y
    }
    //this.origin.y +=y
    if (moveOrigin) {
      this.origin.setPosition(
        this.origin.getPosition().x,
        this.origin.getPosition().y + y,
        this.origin.getPosition().z
      )
    }
  }

  moveZ(z: number,  moveOrigin: boolean = false) {
    for (let i=0; i<this.nodes.length;i++) {
      this.nodes[i][2] +=z
    }
    //this.origin.z +=z
    if (moveOrigin) {
      this.origin.setPosition(
        this.origin.getPosition().x,
        this.origin.getPosition().y,
        this.origin.getPosition().z + z
      )
    }
  }

  round(n: number) {
    return (Math.round((n + Number.EPSILON) * 100) / 100) + 0
  }


  /*public rotateOnPivot2(pivot: GVector3, angle: number, axis: Axis) {
    let orig = this.origin.copy()
    this.move(0-this.origin.x,0-this.origin.y,0-this.origin.z)
    this.rotate(angle, axis)
    orig.subtract(pivot)
    orig.rotate3D(angle, axis)
    //console.log('rotated pivot', orig)
    this.move(orig.x+pivot.x, orig.y+pivot.y, orig.z+pivot.z)
  }*/

  rotate(angle: number, axis: Axis) {
    let orig = this.origin.copy()
    this.move(
      0-this.origin.getPosition().x,
      0-this.origin.getPosition().y,
      0-this.origin.getPosition().z
    )

    switch(axis) {
      case Axis.X:
        this.rotateX(angle)
      break
      case Axis.Y:
        this.rotateY(angle)
      break 
      case Axis.Z:
        this.rotateZ(angle)
      break
    }

    this.move(orig.getPosition().x, orig.getPosition().y, orig.getPosition().z)
  }

  public rotateZ(theta: number) {
    var sinTheta = Math.sin(theta * Math.PI / 180)
    var cosTheta = Math.cos(theta * Math.PI / 180)

    for (var n=0; n<this.nodes.length; n++) {
        var node = this.nodes[n];
        var x = node[0];
        var y = node[1];
        node[0] = x * cosTheta - y * sinTheta;
        node[1] = y * cosTheta + x * sinTheta;
    }
    this.r.z += theta
    this.r.z = this.capAngle(this.r.z)
  }

  public rotateX(theta: number) {
    var sinTheta = Math.sin(theta * Math.PI / 180);
    var cosTheta = Math.cos(theta * Math.PI / 180);

    for (var n=0; n<this.nodes.length; n++) {
        var node = this.nodes[n];
        var y = node[1];
        var z = node[2];
        node[1] = y * cosTheta - z * sinTheta;
        node[2] = z * cosTheta + y * sinTheta;
    }
    this.r.x += theta
    this.r.x = this.capAngle(this.r.x)
  }

  private capAngle(angle: number) {
    if (angle > 360) {
      return 360 - angle
    }
    if (angle < -360) {
      return 360 + angle
    }
    return angle
  }

  public rotateY(theta: number) {
    var sinTheta = Math.sin(theta * Math.PI / 180)
    var cosTheta = Math.cos(theta * Math.PI / 180)
    
    for (var n=0; n<this.nodes.length; n++) {
        var node = this.nodes[n];
        var x = node[0];
        var z = node[2];
        node[0] = x * cosTheta + z * sinTheta;
        node[2] = z * cosTheta - x * sinTheta;
    }
    this.r.y += theta
    this.r.y = this.capAngle(this.r.y)
  }

  public rotateOnPivot(pivot: GVector3, angle: number, axis: Axis) {
    //this.origin.add(pivot)
    //this.origin.rotate3D(angle, axis)
    //this.rotation += rotation
    this.rotate(angle, axis)
  }

  public rotateOnPivot2(pivot: GVector3, angle: number, axis: Axis) {
  }
}