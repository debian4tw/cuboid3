"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GParticle = void 0;
const GVector3_1 = require("../math/GVector3");
class GParticle {
    constructor(x = 0, y = 0, z = 0) {
        this.position = new GVector3_1.GVector3(x, y, z);
        this.velocity = new GVector3_1.GVector3(0, 0, 0);
        this.acceleration = new GVector3_1.GVector3(0, 0, 0);
        this.forceAccum = new GVector3_1.GVector3(0, 0, 0);
        this.damping = 0.9;
    }
    copy() {
        let part = new GParticle();
        part.setPosition(this.getPosition().x, this.getPosition().y, this.getPosition().z);
        part.setMass(this.getMass());
        return part;
    }
    integrate(duration) {
        if (this.inverseMass <= 0) {
            return;
        }
        if (duration > 0 === false) {
            return;
        }
        //-calc acceleration
        let resultingAcc = this.acceleration.copy();
        resultingAcc.addScaledVector(this.forceAccum, this.inverseMass);
        //-calc velocity
        //this.velocity.multiplyScalar(Math.pow(this.damping, duration))
        let initialVelocity = this.velocity.copy();
        this.velocity.addScaledVector(resultingAcc, duration);
        //-calc position
        this.position.addScaledVector(initialVelocity.add(this.velocity).divideScalar(2), duration);
        this.clearAccumulator();
    }
    clearAccumulator() {
        this.forceAccum.set(0, 0, 0);
    }
    addForce(force) {
        this.forceAccum.add(force);
    }
    setMass(mass) {
        this.mass = mass;
        this.inverseMass = 1 / mass;
    }
    getMass() {
        return this.mass;
    }
    getInverseMass() {
        return this.inverseMass;
    }
    setAcceleration(x, y, z) {
        this.acceleration.set(x, y, z);
    }
    getAcceleration() {
        return this.acceleration;
    }
    getLinearMomentum() {
        return this.velocity.copy().multiplyScalar(this.mass);
    }
    setDamping(damping) {
        this.damping = damping;
    }
    setPosition(x, y, z) {
        this.position.set(x, y, z);
    }
    getPosition() {
        return this.position;
    }
    setVelocity(x, y, z) {
        this.velocity.set(x, y, z);
    }
    getVelocity() {
        return this.velocity;
    }
    dump() {
        return {
            position: this.position,
            velocity: this.velocity,
            acceleration: this.acceleration
        };
    }
}
exports.GParticle = GParticle;
