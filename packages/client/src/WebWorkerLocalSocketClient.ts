import { Random } from "@cuboid3/core";

/*
 * Fake socket interface wrapping onmessage/postMessage of WebWorker
 * To be used by GameClient talking with GameServer running on a
 * browser WebWorker
 */
export class WebWorkerLocalSocketClient {
  private worker: Worker;
  private eventResolvers: Record<string, (...args: any[]) => void>;
  public id: string;

  constructor(worker: Worker) {
    this.worker = worker;
    this.id = Random.getRandomInt(1000000, 100).toString();
    this.eventResolvers = {};
    this.worker.onmessage = (ev) => {
      //console.log("this.worker.onmessage", ev.data["name"]);
      //console.log(this.eventResolvers);
      this.eventResolvers[ev.data["name"]](...ev.data["args"]);
    };
  }

  connect(name: string, gameId: string) {
    this.worker.postMessage({ name: "connect", args: [name, gameId] });
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.eventResolvers[event] = callback;
  }

  off(event: string) {
    delete this.eventResolvers[event];
  }

  emit(name: string, ...args: any[]) {
    this.worker.postMessage({ name, args });
  }

  disconnect() {
    this.worker.terminate();
  }
}
