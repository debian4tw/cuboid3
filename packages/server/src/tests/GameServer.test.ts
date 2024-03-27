import { Game, IGameHooks, IScenarioDefinition } from "@cuboid3/core";
import { GameServer } from "../game.server";
import { WebWorkerNetworkAdapter } from "../network/WebWorkerNetworkAdapter";
import { SocketIONetworkAdapter } from "../network/SocketIONetworkAdapter";
import SocketIO from "socket.io";
import { createServer } from "http";

class MockGameHooks implements IGameHooks {
  constructor() {}
  startScenarioSwitchLoop(game: Game): void {}
  onGameCreate(game: Game): void {}
  onClientConnect(game: Game): void {}
  onClientDisconnect(game: Game): void {}
}

const mockGameClassFactory = (
  id: string,
  importedScenarios: IScenarioDefinition[],
  gameHooksClass?: any
) => {
  return new Game("", importedScenarios);
};

describe("GameServer tests", () => {
  it("isRunningAsLocalWorker should return true when running with WebWorkerNetworkAdapter", () => {
    const gameServer = new GameServer(
      new WebWorkerNetworkAdapter(),
      [],
      MockGameHooks,
      mockGameClassFactory
    );

    expect(gameServer.isRunningAsLocalWorker()).toBe(true);
    gameServer.stop();
  });

  it("isRunningAsLocalWorker should return false when not running with WebWorkerNetworkAdapter", () => {
    const requestListener = function (req: any, res: any) {
      res.writeHead(200);
      res.end("Hello World from HTTPS Server");
    };
    const httpServer = createServer(requestListener);
    const port = 3005;
    const socketServer = SocketIO.listen(httpServer, { pingInterval: 5000 });
    const gameServer = new GameServer(
      new SocketIONetworkAdapter(socketServer),
      [],
      MockGameHooks,
      mockGameClassFactory
    );

    expect(gameServer.isRunningAsLocalWorker()).toBe(false);
    gameServer.stop();
    socketServer.close();
  });
});
