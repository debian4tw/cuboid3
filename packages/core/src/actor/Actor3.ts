import {GBox3, GBox3Vertex, GRotationCoords} from '@cuboid3/g-physics'
import {IActor} from './IActor'
import {Actor, Rectangle3} from './Actor'
import { v4 as uuidv4 } from 'uuid';
import { Shape } from '@cuboid3/g-physics'
import { GVector3 } from '@cuboid3/g-physics';
import { ActorComponent } from './components/ActorComponent';
import { ClientActorType } from './ClientActorType';

export class Actor3 implements IActor {
  [key: string]: any

  id: string
  public name = 'Actor3'
  public label = 'base-actor'

  // @todo: move to combatActor
  public hitPoints = 15
  public username: string

  public shape: Shape
  public box: GBox3

  isActive: number
  public invisible = false
  wireframe: boolean = false

  protected associatedActors: Map<string,IActor>

  protected color: any

  clientActorType: ClientActorType

  protected previousPos: GVector3

  public assocLabel: string

  components: Map<string, ActorComponent>

  lastState: Object

  constructor(box: GBox3, id: string | null = null) {
    this.box = box
    this.id = id || uuidv4();
    this.shape = Shape.Box
    this.isActive = 1
    this.color = 'white'

    this.invisible = false
    this.previousPos = new GVector3(box.origin.x,box.origin.y,box.origin.z)
    this.associatedActors = new Map()
    this.assocLabel = 'Actor'

    this.lastState = {}
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

  public setz(val: number) {
    this.box.origin.z = val
  }

  public setx(val: number) {
      this.box.origin.x = val
  }

  public sety(val: number) {
      this.box.origin.y = val
  }

  public setr(val: GRotationCoords) {
      this.box.r = val
  }

  public setry(val: number) {
      this.box.r.y = val
  }

  getComponent(componentName: string) {
    return this.components?.get(componentName)
  }

  addComponent(componentName: string, component: ActorComponent) {
    if (typeof this.components === "undefined") {
      this.components = new Map()
    }
    if (componentName && component) {
      this.components.set(componentName, component)
    }
  }

  setUsername(username: string) {
    this.username = username
  }

  getPreviousPos(): GVector3 {
    return this.previousPos
  }

  setPreviousPos(vec: GVector3) {
    this.previousPos.set(vec.x, vec.y, vec.z)
  }

  public setAssociatedActor(associationLabel: string, actor: IActor) {
    //console.log(actor);
    if (typeof actor === "undefined") {
      return
    }
    if (this.associatedActors.get(associationLabel) !== undefined) {
      return
    }
    //console.log('setting associated actor', actor.name, actor.label)
    this.associatedActors.set(associationLabel, actor);
    // set inverse association too
    //console.log('set inverse assoc', this.assocLabel)
    actor.setAssociatedActor(this.assocLabel, this)
  }

  public getAssociatedActors() {
    return this.associatedActors
  }

  public getAssociatedActor(associationLabel: string) {
    return this.associatedActors.get(associationLabel)
  }


  public getClientActorType(): ClientActorType {
    return this.clientActorType
  }

  public getId() {
    return this.id
  }

  setId(id: string) {
    this.id = id
  }

  public getColor() {
    return this.color
  }

  getCoordsAndDimensions (): Rectangle3 {
    //console.log('trying to get coords', this.box)
    return {
        x: this.box.origin.x,
        y: this.box.origin.y,
        z: this.box.origin.z,
        w: this.box.w,
        h: this.box.h,
        d: this.box.d 
    }
}


  public getState() {
    return {
    }
  }

  setState(state: any) {

  }

  update() {

  }

  public setOrientation(orientation: number) {
  }

  setLabel(label: any) {
    this.label = label
  }

  public setPositionHeight(targetHeight: number) {
    // delta = targetHeight - sourceHeight
    this.box.moveY(targetHeight - this.box.origin.y)
  }

  getLabel() {
    return this.label
  }

  getX() {
    return this.box.origin.x
  }

  getY() {
    return this.box.origin.y
  }

  getZ() {
    return this.box.origin.z
  }

  getW() {
    return this.box.w
  }

  getH() {
    return this.box.h
  }

  getD() {
    return this.box.d
  }

  getR() {
    return this.box.r
  }

  public setZ(z: number) {
    this.box.origin.z = z
  }

  public isWithinMapLimits(GameOpts: any) {
    return (this.box.origin.x < GameOpts.maxX && this.box.origin.x > GameOpts.minX) &&
            (this.box.origin.z < GameOpts.maxZ && this.box.origin.z > GameOpts.minZ)
  }

  public restoreLastPosition() {
    this.box.moveX(this.previousPos.x - this.box.origin.x)
    this.box.moveZ(this.previousPos.z - this.box.origin.z)
  }
}