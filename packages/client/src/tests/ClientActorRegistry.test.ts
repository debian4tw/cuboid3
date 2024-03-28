import { ClientActorRegistry } from "../client-actors/ClientActorRegistry";
//import {ShipActor, BulletActor, FleetActor, BarrierActor} from '../../scenarios/space/actors';
import { Actor, Actor3, Game, IScenarioDefinition } from "@cuboid3/core";
import * as THREE from "three";

class FleetActor extends Actor {
  [key: string]: any;
  public name = "Fleet";
  color: "red";
}

const mockScenarioDefs: IScenarioDefinition[] = [
  {
    id: 4,
    name: "empty scenario",
    opts: {},
    actors: {},
    envActors: {},
    roleActors: {},
    collisions: {},
    roleCommands: {},
    cameraStrategy: {},
    initScene: function (scene: THREE.Scene): void {},
  },
  {
    id: 1,
    name: "mock scenario",
    opts: {},
    actors: {
      Fleet: FleetActor,
      Ship: FleetActor,
      Bullet: FleetActor,
    },
    envActors: {},
    roleActors: {},
    collisions: {},
    roleCommands: {},
    cameraStrategy: {},
    initScene: function (scene: THREE.Scene): void {},
  },
];

const game = new Game("323", mockScenarioDefs, null);
game.setScenario(1);
const scene = new THREE.Scene();

const status = [
  { id: "58d6754c-3246-48dd-ab95-59397eb9baed", name: "Fleet", x: 50, y: 300 },
  { id: "7a46ba50-952d-4449-b53a-6af6e9598f2b", name: "Ship", x: 400, y: -80 },
  { id: "2ccc9485-390c-4530-8ce8-7a1ff11e4a65", name: "Bullet", x: 0, y: 0 },
  { id: "5d55b00f-5cb2-4980-a0ea-e8cab7ddebc3", name: "Ship", x: 250, y: 320 },
  { id: "430a8ee5-9417-4bd3-980b-f81d58fddf81", name: "Bullet", x: 0, y: 0 },
];

const act0 = game.getScenario().addRemoteActor(status[0]);
const act1 = game.getScenario().addRemoteActor(status[1]);
const act2 = game.getScenario().addRemoteActor(status[2]);

describe("ClientActoRegistry", function () {
  const registry = new ClientActorRegistry(game, scene, []);
  registry.create(act0);
  registry.create(act1);
  registry.create(act2);

  it("registry should find by id of remoteActor", () => {
    const cliActor = registry.findById(status[0].id);
    expect(cliActor).not.toBe(undefined);
  });

  it("registry should not find by non-existant actor id", () => {
    const cliActor = registry.findById("123");
    expect(cliActor).toBe(undefined);
  });

  it("registry should not find after deleting cliActor", () => {
    const cliActor = registry.findById(status[0].id)!;
    registry.delete(cliActor);
    expect(registry.findById(status[0].id)).toBe(undefined);
  });

  it("registry should be empty after clean", () => {
    registry.clean();
    expect(registry.getCount()).toBe(0);
  });

  it("registry should be empty when created", () => {
    const reg = new ClientActorRegistry(game, scene, []);
    expect(reg.getCount()).toBe(0);
  });
});
