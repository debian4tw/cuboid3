export interface IActorSerializedState {
  id: string,
  name: string,
  label: string, 
  isActive: number,
}

export interface IActorMultipleSerializedState {
  id: string,
  name: string,
  label: string,
  active: Array<any>,
}

