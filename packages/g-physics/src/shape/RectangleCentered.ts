import {GVector2 } from '../math/GVector2'
import {IRectangle} from './IRectangle'

export class RectangleCentered implements IRectangle {

  origin: GVector2
  width: number
  height: number
  rotation: number
  hypotenuse: number
  baseVerticesAngle: number

  constructor(origin: GVector2, width: number, height: number, rotation: number = 0) {
    this.origin = origin
    this.width = width
    this.height = height

    this.rotation = rotation
    this.baseVerticesAngle = 0
    this.calculateHypotenuse()
    this.calculateBaseVerticesAngle()

    //console.log('Angle:', this.height, this.hypotenuse, this.baseVerticesAngle);
  }

  public calculateHypotenuse() {
    this.hypotenuse = Math.sqrt(Math.pow(this.width / 2,2) + Math.pow(this.height / 2, 2))
  }

  public calculateBaseVerticesAngle() {
    //console.log('soh', this.height / 2 / this.hypotenuse )
    //console.log('asin', Math.asin(this.height / 2 / this.hypotenuse ) )
    this.baseVerticesAngle = Math.round(((180 / Math.PI) * Math.asin( this.height / 2 / this.hypotenuse) + Number.EPSILON) * 100) / 100
  }

  public rotate(rotation: number) {
    this.rotation += rotation
  }

  public rotateOnPivot(pivot: GVector2, rotation: number) {
    this.origin.add(pivot)
    this.origin.rotate(rotation)
    this.rotation += rotation
  }

  getBottomLeft() : GVector2 {
    let vertexRot = this.baseVerticesAngle + 180
    let currentRotation = (vertexRot + this.rotation) * Math.PI / 180
    let x = this.origin.x + this.hypotenuse * Math.cos(currentRotation)
    let y = this.origin.y + this.hypotenuse * Math.sin(currentRotation)

    return new GVector2(Math.round((x + Number.EPSILON) * 100) / 100, Math.round((y + Number.EPSILON) * 100) / 100)
  }

  getTopLeft() : GVector2 {
    let vertexRot = 180 - this.baseVerticesAngle
    let currentRotation = (vertexRot + this.rotation) * Math.PI / 180
    let x = this.origin.x + this.hypotenuse * Math.cos(currentRotation)
    let y = this.origin.y + this.hypotenuse * Math.sin(currentRotation)

    //return new GRPENG.Vector2(x,y)
    return new GVector2(Math.round((x + Number.EPSILON) * 100) / 100, Math.round((y + Number.EPSILON) * 100) / 100)
  }
  
  getBottomRight() : GVector2 {
    let vertexRot = 360 - this.baseVerticesAngle
    let currentRotation = (vertexRot + this.rotation) * Math.PI / 180
    let x = this.origin.x + this.hypotenuse * Math.cos(currentRotation)
    let y = this.origin.y + this.hypotenuse * Math.sin(currentRotation)

    return new GVector2(Math.round((x + Number.EPSILON) * 100) / 100, Math.round((y + Number.EPSILON) * 100) / 100)
  }

  getTopRight() : GVector2 {
    let currentRotation = (this.baseVerticesAngle + this.rotation) * Math.PI / 180
    let x = this.origin.x + this.hypotenuse * Math.cos(currentRotation)
    let y = this.origin.y + this.hypotenuse * Math.sin(currentRotation)

    //return new GRPENG.Vector2(x,y)
    return new GVector2(Math.round((x + Number.EPSILON) * 100) / 100, Math.round((y + Number.EPSILON) * 100) / 100)
  }

  getVertices() : Object {
    return {
      'bottomLeft': this.getBottomLeft(),
      'bottomRight': this.getBottomRight(),
      'topRight': this.getTopRight(),
      'topLeft': this.getTopLeft()
    }
  }

  getVerticesArray() : Array<GVector2> {
    return [
      this.getBottomLeft(),
      this.getBottomRight(),
      this.getTopRight(),
      this.getTopLeft()
    ]
  }
}