import { GVector3 } from '../math/GVector3';
export declare class GParticle {
    protected position: GVector3;
    protected velocity: GVector3;
    protected acceleration: GVector3;
    forceAccum: GVector3;
    mass: number;
    inverseMass: number;
    damping: number;
    constructor(x?: number, y?: number, z?: number);
    copy(): GParticle;
    integrate(duration: number): void;
    clearAccumulator(): void;
    addForce(force: GVector3): void;
    setMass(mass: number): void;
    getMass(): number;
    getInverseMass(): number;
    setAcceleration(x: number, y: number, z: number): void;
    getAcceleration(): GVector3;
    getLinearMomentum(): GVector3;
    setDamping(damping: number): void;
    setPosition(x: number, y: number, z: number): void;
    getPosition(): GVector3;
    setVelocity(x: number, y: number, z: number): void;
    getVelocity(): GVector3;
    dump(): {
        position: GVector3;
        velocity: GVector3;
        acceleration: GVector3;
    };
}
