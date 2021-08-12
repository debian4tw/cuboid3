import { GVector3 } from '../math/GMath';
import { GParticle } from './GParticle';
export declare class GParticleContact {
    /**
    * Holds the particles that are involved in the contact. The
    * second of these can be NULL for contacts with the scenery. */
    particles: [GParticle, GParticle | null];
    particlesMovement: [GVector3, GVector3];
    /**
     * Holds the normal restitution coefficient at the contact. */
    restitution: number;
    /**
     * Holds the direction of the contact in world coordinates. */
    contactNormal: GVector3;
    penetration: number;
    constructor(particles: [GParticle, GParticle | null], restitution: number, contactNormal: GVector3);
    resolve(duration: number): void;
    calculateSeparatingVelocity(): number;
    /**
    * Handles the impulse calculations for this collision.
    */
    resolveVelocity(duration: number): void;
    resolveInterpenetration(duration: number): void;
}
