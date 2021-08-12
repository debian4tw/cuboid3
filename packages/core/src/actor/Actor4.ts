import {GBox3, GBox3Vertex, GRotationCoords} from '@cuboid3/g-physics'
import {IActor} from './IActor'
import {Actor, Rectangle3} from './Actor'
import { v4 as uuidv4 } from 'uuid';
import { Shape } from '@cuboid3/g-physics'
import { GVector3 } from '@cuboid3/g-physics';
import { ActorComponent } from './components/ActorComponent';
import { GBox4 } from '@cuboid3/g-physics';
import { ClientActorType } from './ClientActorType';

export class Actor4 implements IActor{
  [key: string]: any

  id: string
  public name = 'Actor4'
  public label = 'base-actor'

  // @todo: move to combatActor
  public hitPoints = 15
  public username: string

  public shape: Shape
  public box: GBox4

  isActive: number
  public invisible = false
  wireframe: boolean = false

  protected associatedActors: Map<string,IActor>

  protected color: any

  protected previousPos: GVector3

  public assocLabel: string

  clientActorType: ClientActorType

  components: Map<string, ActorComponent>
  lastState: Object

  constructor(box: GBox4, id: string | null = null) {
    this.box = box
    this.id = id || uuidv4();
    this.shape = Shape.Box
    this.isActive = 1
    this.color = 'white'

    this.invisible = false
    this.previousPos = new GVector3(box.origin.getPosition().x,box.origin.getPosition().y,box.origin.getPosition().z)
    this.associatedActors = new Map()
    this.assocLabel = 'Actor'

    this.lastState = {}
  }

  setPositionHeight() {

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
    this.box.origin.getPosition().z = val
  }

  public setx(val: number) {
    this.box.origin.getPosition().x = val
  }

  public sety(val: number) {
    this.box.origin.getPosition().y = val
  }

  public setr(val: GRotationCoords) {
      this.box.r = val
  }

  public setry(val: number) {
      this.box.r.y = val
  }

  public setrz(val: number) {
    this.box.r.z = val
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

  public getClientActorType(): ClientActorType {
    return this.clientActorType
  }

  setUsername(username: string) {
    this.username = username
  }

  getPreviousPos(): GVector3 {
    return this.previousPos
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
        x: this.box.origin.getPosition().x,
        y: this.box.origin.getPosition().y,
        z: this.box.origin.getPosition().z,
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

  setColor(color: any) {
    this.color = color
  }

  setLabel(label: any) {
    this.label = label
  }
  getLabel() {
    return this.label
  }

  getX() {
    return this.box.origin.getPosition().x
  }

  getY() {
    return this.box.origin.getPosition().y
  }

  getZ() {
    return this.box.origin.getPosition().z
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
    this.box.origin.getPosition().z = z
  }

  public isWithinMapLimits(GameOpts: any) {
    return (this.box.origin.getPosition().x < GameOpts.maxX && this.box.origin.getPosition().x > GameOpts.minX) &&
            (this.box.origin.getPosition().z < GameOpts.maxZ && this.box.origin.getPosition().z > GameOpts.minZ)
  }

  public restoreLastPosition() {
    this.box.moveX(this.previousPos.x - this.box.origin.getPosition().x)
    this.box.moveZ(this.previousPos.z - this.box.origin.getPosition().z)
  }
}