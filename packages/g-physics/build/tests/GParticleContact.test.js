"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GMath_1 = require("../math/GMath");
const GParticle_1 = require("../physics/GParticle");
const GParticleContact_1 = require("../physics/GParticleContact");
describe('1.test over x axis va=2 vb=-3', function () {
    const p1 = new GParticle_1.GParticle();
    const p2 = new GParticle_1.GParticle();
    p1.setPosition(1, 0, 0);
    p2.setPosition(5, 0, 0);
    p1.setMass(1);
    p2.setMass(1);
    p1.setVelocity(2, 0, 0);
    p2.setVelocity(-3, 0, 0);
    let contactNormal = p1.getPosition().copy().subtract(p2.getPosition()).normalize();
    let contact = new GParticleContact_1.GParticleContact([p1, p2], 1, contactNormal);
    it('contact normal should be -1', function () {
        expect(contactNormal.x).toBe(-1);
    });
    //console.log("before:p1", p1.getVelocity())
    //console.log("before:p2", p2.getVelocity())
    contact.resolve(1);
    //console.log("after:p1", p1.getVelocity())
    //console.log("after:p2", p2.getVelocity())
    it('V1 should be -3', function () {
        expect(p1.getVelocity().x).toBe(-3);
    });
    it('V2 should be 2', function () {
        expect(p2.getVelocity().x).toBe(2);
    });
});
describe('2. (Impulse(): set a 2N force during 1s, should make velocity 2ms', function () {
    let p = new GParticle_1.GParticle();
    p.setMass(1);
    p.addForce(new GMath_1.GVector3(2, 0, 0));
    let time = 1; //1 second
    p.integrate(1);
    it('should increase by 1', function () {
        expect(p.getVelocity().x).toBe(2);
    });
});
describe('3. test inelastic over x axis m1=4kg v1=6m/s | m2=6kg v2=3m/s', function () {
    const p1 = new GParticle_1.GParticle();
    p1.setPosition(0, 0, 0);
    p1.setMass(4);
    p1.setVelocity(6, 0, 0);
    const p2 = new GParticle_1.GParticle();
    p2.setPosition(1, 0, 0);
    p2.setMass(6);
    p2.setVelocity(3, 0, 0);
    let contactNormal = p1.getPosition().copy().subtract(p2.getPosition()).normalize();
    let restitutionCoeff = 0;
    let contact = new GParticleContact_1.GParticleContact([p1, p2], restitutionCoeff, contactNormal);
    it('contact normal should be -1', function () {
        expect(contactNormal.x).toBe(-1);
    });
    contact.resolve(1);
    it('V1 should be 4.2', function () {
        expect(p1.getVelocity().x).toBe(4.2);
    });
    it('V2 should be 4.2', function () {
        expect(p2.getVelocity().x).toBe(4.2);
    });
});
describe('4. test elastic over x,y axis: m1=1 p1=(0,0) v1=(1,1) | m2=1 p2=(1,1) v2=(-1,-1)', function () {
    const p1 = new GParticle_1.GParticle();
    const p2 = new GParticle_1.GParticle();
    p1.setPosition(0, 0, 0);
    p2.setPosition(1, 1, 0);
    p1.setMass(1);
    p2.setMass(1);
    p1.setVelocity(1, 1, 0);
    p2.setVelocity(-1, -1, 0);
    let contactNormal = p1.getPosition().copy().subtract(p2.getPosition()).normalize();
    let contact = new GParticleContact_1.GParticleContact([p1, p2], 1, contactNormal);
    it('contact normal should be -sqrt(2)/2', function () {
        expect(GMath_1.GRoundNumber(contactNormal.x, 10)).toBe(GMath_1.GRoundNumber(-Math.sqrt(2) / 2, 10));
    });
    //console.log("before:p1", p1.getVelocity())
    //console.log("before:p2", p2.getVelocity())
    contact.resolve(1);
    //console.log("after:p1", p1.getVelocity())
    //console.log("after:p2", p2.getVelocity())
    it('V1 should be -1,1', function () {
        expect(GMath_1.GRoundNumber(p1.getVelocity().x, 10)).toBe(GMath_1.GRoundNumber(-1, 10));
        expect(GMath_1.GRoundNumber(p1.getVelocity().y, 10)).toBe(GMath_1.GRoundNumber(-1, 10));
    });
    it('V2 should be 1,1', function () {
        expect(GMath_1.GRoundNumber(p2.getVelocity().x, 10)).toBe(GMath_1.GRoundNumber(1, 10));
        expect(GMath_1.GRoundNumber(p2.getVelocity().y, 10)).toBe(GMath_1.GRoundNumber(1, 10));
    });
});
describe('5. test elastic over x,y axis m1=1kg v1=(1,0) m/s | m2=1kg v2=(0,1) m/s', function () {
    const p1 = new GParticle_1.GParticle();
    p1.setPosition(0, 0, 0);
    p1.setMass(1);
    p1.setVelocity(1, 0, 0);
    const p2 = new GParticle_1.GParticle();
    p2.setPosition(1, -1, 0);
    p2.setMass(1);
    p2.setVelocity(0, 1, 0);
    let contactNormal = p1.getPosition().copy().subtract(p2.getPosition()).normalize();
    let restitutionCoeff = 1;
    let contact = new GParticleContact_1.GParticleContact([p1, p2], restitutionCoeff, contactNormal);
    it('*contact normal should be -1', function () {
        expect(GMath_1.GRoundNumber(contactNormal.x, 10)).toBe(-0.7);
    });
    console.log("before:p1", p1.getVelocity());
    console.log("before:p2", p2.getVelocity());
    contact.resolve(1);
    console.log("after:p1", p1.getVelocity());
    console.log("after:p2", p2.getVelocity());
    it('V1 should be ', function () {
        expect(Math.abs(GMath_1.GRoundNumber(p1.getVelocity().x, 10))).toBe(0);
    });
    it('V2 should be ', function () {
        expect(GMath_1.GRoundNumber(p2.getVelocity().x, 10)).toBe(1);
    });
});
describe('6. test elastic over x axis: m1=4kg v1=6m/s | m2=6kg v2=3m/s ', function () {
    const p1 = new GParticle_1.GParticle();
    p1.setPosition(0, 0, 0);
    p1.setMass(4);
    p1.setVelocity(6, 0, 0);
    const p2 = new GParticle_1.GParticle();
    p2.setPosition(1, 0, 0);
    p2.setMass(6);
    p2.setVelocity(3, 0, 0);
    let contactNormal = p1.getPosition().copy().subtract(p2.getPosition()).normalize();
    let restitutionCoefficient = 1;
    let contact = new GParticleContact_1.GParticleContact([p1, p2], restitutionCoefficient, contactNormal);
    contact.resolve(1);
    it('V1 should be 2.4', function () {
        expect(p1.getVelocity().x).toBe(2.4);
    });
    it('V2 should be 5.4', function () {
        expect(p2.getVelocity().x).toBe(5.4);
    });
    it('from p1 perspective, contact normal on x should be -1', function () {
        expect(contactNormal.x).toBe(-1);
    });
});
