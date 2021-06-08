import {GVector2 } from '../math/GVector2'
import {IRectangle} from './IRectangle'

export class Rectangle implements IRectangle {

  origin: GVector2
  width: number
  height: number
  rotation: number

  constructor(origin: GVector2, width: number, height: number, rotation: number = 0) {
    this.origin = origin
    this.width = width
    this.height = height

    this.rotation = rotation
  }


  public rotate(rotation: number) {
    this.rotation += rotation
  }

  getBottomLeft() : GVector2 {
    return this.origin
  }

  getTopLeft() : GVector2 {
    let x = this.origin.x + this.height * Math.cos((this.rotation + 90) * Math.PI / 180) 
    let y = this.origin.y + this.height * Math.sin((this.rotation + 90) * Math.PI / 180)

    return new GVector2(Math.round((x + Number.EPSILON) * 100) / 100, Math.round((y + Number.EPSILON) * 100) / 100)
  }
  
  getBottomRight() : GVector2 {
    //let x = this.origin.x + this.width * Math.round(Math.cos((this.rotation * Math.PI / 180) + Number.EPSILON) * 100 ) / 100
    //let y = this.origin.y + this.width * Math.round(Math.sin((this.rotation * Math.PI / 180)  + Number.EPSILON)* 100 ) / 100

    let x = this.origin.x + this.width * Math.cos(this.rotation * Math.PI / 180) 
    let y = this.origin.y + this.width * Math.sin(this.rotation * Math.PI / 180)

    //return new GRPENG.Vector2(x,y)
    return new GVector2(Math.round((x + Number.EPSILON) * 100) / 100, Math.round((y + Number.EPSILON) * 100) / 100)
  }

  getTopRight() : GVector2 {
    let x = this.getBottomRight().x + this.height * Math.cos((this.rotation + 90) * Math.PI / 180)
    let y = this.getBottomRight().y + this.height * Math.sin((this.rotation + 90) * Math.PI / 180)

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