import { Shape } from '@cubic-eng/g-physics'
import { ClientActorType } from './ClientActorType'
import { IActorMultipleSerializedState, IActorSerializedState } from './IActorSerializedState'

export interface IActor {

  shape: Shape
  isActive: number
  invisible: boolean
  wireframe: boolean
  name: string
  label: string
  clientActorType: ClientActorType

  getCoordsAndDimensions(): any
  getColor(): string
  getId(): string
  setId(id: string): void

  getState(): object | IActorSerializedState | IActorMultipleSerializedState
  setState(state: any): void

  getAssociatedActors(): Map<string,IActor>
  setAssociatedActor(associationLabel: string, actor: IActor): void
  update(): void

  setLabel(label: any): void
  getLabel(): string

  getX(): number
  getY(): number
  getZ(): number
  getW(): number
  getH(): number
  getD(): number

  getR(): any

  getClientActorType(): ClientActorType

  setProps(obj: any): void
  setLastState(state: any): void

  getLastState(): object
}