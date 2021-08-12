import { v4 as uuidv4 } from 'uuid';
import {Shape} from '@cuboid3/g-physics'
import { ClientActorType } from './ClientActorType';
import {IActor} from './IActor'
export interface Rotation{x: number, y: number, z: number}

export interface Rectangle3{
  x: number
  y: number
  z: number
  w: number
  h: number
  d: number
}

export interface Rectangle2{
  x: number
  y: number
  w: number
  h: number
}

export class Actor implements IActor {
  [key: string]: any;
  public name = 'Actor'
  public label = 'base-actor'
  protected id: string
  protected x: number
  protected y: number
  protected z: number
  protected w: number
  protected h: number
  protected d: number
  protected r: Rotation // rotation
  protected color: any
  public isActive: number
  public invisible: boolean

  clientActorType: ClientActorType

  public shape: Shape
  public wireframe: boolean

  protected associatedActors: Map<string,IActor>
  protected orientation: number

  constructor(x: number, y: number, id: string | null = null, z: number = 0) {
    this.id = id || uuidv4();
    this.x = x
    this.y = y
    this.z = z
    this.w = 100
    this.h = 100
    this.d = 50
    this.r = {x: 0, y: 0, z: 0}

    this.clientActorType = ClientActorType.ClientSingleActor

    this.isActive = 1

    this.multiple = false

    this.shape = Shape.Box
    this.wireframe = false
    this.invisible = false
    this.createdAt = Date.now()
    this.associatedActors = new Map()
    this.lastState = {}
  }

    // adding for compatibility with actor3 as of now it has no effect
  public setPositionHeight(targetHeight: number) {
    //
  }

  setLastState(state: any) {
    this.lastState = state
  }

  getLastState() {
    return this.lastState
  }

  public setProp(prop: any, value: any) {

    if (typeof this['set'+prop] !== "undefined") {
      this['set'+prop](value)
    } else {
      this[prop] = value
    }
  }

  public setProps(obj: any) {
    Object.keys(obj).forEach((key) => {
      this.setProp(key, obj[key])
    })
  }

  public getClientActorType(): ClientActorType {
    // console.log("clientActorType", this.name, this.clientActorType)
    return this.clientActorType
  }

  public getAssociatedActors() {
    return this.associatedActors
  }

  public getAssociatedActor(associationLabel: string) {
    return this.associatedActors.get(associationLabel)
  }

  public setAssociatedActor(associationLabel: string, actor: IActor){
    this.associatedActors.set(associationLabel, actor);
  }

  setColor(color: any) {
    this.color = color
  }

  public setOrientation(orientation: number) {
    this.orientation = orientation;
  }

  public getColor() : string{
    return this.color;
  }

  public getState(): any {
    const state = {id: this.id,  name: this.name, x: this.x, y: this.y}
    return state
  }

  public update() {
    //
  }

  public getId() {
    return this.id;
  }

  setId(id: string) {
    this.id = id
  }

  public setState(state: any): void {
    //
  }
  public setLabel(label: any): void {
    this.label = label;
  }

  public getLabel(): string {
    return this.label
  }
  public getX() {
    return this.x
  }

  public getY() {
        // console.log('getY', this.y);
    return this.y
  }

  public getZ() {
    return this.z
  }

  public getW() {
    return this.w
  }

  public getH() {
    return this.h
  }

  public getD() {
    return this.d;
  }

  public getR() {
    return this.r
  }

  public setZ(z: number) {
    this.z = z
  }

  getCoordsAndDimensions (): Rectangle3 {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
      w: this.w,
      h: this.h,
      d: this.d
    }
  }

  getIndexCoordsAndDimensions (i: number): Rectangle3 {
    return this.getCoordsAndDimensions()
  }

  setUsername(username: string) {
    this.username = username
  }

}
