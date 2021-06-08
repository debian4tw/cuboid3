import {GVector3} from '../math/GVector3'

export class Box {

  private width: number
  private height: number
  private depth: number
  private origin: GVector3

  private hypotenuseXY: number
  private hypotenuseXZ: number
  private magnitude: number

  private angleXY: number
  private angleXZ: number

  private angleY: number
  private angleFloor: number

  public rotationX: number
  public rotationY: number
  public rotationZ: number

  constructor(origin: GVector3, width: number, height: number, depth: number) {
    this.origin = origin
    this.width = width
    this.height = height
    this.depth = depth

    this.rotationX = 0
    this.rotationY = 0
    this.rotationZ = 0

    this.magnitude = this.calculateMagnitude()
    this.calculateHypotenuses()
    this.calculateAngles()
  }

  calculateMagnitude() {
    return Math.sqrt(Math.pow(this.width/2,2) + Math.pow(this.height/2,2)+  Math.pow(this.depth/2,2))
  }

  calculateHypotenuses() {
    this.hypotenuseXY = Math.sqrt(Math.pow(this.width / 2,2) + Math.pow(this.height / 2, 2))
    this.hypotenuseXZ = Math.sqrt(Math.pow(this.width / 2,2) + Math.pow(this.depth / 2, 2))


    //console.log('hypotenuseXY',this.hypotenuseXY)
    //console.log('hypotenuseXZ',this.hypotenuseXZ)
  }

  calculateAngles() {
    this.angleXZ = Math.round(((180 / Math.PI) * Math.asin( this.depth / 2 / this.hypotenuseXZ) + Number.EPSILON) * 100) / 100

    this.angleXY = Math.round(((180 / Math.PI) * Math.asin( this.height / 2 / this.hypotenuseXY) + Number.EPSILON) * 100) / 100

    this.angleFloor = Math.round(((180 / Math.PI) * Math.asin( this.depth / 2 / this.hypotenuseXZ) + Number.EPSILON) * 100) / 100
    this.angleY = Math.round(((180 / Math.PI) * Math.acos( this.height / 2 / this.magnitude) + Number.EPSILON) * 100) / 100
    //console.log('angleXY', this.angleXY)
    //console.log('angleXZ', this.angleXZ)
  }

  round(n: number) {
    return (Math.round((n + Number.EPSILON) * 100) / 100) + 0
  }

  getRDF() : GVector3{
    let x = this.origin.x + this.hypotenuseXY * Math.cos((360 - this.angleXY) * Math.PI / 180)
    let y = this.origin.y + this.hypotenuseXY * Math.sin((360 - this.angleXY) * Math.PI / 180)
    let z = this.origin.z + this.hypotenuseXZ * Math.sin((360 + this.angleXZ) * Math.PI / 180)

    return(new GVector3(this.round(x),this.round(y),this.round(z)))
  }

  getRUF() {
    /*let x = this.origin.x + this.hypotenuseXY * Math.cos((this.angleXY + this.rotationZ ) * Math.PI / 180) - this.hypotenuseXZ * Math.cos(this.angleXZ * Math.PI / 180)
    let y = this.origin.y + this.hypotenuseXY * Math.sin((this.angleXY + this.rotationZ) * Math.PI / 180)
    let z = this.origin.z + this.hypotenuseXZ * Math.sin(this.angleXZ * Math.PI / 180)*/

    let x = this.origin.x + this.magnitude * Math.sin((this.angleY) * Math.PI / 180) * Math.cos((this.angleFloor + this.rotationZ) * Math.PI / 180)
    let z = this.origin.z + this.magnitude * Math.sin(this.angleY * Math.PI / 180) * Math.sin((this.angleFloor + this.rotationZ )* Math.PI / 180)
    let y = this.origin.y + this.magnitude * Math.cos(this.angleY * Math.PI / 180) 

    return(new GVector3(this.round(x),this.round(y),this.round(z)))
  }

  getRUB() {
    /*
    let x = this.origin.x + this.hypotenuseXY * Math.cos(this.angleXY * Math.PI / 180)
    let y = this.origin.y + this.hypotenuseXY * Math.sin(this.angleXY * Math.PI / 180)
    let z = this.origin.z + this.hypotenuseXZ * Math.sin( -1 *  this.angleXZ * Math.PI / 180)
    */

    let x = this.origin.x + this.magnitude * Math.sin(this.angleY * Math.PI / 180) * Math.cos(this.angleFloor * Math.PI / 180)
    let z = this.origin.z + this.magnitude * Math.sin(this.angleY * Math.PI / 180) * Math.sin(-1 * this.angleFloor * Math.PI / 180)
    let y = this.origin.y + this.magnitude * Math.cos(this.angleY * Math.PI / 180) 

    return(new GVector3(this.round(x),this.round(y),this.round(z)))
  }

  getRDB() {
    let x = this.origin.x + this.hypotenuseXY * Math.cos((360 - this.angleXY) * Math.PI / 180)
    let y = this.origin.y + this.hypotenuseXY * Math.sin((360 - this.angleXY) * Math.PI / 180)
    let z = this.origin.z + this.hypotenuseXZ * Math.sin((360 - this.angleXZ) * Math.PI / 180)

    return(new GVector3(this.round(x),this.round(y),this.round(z)))
  }



  getLDF() {
    let x = this.origin.x + this.hypotenuseXY * Math.cos((180 + this.angleXY) * Math.PI / 180)
    let y = this.origin.y + this.hypotenuseXY * Math.sin((180 + this.angleXY) * Math.PI / 180)
    let z = this.origin.z + this.hypotenuseXZ * Math.sin((180 - this.angleXZ) * Math.PI / 180)

    return(new GVector3(this.round(x),this.round(y),this.round(z)))
  }

  getLUF() {
    let x = this.origin.x + this.hypotenuseXY * Math.cos((180 - this.angleXY) * Math.PI / 180)
    let y = this.origin.y + this.hypotenuseXY * Math.sin((180 - this.angleXY) * Math.PI / 180)
    let z = this.origin.z + this.hypotenuseXZ * Math.sin((180 - this.angleXZ) * Math.PI / 180)

    return(new GVector3(this.round(x),this.round(y),this.round(z)))
  }

  getLDB() {
    let x = this.origin.x + this.hypotenuseXY * Math.cos((180 + this.angleXY) * Math.PI / 180)
    let y = this.origin.y + this.hypotenuseXY * Math.sin((180 + this.angleXY) * Math.PI / 180)
    let z = this.origin.z + this.hypotenuseXZ * Math.sin((180 + this.angleXZ) * Math.PI / 180)

    return(new GVector3(this.round(x),this.round(y),this.round(z)))
  }

  getLUB() {
    let x = this.origin.x + this.hypotenuseXY * Math.cos((180 - this.angleXY) * Math.PI / 180)
    let y = this.origin.y + this.hypotenuseXY * Math.sin((180 - this.angleXY) * Math.PI / 180)
    let z = this.origin.z + this.hypotenuseXZ * Math.sin((180 + this.angleXZ) * Math.PI / 180)

    return(new GVector3(this.round(x),this.round(y),this.round(z)))
  }

  /*
  rotateX3D(theta: number) {
    var sinTheta = Math.sin(theta * Math.PI / 180)
    var cosTheta = Math.cos(theta * Math.PI / 180)
    
    for (var n=0; n<nodes.length; n++) {
        var node = nodes[n];
        var y = node[1];
        var z = node[2];
        node[1] = y * cosTheta - z * sinTheta;
        node[2] = z * cosTheta + y * sinTheta;
    }
  }*/

}