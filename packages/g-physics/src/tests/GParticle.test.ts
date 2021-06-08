import { GVector3 } from '../math/GMath'
import {GParticle} from '../physics/GParticle'

describe('set acceleration 1 during 4s, should move position to 8', function() {
  let p = new GParticle()
  p.setAcceleration(1,0,0)
  p.setMass(1)
  let time = 1 //1 second
  p.integrate(1)
  p.integrate(1)
  p.integrate(1)
  p.integrate(1)

  it('should increase by 1', function() {
    expect(p.getVelocity().x).toBe(4)
  })

  it('should increase by 1', function() {
    expect(p.getPosition().x).toBe(8)
  })
})

describe('set force to 1 during 4s, and step should move position to 8', function() {
  let p = new GParticle()
  //p.setAcceleration(1,0,0)
  p.setMass(1)
  let time = 1 //1 second

  p.addForce(new GVector3(1,0,0));
  p.integrate(time)

  p.addForce(new GVector3(1,0,0));
  p.integrate(time)

  p.addForce(new GVector3(1,0,0));
  p.integrate(time)

  p.addForce(new GVector3(1,0,0));
  p.integrate(time)

  //console.log(p.dump())

  it('should increase by 1', function() {
    expect(p.getVelocity().x).toBe(4)
  })
  it('should increase by 1', function() {
    expect(p.getPosition().x).toBe(8)
  })
})

describe('apply force 1 during 4s', function() {
  let p = new GParticle()
  p.setMass(1)
  let time = 1 //1 second

  p.addForce(new GVector3(1,0,0));
  p.integrate(1)

  p.addForce(new GVector3(1,0,0));
  p.integrate(time)

  p.addForce(new GVector3(1,0,0));
  p.integrate(time)

  p.addForce(new GVector3(1,0,0));
  p.integrate(time)

  it('should increase by 1', function() {
    console.log('end pos', p.dump())
    console.log('momentum', p.getMass() * p.getVelocity().x)
    expect(p.getVelocity().x).toBe(4)
    //expect(p.getPosition().x).toBe(32)
  })
})

describe('apply force 4 during 1s', function() {
  let p = new GParticle()
  //p.setAcceleration(1,0,0)
  p.setMass(1)
  let time = 1 //1 second
  it('should increase by 1', function() {

    p.addForce(new GVector3(4,0,0));
    p.integrate(1)
    //console.log(p.dump())
    console.log('momentum', p.getMass() * p.getVelocity().x)
    expect(p.getVelocity().x).toBe(4)
    //expect(p.getPosition().x).toBe(32)
  })
})

describe('tiny 0.1s steps for 4 seconds', function() {
  let p = new GParticle()
  //p.setAcceleration(1,0,0)
  p.setMass(1)
  let time = 0.1 //0.1 second
  it('should increase by 0.1 40 times', function() {

    for (let i=0; i<40; i++) {
      p.addForce(new GVector3(1,0,0));
      p.integrate(time)
    }
    //console.log(p.dump())

    expect(p.getVelocity().x).toBe(4)
    expect(p.getPosition().x).toBe(8)
  })
})

describe('tiny 1/25s steps for 4 seconds', function() {
  let p = new GParticle()
  //p.setAcceleration(1,0,0)
  p.setMass(1)
  let time = 1/25 // 1/25 second
  it('should increase by 0.1 100 times', function() {
    for (let i=0; i<100; i++) {
      p.addForce(new GVector3(1,0,0));
      p.integrate(time)
    }
    //console.log(p.dump())

    expect(p.getVelocity().x).toBe(4)
    expect(p.getPosition().x).toBe(8)
  })
})

/*
describe('tiny 1/30s steps for 4 seconds', function() {
  let p = new GParticle()
  //p.setAcceleration(1,0,0)
  p.setMass(1)
  let time = 1/30 // 1/30 second
  it('should increase by 1/30 120 times', function() {
    for (let i=0; i<120; i++) {
      p.addForce(new GVector3(1,0,0));
      p.integrate(time)
    }
    //console.log(p.dump())
    let pos = p.getPosition()

    expect(p.getVelocity().x).toBe(4)
    expect(pos.x).toBe(8)
  })
})*/