import {GameEvent} from './GameEvent'

export class GameEventBus {

  private events: Array<GameEvent>

  constructor() {
    this.events = []
  }

  addEvent(event: GameEvent) {
    this.events.push(event)
  }

  popEvents() {
    return this.events
  }

  flush() {
    this.events = []
  }
}