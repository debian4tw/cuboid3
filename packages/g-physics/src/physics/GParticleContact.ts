import { GVector3 } from "../math/GMath";
import { GParticle } from "./GParticle";

export class GParticleContact {
/**
* Holds the particles that are involved in the contact. The 
* second of these can be NULL for contacts with the scenery. */
  public particles: [GParticle, GParticle | null]

  public particlesMovement: [GVector3, GVector3]
  /**
   * Holds the normal restitution coefficient at the contact. */
  public restitution: number
  /**
   * Holds the direction of the contact in world coordinates. */
  public contactNormal: GVector3

  public penetration: number

  constructor(particles: [GParticle, GParticle | null], restitution: number, contactNormal: GVector3) {
    this.particles = particles
    this.restitution = restitution
    this.contactNormal = contactNormal
    this.particlesMovement = [new GVector3(0,0,0), new GVector3(0,0,0)]
  }

  resolve(duration: number): void {
    this.resolveVelocity(duration);
    //wthis.resolveInterpenetration(duration);
  }

  /* Calculates the separating velocity at this contact. */
  calculateSeparatingVelocity(): number {
    const relativeVelocity = this.particles[0].getVelocity().copy();
    if (this.particles[1] !== null) {
      relativeVelocity.subtract(this.particles[1].getVelocity()) 
    }
    return relativeVelocity.dotProduct(this.contactNormal);
  }

  /**
  * Handles the impulse calculations for this collision.
  */
  resolveVelocity(duration: number): void {
    // Find the velocity in the direction of the contact. 
    const separatingVelocity: number = this.calculateSeparatingVelocity();
    // Check if it needs to be resolved. 
    //console.log("separatingVelocity", separatingVelocity);
    if (separatingVelocity > 0) {
    // The contact is either separating, or stationary; // no impulse is required.
      return;
    }

    // Calculate the new separating velocity.
    const newSepVelocity: number = -separatingVelocity * this.restitution;
    const deltaVelocity: number = newSepVelocity - separatingVelocity;

    //console.log("newSeparationVelocity", newSepVelocity)
    //console.log("deltaVelocity", deltaVelocity)
    // We apply the change in velocity to each object in proportion to 
    // their inverse mass (i.e., those with lower inverse mass [higher 
    // actual mass] get less change in velocity).
    let totalInverseMass = this.particles[0].getInverseMass();
    if (this.particles[1]) {
      totalInverseMass += this.particles[1].getInverseMass();
    }
    //console.log("totalInverseMass", totalInverseMass)
    // If all particles have infinite mass, then impulses have no effect. 
    if (totalInverseMass <= 0) return;

    // Calculate the impulse to apply.
    const impulse = deltaVelocity / totalInverseMass;

    // Find the amount of impulse per unit of inverse mass. 
    const impulsePerIMass: GVector3 = this.contactNormal.copy().multiplyScalar(impulse);

    //console.log("impulse", impulse);
    //console.log("impulsePerIMass", impulsePerIMass)

    // Apply impulses: they are applied in the direction of the contact, 
    // and are proportional to the inverse mass.

    
    //console.log("calculating V1")
    //console.log("prev V1",this.particles[0].getVelocity().copy())
    if (this.particles[1]) {
      //console.log("prev V2",this.particles[1].getVelocity().copy())
    }

    //console.log("impulserPerIMass * InvMass", impulsePerIMass.copy(), this.particles[0].getInverseMass())
    //console.log("result", impulsePerIMass.copy().multiplyScalar( this.particles[0].getInverseMass()))
    
    const newVel1 = this.particles[0].getVelocity().copy()
      .add(
        impulsePerIMass.copy().multiplyScalar( this.particles[0].getInverseMass())
      )
    //console.log("NEW VEL1", newVel1)
    this.particles[0].setVelocity(newVel1.x, newVel1.y, newVel1.z)


    if (this.particles[1]) {
      // Particle 1 goes in the opposite direction 
      const newVel2 = this.particles[1].getVelocity()
        .add(
          impulsePerIMass.copy()
          .multiplyScalar( -1 * this.particles[1].getInverseMass())
        )
      //console.log("NEW VEL2", newVel2)
      this.particles[1].setVelocity(newVel2.x, newVel2.y, newVel2.z)
    }
  }

  resolveInterpenetration(duration: number) {
    // If we don't have any penetration, skip this step.
    if (this.penetration <= 0) return;

    // The movement of each object is based on their inverse mass, so
    // total that.
    let totalInverseMass = this.particles[0].getInverseMass();
    if (this.particles[1]) {
      totalInverseMass += this.particles[1].getInverseMass();
    }

    // If all particles have infinite mass, then we do nothing
    if (totalInverseMass <= 0) return;

    // Find the amount of penetration resolution per unit of inverse mass
    const movePerIMass: GVector3 = this.contactNormal.copy().multiplyScalar(this.penetration / totalInverseMass);

    // Calculate the the movement amounts
    this.particlesMovement[0] = movePerIMass.copy().multiplyScalar(this.particles[0].getInverseMass())
    if (this.particles[1]) {
        this.particlesMovement[1] = movePerIMass.copy().multiplyScalar(-1 * this.particles[1].getInverseMass())
    }

    // Apply the penetration resolution
    let pos0 = this.particles[0].getPosition().copy().add(this.particlesMovement[0])
    this.particles[0].setPosition(pos0.x, pos0.y, pos0.z);
    if (this.particles[1]) {
        let pos1 = this.particles[1].getPosition().copy().add(this.particlesMovement[1])
        this.particles[1].setPosition(pos1.x, pos1.y, pos1.z);
    }
  }

}