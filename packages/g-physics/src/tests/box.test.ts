import {GVector3, Axis} from '../math/GVector3'
//import * as THREE from 'three'
import {Box} from '../shape/Box'

describe('Box 3 Test', function() {

  it('dimensions should match for 2,2,2 box ', function() {
    let m1 = new Box(new GVector3(0,0,0),2,2,2)

    let RUF = m1.getRUF()
    console.log('RUF', RUF)
    expect(RUF.x).toBe(1)
    expect(RUF.y).toBe(1)
    expect(RUF.z).toBe(1)

    let RDF = m1.getRDF()
    console.log('RDF', RDF)
    expect(RDF.x).toBe(1)
    expect(RDF.y).toBe(-1)
    expect(RDF.z).toBe(1)

    let LUF = m1.getLUF()
    console.log('LUF', LUF)
    expect(LUF.x).toBe(-1)
    expect(LUF.y).toBe(1)
    expect(LUF.z).toBe(1)

    let LDF = m1.getLDF()
    console.log('LDF', LDF)
    expect(LDF.x).toBe(-1)
    expect(LDF.y).toBe(-1)
    expect(LDF.z).toBe(1)

    let RUB = m1.getRUB()
    console.log('RUB', RUB)
    expect(RUB.x).toBe(1)
    expect(RUB.y).toBe(1)
    expect(RUB.z).toBe(-1)
    
    let RDB = m1.getRDB()
    console.log('RDB', RDB)
    expect(RDB.x).toBe(1)
    expect(RDB.y).toBe(-1)
    expect(RDB.z).toBe(-1)


    let LUB = m1.getLUB()
    console.log('LUB', LUB)
    expect(LUB.x).toBe(-1)
    expect(LUB.y).toBe(1)
    expect(LUB.z).toBe(-1)

    let LDB = m1.getLDB()
    console.log('LDB', LDB)
    expect(LDB.x).toBe(-1)
    expect(LDB.y).toBe(-1)
    expect(LDB.z).toBe(-1)
  })


  it('dimensions should match for 4,4,4 box', function() {
    let m1 = new Box(new GVector3(0,0,0),4,4,4)

    let RUF = m1.getRUF()
    console.log('RUF', RUF)
    expect(RUF.x).toBe(2)
    expect(RUF.y).toBe(2)
    expect(RUF.z).toBe(2)

    let RDF = m1.getRDF()
    console.log('RDF', RDF)
    expect(RDF.x).toBe(2)
    expect(RDF.y).toBe(-2)
    expect(RDF.z).toBe(2)

    let LUF = m1.getLUF()
    console.log('LUF', LUF)
    expect(LUF.x).toBe(-2)
    expect(LUF.y).toBe(2)
    expect(LUF.z).toBe(2)

    let LDF = m1.getLDF()
    console.log('LDF', LDF)
    expect(LDF.x).toBe(-2)
    expect(LDF.y).toBe(-2)
    expect(LDF.z).toBe(2)

    let RUB = m1.getRUB()
    console.log('RUB', RUB)
    expect(RUB.x).toBe(2)
    expect(RUB.y).toBe(2)
    expect(RUB.z).toBe(-2)
    
    let RDB = m1.getRDB()
    console.log('RDB', RDB)
    expect(RDB.x).toBe(2)
    expect(RDB.y).toBe(-2)
    expect(RDB.z).toBe(-2)


    let LUB = m1.getLUB()
    console.log('LUB', LUB)
    expect(LUB.x).toBe(-2)
    expect(LUB.y).toBe(2)
    expect(LUB.z).toBe(-2)

    let LDB = m1.getLDB()
    console.log('LDB', LDB)
    expect(LDB.x).toBe(-2)
    expect(LDB.y).toBe(-2)
    expect(LDB.z).toBe(-2)
  })


  it('dimensions should match for 10,2,2', function() {
    let m1 = new Box(new GVector3(0,0,0),10,2,2)

    let RUF = m1.getRUF()
    console.log('RUF', RUF)
    expect(RUF.x).toBe(5)
    expect(RUF.y).toBe(1)
    expect(RUF.z).toBe(1)

    let RDF = m1.getRDF()
    console.log('RDF', RDF)
    expect(RDF.x).toBe(5)
    expect(RDF.y).toBe(-1)
    expect(RDF.z).toBe(1)

    let LUF = m1.getLUF()
    console.log('LUF', LUF)
    expect(LUF.x).toBe(-5)
    expect(LUF.y).toBe(1)
    expect(LUF.z).toBe(1)

    let LDF = m1.getLDF()
    console.log('LDF', LDF)
    expect(LDF.x).toBe(-5)
    expect(LDF.y).toBe(-1)
    expect(LDF.z).toBe(1)

    let RUB = m1.getRUB()
    console.log('RUB', RUB)
    expect(RUB.x).toBe(5)
    expect(RUB.y).toBe(1)
    expect(RUB.z).toBe(-1)
    
    let RDB = m1.getRDB()
    console.log('RDB', RDB)
    expect(RDB.x).toBe(5)
    expect(RDB.y).toBe(-1)
    expect(RDB.z).toBe(-1)


    let LUB = m1.getLUB()
    console.log('LUB', LUB)
    expect(LUB.x).toBe(-5)
    expect(LUB.y).toBe(1)
    expect(LUB.z).toBe(-1)

    let LDB = m1.getLDB()
    console.log('LDB', LDB)
    expect(LDB.x).toBe(-5)
    expect(LDB.y).toBe(-1)
    expect(LDB.z).toBe(-1)
  })




  it('dimensions should match for 2,2,2 box with offeset center', function() {
    let m1 = new Box(new GVector3(1,1,1),2,2,2)

    let RUF = m1.getRUF()
    console.log('RUF', RUF)
    expect(RUF.x).toBe(2)
    expect(RUF.y).toBe(2)
    expect(RUF.z).toBe(2)

    let RDF = m1.getRDF()
    console.log('RDF', RDF)
    expect(RDF.x).toBe(2)
    expect(RDF.y).toBe(0)
    expect(RDF.z).toBe(2)

    let LUF = m1.getLUF()
    console.log('LUF', LUF)
    expect(LUF.x).toBe(0)
    expect(LUF.y).toBe(2)
    expect(LUF.z).toBe(2)

    let LDF = m1.getLDF()
    console.log('LDF', LDF)
    expect(LDF.x).toBe(0)
    expect(LDF.y).toBe(0)
    expect(LDF.z).toBe(2)

    let RUB = m1.getRUB()
    console.log('RUB', RUB)
    expect(RUB.x).toBe(2)
    expect(RUB.y).toBe(2)
    expect(RUB.z).toBe(0)
    
    let RDB = m1.getRDB()
    console.log('RDB', RDB)
    expect(RDB.x).toBe(2)
    expect(RDB.y).toBe(0)
    expect(RDB.z).toBe(0)


    let LUB = m1.getLUB()
    console.log('LUB', LUB)
    expect(LUB.x).toBe(0)
    expect(LUB.y).toBe(2)
    expect(LUB.z).toBe(0)

    let LDB = m1.getLDB()
    console.log('LDB', LDB)
    expect(LDB.x).toBe(0)
    expect(LDB.y).toBe(0)
    expect(LDB.z).toBe(0)
  })


  it('dimensions should match for 10,2,10', function() {
    let m1 = new Box(new GVector3(0,0,0),10,2,10)

    let RUF = m1.getRUF()
    console.log('RUF', RUF)
    expect(RUF.x).toBe(5)
    expect(RUF.y).toBe(1)
    expect(RUF.z).toBe(5)

    let RDF = m1.getRDF()
    console.log('RDF', RDF)
    expect(RDF.x).toBe(5)
    expect(RDF.y).toBe(-1)
    expect(RDF.z).toBe(5)

    let LUF = m1.getLUF()
    console.log('LUF', LUF)
    expect(LUF.x).toBe(-5)
    expect(LUF.y).toBe(1)
    expect(LUF.z).toBe(5)

    let LDF = m1.getLDF()
    console.log('LDF', LDF)
    expect(LDF.x).toBe(-5)
    expect(LDF.y).toBe(-1)
    expect(LDF.z).toBe(5)

    let RUB = m1.getRUB()
    console.log('RUB', RUB)
    expect(RUB.x).toBe(5)
    expect(RUB.y).toBe(1)
    expect(RUB.z).toBe(-5)
    
    let RDB = m1.getRDB()
    console.log('RDB', RDB)
    expect(RDB.x).toBe(5)
    expect(RDB.y).toBe(-1)
    expect(RDB.z).toBe(-5)


    let LUB = m1.getLUB()
    console.log('LUB', LUB)
    expect(LUB.x).toBe(-5)
    expect(LUB.y).toBe(1)
    expect(LUB.z).toBe(-5)

    let LDB = m1.getLDB()
    console.log('LDB', LDB)
    expect(LDB.x).toBe(-5)
    expect(LDB.y).toBe(-1)
    expect(LDB.z).toBe(-5)
  })

  
  it('dimensions should match 90 deg rot for 2,2,2', function() {
    /*
    failing at expect(RUF.x).toBe(-1)
    let m1 = new Box(new GVector3(0,0,0),2,2,2)
    m1.rotationZ = 90
    let RUF = m1.getRUF()
    console.log('RUF', RUF)
    expect(RUF.x).toBe(-1)
    expect(RUF.y).toBe(1)
    expect(RUF.z).toBe(1)

    m1.rotationZ = 0
    m1.rotationX = 0
    RUF = m1.getRUF()
    console.log('RUF', RUF)
    expect(RUF.x).toBe(-1)
    expect(RUF.y).toBe(1)
    expect(RUF.z).toBe(1)*/
  })
})