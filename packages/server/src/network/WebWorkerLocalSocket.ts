import { Random } from "@cuboid3/core";
declare var onmessage: ((this: Window, ev: MessageEvent) => any) | null;
declare var window: any;
/*
 * Fake socket interface wrapping onmessage/postMessage of WebWorkers
 * to be used by GameServer running on client browser
 */
export class WebWorkerLocalSocket {
  private eventResolvers: Record<string, (...args: any[]) => void>;
  public id: string;
  rooms: Record<string, any>;
  handshake: Record<string, any>;

  setHandshake(name: string, gameId: any) {
    //@todo: refactor each network adapter should know how to get data, no need to mimic socketio
    this.handshake = {
      query: {
        name,
        gameId,
      },
    };
  }
  constructor() {
    this.id = Random.getRandomInt(1000000, 100).toString();
    this.eventResolvers = {};
    this.attachOnMessage();
    this.rooms = {};
  }

  join(gameId: string) {
    this.rooms[gameId] = {};
  }

  attachOnMessage() {
    (window as any).onmessage = (ev: any) => {
      //console.log('WorkerSocketServer onmessage', ev);
      if (ev.data && typeof ev.data["name"] !== "undefined") {
        if (typeof ev.data["args"] !== "undefined" && ev.data["args"].length) {
          this.eventResolvers[ev.data["name"]](...ev?.data["args"]);
        } else {
          this.eventResolvers[ev.data["name"]]();
        }
      }
    };
  }

  /*connect() {
    postMessage({ name: "connect" }, "*");
  }*/

  on(event: string, callback: (...args: any[]) => void) {
    this.eventResolvers[event] = callback;
  }

  off(event: string) {
    delete this.eventResolvers[event];
  }

  emit(name: string, ...args: any[]) {
    /*if (!this.eventResolvers.hasOwnProperty(name)) {
      return;
    }*/
    if (typeof args === "undefined" || args === null) {
      args = [];
    }
    // @ts-ignore
    postMessage({ name: name, args: args });
  }

  disconnect() {}
}
