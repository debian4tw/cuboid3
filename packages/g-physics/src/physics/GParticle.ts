import {GVector3} from '../math/GVector3'

export class GParticle {

  protected position: GVector3
  protected velocity: GVector3
  protected acceleration: GVector3

  forceAccum: GVector3

  mass: number
  inverseMass: number

  damping: number

  constructor(x: number = 0,y: number = 0, z: number = 0) {
    this.position = new GVector3(x,y,z)
    this.velocity = new GVector3(0,0,0)
    this.acceleration = new GVector3(0,0,0)
    this.forceAccum = new GVector3(0,0,0)
    this.damping = 0.9
  }

  copy(): GParticle {
    let part =  new GParticle()
    part.setPosition(this.getPosition().x, this.getPosition().y, this.getPosition().z)
    part.setMass(this.getMass())
    return part
  }

  public integrate(duration: number): void {
    if (this.inverseMass <= 0) { return }
    if (duration > 0 === false) { return }

    //-calc acceleration
    let resultingAcc: GVector3 = this.acceleration.copy()
    resultingAcc.addScaledVector(this.forceAccum, this.inverseMass)

    //-calc velocity
    //this.velocity.multiplyScalar(Math.pow(this.damping, duration))
    let initialVelocity = this.velocity.copy();
    this.velocity.addScaledVector(resultingAcc, duration);

    //-calc position
    this.position.addScaledVector(initialVelocity.add(this.velocity).divideScalar(2), duration)

    this.clearAccumulator()
  }

  clearAccumulator() {
    this.forceAccum.set(0, 0, 0)
  }

  public addForce(force: GVector3) {
    this.forceAccum.add(force)
  }

  public setMass(mass: number) {
    this.mass = mass
    this.inverseMass = 1/mass
  }

  public getMass() {
    return this.mass
  }

  public getInverseMass() {
    return this.inverseMass
  }

  public setAcceleration(x: number, y: number, z: number) {
    this.acceleration.set(x, y, z)
  }

  public getAcceleration() {
    return this.acceleration
  }

  public getLinearMomentum() {
    return this.velocity.copy().multiplyScalar(this.mass)
  }

  public setDamping(damping: number) {
    this.damping = damping;
  }

  public setPosition(x: number, y: number, z: number) {
    this.position.set(x, y, z)
  }

  public getPosition() {
    return this.position
  }

  public setVelocity(x: number, y: number, z: number) {
    this.velocity.set(x, y, z)
  }

  public getVelocity() {
    return this.velocity
  }

  public dump() {
    return {
      position: this.position,
      velocity: this.velocity,
      acceleration: this.acceleration
    } 
  }

}