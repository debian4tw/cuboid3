"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ClientActorRegistry_1 = require("../client-actors/ClientActorRegistry");
//import {ShipActor, BulletActor, FleetActor, BarrierActor} from '../../scenarios/space/actors';
const core_1 = require("@cuboid3/core");
const THREE = __importStar(require("three"));
class FleetActor extends core_1.Actor {
    constructor() {
        super(...arguments);
        this.name = "Fleet";
    }
}
const mockScenarioDefs = [
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
        initScene: function (scene) { },
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
        initScene: function (scene) { },
    },
];
const game = new core_1.Game("323", mockScenarioDefs, null);
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
    const registry = new ClientActorRegistry_1.ClientActorRegistry(game, scene, []);
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
        const cliActor = registry.findById(status[0].id);
        registry.delete(cliActor);
        expect(registry.findById(status[0].id)).toBe(undefined);
    });
    it("registry should be empty after clean", () => {
        registry.clean();
        expect(registry.getCount()).toBe(0);
    });
    it("registry should be empty when created", () => {
        const reg = new ClientActorRegistry_1.ClientActorRegistry(game, scene, []);
        expect(reg.getCount()).toBe(0);
    });
});
