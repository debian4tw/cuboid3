import {GBox3, GBox3Vertex, GRotationCoords} from '../shape/GBox3'
import {GVector3, Axis} from '../math/GVector3'
describe('Box 3 Test', function() {

  it('dimensions should match for 2,2,2 offset box ', function() {
    let m1 = new GBox3(new GVector3(1,1,1),2,2,2)

    let RUF = m1.getNode(GBox3Vertex.RUF)
    expect(RUF.x).toBe(2)
    expect(RUF.y).toBe(2)
    expect(RUF.z).toBe(2)
  })


  it('dimensions should match for 2,2,2 rotated box ', function() {
    let m1 = new GBox3(new GVector3(0,0,0),2,2,2)
    m1.rotateZ(90)
    let RUF = m1.getNode(GBox3Vertex.RUF)
    expect(RUF.x).toBe(-1)
    expect(RUF.y).toBe(1)
    expect(RUF.z).toBe(1)
  })

  it('dimensions should match for 2,2,2 rotated box ', function() {
    let m1 = new GBox3(new GVector3(0,0,0),10,2,2)
    m1.rotateZ(90)
    let RUF = m1.getNode(GBox3Vertex.RUF)
    expect(RUF.x).toBe(-1)
    expect(RUF.y).toBe(5)
    expect(RUF.z).toBe(1)
  })
  
  it('dimensions should match for 2,2,2 rotated box ', function() {
    let m1 = new GBox3(new GVector3(0,0,0),6*2,3*2,1*2)
    m1.moveX(1)
    m1.moveY(1)
    m1.moveZ(1)
    m1.rotateZ(90)
    let RUF = m1.getNode(GBox3Vertex.RUF)
    console.log(RUF)
    expect(RUF.x).toBe(-4)
    expect(RUF.y).toBe(7)
    expect(RUF.z).toBe(2)

    expect(m1.origin.x).toBe(1)
    expect(m1.origin.y).toBe(1)
    expect(m1.origin.z).toBe(1)
  })

  it('dimensions should match for 2,2,2 rotated on pivot box ', function() {
    let m1 = new GBox3(new GVector3(8,1,0), 2*2,1*2,1*2)

    let RUF = m1.getNode(GBox3Vertex.RUF)
    let LUF = m1.getNode(GBox3Vertex.LUF)
    let RDF = m1.getNode(GBox3Vertex.RDF)
    let LDF = m1.getNode(GBox3Vertex.LDF)
    let LDB = m1.getNode(GBox3Vertex.LDB)
    console.log('RUF',RUF)
    console.log('LUF',LUF)
    console.log('RDF',RDF)
    console.log('LDF',LDF)
    console.log('LDB',LDB)
    console.log('****')
    //m1.moveX(-10)
    //m1.rotate(90, Axis.Z)
    m1.rotateOnPivot2(new GVector3(3,1,0),90,Axis.Z)
    //m1.moveX(10)
    RUF = m1.getNode(GBox3Vertex.RUF)
    LUF = m1.getNode(GBox3Vertex.LUF)
    RDF = m1.getNode(GBox3Vertex.RDF)
    LDF = m1.getNode(GBox3Vertex.LDF)
    LDB = m1.getNode(GBox3Vertex.LDB)
    console.log('RUF',RUF)
    console.log('LUF',LUF)
    console.log('RDF',RDF)
    console.log('LDF',LDF)
    console.log('LDB',LDB)

    console.log('rotated origin', m1.origin)
    expect(RUF.x).toBe(2)
    expect(RUF.y).toBe(8)
    expect(RUF.z).toBe(1)

    expect(LUF.x).toBe(2)
    expect(LUF.y).toBe(4)
    expect(LUF.z).toBe(1)

    /*expect(m1.origin.x).toBe(3)
    expect(m1.origin.y).toBe(6)
    expect(m1.origin.z).toBe(0)*/
  })



  it('dimensions should match for 2,2,2 rotated on cloned pivot box ', function() {
    let m1 = new GBox3(new GVector3(8,1,0), 2*2,1*2,1*2)
    //m1.moveX(-10)
    //m1.rotate(90, Axis.Z)
    m1.rotateOnPivot2(new GVector3(3,1,0),90,Axis.Z)

    let s = m1.serialize()
    console.log('serialized', s)
    let m2 = new GBox3(new GVector3(s.x,s.y,s.z), s.w, s.h, s.d)
    m2.setRotation(s.r)
    /*m2.rotate(s.r.x, Axis.X)
    m2.rotate(s.r.y, Axis.Y)
    m2.rotate(s.r.z, Axis.Z)*/

    let RUF = m2.getNode(GBox3Vertex.RUF)
    let LUF = m2.getNode(GBox3Vertex.LUF)
    let RDF = m2.getNode(GBox3Vertex.RDF)
    let LDF = m2.getNode(GBox3Vertex.LDF)
    let LDB = m2.getNode(GBox3Vertex.LDB)
    console.log('RUF',RUF)
    console.log('LUF',LUF)
    console.log('RDF',RDF)
    console.log('LDF',LDF)
    console.log('LDB',LDB)
    console.log('rotated origin', m2.origin)
    expect(RUF.x).toBe(2)
    expect(RUF.y).toBe(8)
    expect(RUF.z).toBe(1)

    expect(LUF.x).toBe(2)
    expect(LUF.y).toBe(4)
    expect(LUF.z).toBe(1)

    expect(m2.origin.x).toBe(3)
    expect(m2.origin.y).toBe(6)
    expect(m2.origin.z).toBe(0)
  })

})
