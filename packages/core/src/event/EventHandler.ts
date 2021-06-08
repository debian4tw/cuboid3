class EventHandler {

  private static instance: EventHandler | null = null
  private events: any

  public static getInstance() : EventHandler {
    if (this.instance === null) {
      this.instance = new EventHandler()
    }
    return this.instance
  }

  private constructor() {
    this.events = {}
  }

  public publish(eventName: string, ...args: any) {
    //console.log('publishEvent', eventName, ...args)
    if (typeof this.events[eventName] === "undefined") {
      return
    }
    this.events[eventName].forEach((eventCallback: any) => {
      eventCallback(...args)
    }); 
  }

  public subscribe(eventName: any, callback: Function) {
    if (typeof this.events[eventName] === "undefined") {
      this.events[eventName] = []
    }
    //console.log('subscribeEvent', eventName)
    this.events[eventName].push(callback)
  }

  public cleanEvent(eventName: any) {
    this.events[eventName] = []
  }
}
let handler = EventHandler.getInstance()
export {handler as EventHandler} 