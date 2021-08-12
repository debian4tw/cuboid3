/* eslint-disable no-unused-vars */
import { GVector3 } from '../math/GMath'
import { GParticle } from './GParticle'

export enum GBox3Vertex {
  RUF,
  RDF,
  LUF,
  LDF,
  RUB,
  RDB,
  LUB,
  LDB
}

export interface GRotationCoords {
  x: number,
  y: number,
  z: number
}

export type GBodyNode = {x: number, y: number, z: number};

export class GRigidBox {
  protected position: GVector3
  protected velocity: GVector3
  protected acceleration: GVector3

  orientation: number

  private mass: number
  private inverseMass: number
  private center: GParticle
  private nodes: Array<GBodyNode>

  forceAccum: GVector3
  torqueAccum: GVector3
  lastFrameAcceleration: GVector3

  // eslint-disable-next-line no-useless-constructor
  constructor () {

  }
}
