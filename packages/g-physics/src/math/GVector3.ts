import { GPoint3 } from './GPoint3'

export enum Axis {
  // eslint-disable-next-line no-unused-vars
  X, Y, Z
}

export class GVector3 {
  public x: number
  public y: number
  public z: number
  private precision = 100000

  constructor (x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  copy () {
    return new GVector3(this.x, this.y, this.z)
  }

  set (x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  serialize (): GPoint3 {
    return {
      x: this.x,
      y: this.y,
      z: this.z
    }
  }

  subtract (vec: GVector3): GVector3 {
    this.x -= vec.x
    this.y -= vec.y
    this.z -= vec.z

    return this
  }

  add (vec: GVector3): GVector3 {
    this.x += vec.x
    this.y += vec.y
    this.z += vec.z

    return this
  }

  addScalar (scalar: number) {
    this.x += scalar
    this.y += scalar
    this.z += scalar

    return this
  }

  addScaledVector (vector: GVector3, scale: number) {
    this.x += (vector.x * scale)
    this.y += (vector.y * scale)
    this.z += (vector.z * scale)

    // this.x += Math.round(((vector.x * scale) + Number.EPSILON) * 1000) / 1000
    // this.y += Math.round(((vector.y * scale) + Number.EPSILON) * 1000) / 1000
    // this.z += Math.round(((vector.z * scale) + Number.EPSILON) * 1000) / 1000

    // Math.round(((vector.x * scale) + Number.EPSILON) * 100) / 100
    this.x = Math.round(((this.x) + Number.EPSILON) * this.precision) / this.precision
    this.y = Math.round(((this.y) + Number.EPSILON) * this.precision) / this.precision
    this.z = Math.round(((this.z) + Number.EPSILON) * this.precision) / this.precision
  }

  multiply (vec: GVector3) {
    this.x *= vec.x
    this.y *= vec.y
    this.z *= vec.z
  }

  multiplyScalar (scalar: number) {
    this.x *= scalar
    this.y *= scalar
    this.z *= scalar

    this.x = Math.round(((this.x) + Number.EPSILON) * this.precision) / this.precision
    this.y = Math.round(((this.y) + Number.EPSILON) * this.precision) / this.precision
    this.z = Math.round(((this.z) + Number.EPSILON) * this.precision) / this.precision

    return this
  }

  divideScalar (scalar: number) {
    this.x /= scalar
    this.y /= scalar
    this.z /= scalar

    this.x = Math.round(((this.x) + Number.EPSILON) * this.precision) / this.precision
    this.y = Math.round(((this.y) + Number.EPSILON) * this.precision) / this.precision
    this.z = Math.round(((this.z) + Number.EPSILON) * this.precision) / this.precision

    return this
  }

  magnitude () : number {
    let mag = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2))
    // console.log('magnitude', this.x, this.y, this.z, mag)
    mag = Math.round(((mag) + Number.EPSILON) * this.precision) / this.precision
    return mag
  }

  normalize (): GVector3 {
    // @todo: maybe return other thing instead of 0
    if (this.magnitude() === 0) {
      this.x = 0
      this.y = 0
      this.z = 0
      return this
    } else {
      return this.multiplyScalar(1 / this.magnitude())
    }
  }

  calculateAngleWithVector (vec: GVector3) {
    let res = Math.acos(this.dotProduct(vec) / (this.magnitude() * vec.magnitude()))
    res = res * (180 / Math.PI)
    return Math.round((res + Number.EPSILON) * 100) / 100
  }

  calculateAngleOnPlaneXZ (vec: GVector3) {
    const normA = this.copy().normalize()
    const normB = vec.copy().normalize()
    // console.log("normalized", normA, normB)

    let angle = (180 / Math.PI) * (Math.atan2(normA.x, normA.z) - Math.atan2(normB.x, normB.z))
    if (angle < -180) {
      angle += 360
    }
    return angle
  }

  dotProduct (vec: GVector3): number {
    return this.x * vec.x + this.y * vec.y + this.z * vec.z
  }

  crossProduct (vec: GVector3) {
    return new GVector3(
      Math.round(((this.y * vec.z - this.z * vec.y) + Number.EPSILON) * 100) / 100,
      Math.round(((this.z * vec.x - this.x * vec.z) + Number.EPSILON) * 100) / 100,
      Math.round(((this.x * vec.y - this.y * vec.x) + Number.EPSILON) * 100) / 100
    )
  }

  angleOnAxis (axis: Axis) {
    switch (axis) {
      case Axis.Z:
        return Math.atan(this.y / this.x) * (180 / Math.PI)
      case Axis.Y:
        return Math.atan(this.y / this.x) * (180 / Math.PI)
      case Axis.X:
        return Math.atan(this.y / this.x) * (180 / Math.PI)
    }
  }

  rotate3D (angle: number, axis: Axis) {
    switch (axis) {
      case Axis.Z:
        return this.rotateOnZ(angle)

      case Axis.X:
        return this.rotateOnX(angle)

      case Axis.Y:
        return this.rotateOnY(angle)
    }
  }

  rotateOnZ (angle: number) {
    const radAng = angle * Math.PI / 180

    const x = this.x * Math.cos(radAng) - this.y * Math.sin(radAng)
    const y = this.x * Math.sin(radAng) + this.y * Math.cos(radAng)

    this.x = Math.round((x + Number.EPSILON) * 100) / 100
    this.y = Math.round((y + Number.EPSILON) * 100) / 100
  }

  rotateOnX (angle: number) {
    const radAng = angle * Math.PI / 180

    const y = this.y * Math.cos(radAng) - this.z * Math.sin(radAng)
    const z = this.y * Math.sin(radAng) + this.z * Math.cos(radAng)

    this.y = Math.round((y + Number.EPSILON) * 100) / 100
    this.z = Math.round((z + Number.EPSILON) * 100) / 100
  }

  rotateOnY (angle: number) {
    const radAng = angle * Math.PI / 180

    const x = this.x * Math.cos(radAng) + this.z * Math.sin(radAng)
    const z = -1 * this.x * Math.sin(radAng) + this.z * Math.cos(radAng)

    this.x = Math.round((x + Number.EPSILON) * 100) / 100
    this.z = Math.round((z + Number.EPSILON) * 100) / 100
  }
}
