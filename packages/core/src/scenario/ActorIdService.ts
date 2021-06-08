export class ActorIdService {

  actorId: number
  constructor() {
    this.actorId = 1
  }

  getNextActorId() {
    this.actorId++
    return this.actorId
  }
}