export class GVector2 {

  public x: number
  public y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  getX() {
    return this.x
  }

  sumScalar(scalar: number) {
    this.x+= scalar
    this.y+= scalar
  }

  dotProduct(vec: GVector2) {
    return this.x * vec.x + this.y * vec.y
  }

  clone() {
    return new GVector2(this.x, this.y)
  }
  
  subtract(vec: GVector2) {
    this.x -= vec.x
    this.y -= vec.y
  }

  add(vec: GVector2) {
    this.x += vec.x
    this.y += vec.y
  }

  magnitude() : number {
    let mag = Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2))
    console.log('magnitude', this.x, this.y, mag)
    return mag
  }

  angle() {
    return Math.atan(this.y / this.x) * (180 / Math.PI)
  }

  rotate(angle: number) {
    let magnitude = this.magnitude()
    let currentAngle = this.angle()
    this.x = Math.round((magnitude * Math.cos((currentAngle + angle) * Math.PI / 180) + Number.EPSILON) * 100) / 100
    this.y = Math.round((magnitude * Math.sin((currentAngle + angle) * Math.PI / 180) + Number.EPSILON) * 100) / 100
  }


  rotate2D(angle: number) {
    //x' = x cos θ − y sin θ
    let radAng = angle * Math.PI / 180
    let x =  this.x * Math.cos(radAng) - this.y * Math.sin(radAng)
    
    //y' = x sin θ + y cos θ
    let y = this.x * Math.sin(radAng) + this.y * Math.cos(radAng)

    this.x = Math.round((x + Number.EPSILON) * 100) / 100
    this.y = Math.round((y + Number.EPSILON) * 100) / 100
  }

}