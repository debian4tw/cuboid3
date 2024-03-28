import { Actor } from "../actor/Actor";
import { Actor3 } from "../actor/Actor3";
import { IComponentDefinition } from "../actor/components/ActorComponent";
import { IActor } from "../actor/IActor";
import { IScenario } from "./IScenario";
import { EventHandler } from "../event/EventHandler";
import { Player } from "../player/player";
import { Role } from "../player/role";

import { ICollisionManager } from "../collision/ICollisionManager";
import { IRoleManager } from "../role/IRoleManager";

import { RoleManager } from "../role/Role.manager";
import { CollisionManager } from "../collision/Collision.manager";

import { SpawnLocationManager } from "./SpawnLocation.manager";
//import {spawnLocations} from './SpawnLocations'
import { NetworkUtils } from "../util";
import { ActorIdService } from "./ActorIdService";
import { IScenarioDefinition } from "./IScenarioDefinition";
import { ScenarioHooks } from "./";
import { IScenarioComponent } from "./IScenarioComponent";
import { ISpawnLocationManager } from "./ISpawnLocationManager";

const botActors: any[] = [];

export class Scenario implements IScenario {
  name: string;
  actors: IActor[];
  gameId: string;

  configEnvActors: any[];
  configRoleActors: any[];
  actorRepository: any;

  collisionManager: ICollisionManager;
  roleManager: IRoleManager;
  spawnLocationManager: ISpawnLocationManager;
  actorIdService: ActorIdService;

  removedActorsBuffer: string[];

  events: Map<
    string,
    (scenario: Scenario, socketId: string, data: any) => void
  >;

  scenarioHooks: ScenarioHooks;
  components: Map<string, IScenarioComponent>;

  constructor(scenarioDef: IScenarioDefinition) {
    this.actors = [];
    this.removedActorsBuffer = [];

    this.name = scenarioDef.name;
    this.configEnvActors = scenarioDef.envActors;
    this.configRoleActors = scenarioDef.roleActors;
    this.actorRepository = scenarioDef.actors;

    this.actorIdService = new ActorIdService();

    this.events = new Map();

    if (scenarioDef.roleManager) {
      this.roleManager = new scenarioDef.roleManager(
        this,
        scenarioDef.envActors,
        scenarioDef.roleActors,
        scenarioDef.roleCommands
      );
    } else {
      this.roleManager = new RoleManager(
        this,
        scenarioDef.envActors,
        scenarioDef.roleActors,
        scenarioDef.roleCommands
      );
    }

    if (scenarioDef.collisionManager) {
      this.collisionManager = new scenarioDef.collisionManager(
        this,
        scenarioDef.collisions
      );
    } else {
      this.collisionManager = new CollisionManager(
        this,
        scenarioDef.collisions
      );
    }

    if (scenarioDef.scenarioHooks) {
      this.scenarioHooks = new scenarioDef.scenarioHooks(this);
    } else {
      this.scenarioHooks = new ScenarioHooks(this);
    }

    if (scenarioDef.spawnLocations) {
      if (scenarioDef.spawnLocationManager) {
        this.spawnLocationManager = new scenarioDef.spawnLocationManager(
          scenarioDef.spawnLocations
        );
      } else {
        this.spawnLocationManager = new SpawnLocationManager(
          scenarioDef.spawnLocations
        );
      }
    }

    if (typeof scenarioDef.events !== "undefined") {
      scenarioDef.events.forEach((ev: any) => {
        this.events.set(ev.eventName, ev.callback);
      });
    }
    // this.setName(scenarioDef.name)
  }

  public init(players: any[], gameId: string) {
    this.gameId = gameId;
    this.collisionManager.init(this.gameId);
    this.roleManager.init(players);
    this.scenarioHooks.init();
  }

  public destroy() {
    this.scenarioHooks.onDestroy();
  }

  addBot(index: number, spawn: any) {
    if (botActors.length === 0) {
      return;
    }
    if (typeof botActors[index] === "undefined") {
      return;
    }
    botActors[index].forEach((envActorConfig: any) => {
      const act = this.addEnvActor(envActorConfig) as Actor3;
      if (
        typeof envActorConfig.primary !== "undefined" &&
        envActorConfig.primary === true
      ) {
        act.respawn(spawn);
      }
    });
  }

  removeBot() {
    // console.log("removing bot");
    const actor = this.actors.find((act) => act.label.startsWith("bot"));
    // console.log("found actor:", actor?.label)
    if (actor) {
      actor.getAssociatedActors().forEach((act) => {
        this.removeActor(act);
      });
      this.removeActor(actor);
    }
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string) {
    this.name = name;
  }

  findActorByLabel(label: string) {
    return this.actors.find((actor) => actor.label === label);
  }

  findActorById(id: string) {
    return this.actors.find((actor) => actor.getId() === id);
  }

  update() {
    this.actors.forEach((actor) => {
      actor.update();
      this.scenarioHooks.afterUpdate(actor);
    });
  }

  update2() {
    for (let i = 0, length = this.actors.length; i < length; i++) {
      this.actors[i].update();
      this.scenarioHooks.afterUpdate(this.actors[i]);
    }
  }

  updateCollisions() {
    this.collisionManager?.update();
  }

  onRoleCommand(playerId: string, command: string, value: any = false) {
    this.roleManager.onRoleCommand(playerId, command, value);
  }

  addPlayer(player: Player) {
    this.roleManager.addPlayer(player);
  }

  roleSelected(player: Player, roleName: string) {
    this.roleManager.roleSelected(player, roleName);
  }

  removePlayer(playerId: string) {
    this.roleManager.removePlayer(playerId);
  }

  removeActor(roleActor: IActor) {
    this.collisionManager.onActorRemove(roleActor.getLabel());
    this.addToRemovedActorList(roleActor.getId());
    this.actors = this.actors.filter((actor) => actor !== roleActor);
  }

  addToRemovedActorList(actorId: string) {
    this.removedActorsBuffer.push(actorId);
  }

  getRemovedActorList() {
    const removedActors = this.removedActorsBuffer;
    this.flushRemovedActorList();
    return removedActors;
  }

  flushRemovedActorList() {
    this.removedActorsBuffer = [];
  }

  addEnvActor(envActor: any) {
    // @todo: actor factory
    const act = new envActor.type(...envActor.params);
    act.setLabel(envActor.label);
    act.setId(this.actorIdService.getNextActorId());

    if (typeof envActor.associatedActors !== "undefined") {
      // console.log('actorForRole.associated', actorForRole.associated);
      envActor.associatedActors.forEach((associated: any) => {
        if (
          typeof associated.associationLabel === "undefined" ||
          typeof associated.actorLabel === "undefined"
        ) {
          throw new Error(
            "incorrect actor association config " + envActor.label
          );
        }
        act.setAssociatedActor(
          associated.associationLabel,
          this.findActorByLabel(associated.actorLabel)
        );
      });
    }

    if (typeof envActor.orientation !== "undefined") {
      // console.log('envActor.orientation', envActor.orientation);
      act.setOrientation(envActor.orientation);
    }

    if (typeof envActor.components !== "undefined") {
      envActor.components?.forEach((compDef: IComponentDefinition) => {
        (act as Actor3).addComponent(compDef.label, new compDef.component(act));
      });
    }
    this.actors.push(act);

    return act;
  }

  removeActorByLabel(label: string) {
    // console.log("removeActorByLabel", label)
    const actor = this.findActorByLabel(label);
    if (actor) {
      actor?.getAssociatedActors()?.forEach((assocActor) => {
        this.removeActor(assocActor);
      });
      this.addToRemovedActorList(actor.getId());
      this.actors = this.actors.filter((act) => act.label !== label);
    }
  }

  addRemoteActor(remoteObj: any) {
    // console.log('addRemoreActor',z)
    if (typeof this.actorRepository[remoteObj.name] === "undefined") {
      throw new Error(
        `actor name: ${remoteObj.name} not found in actorRepository`
      );
    }
    const z = remoteObj.z || 0;

    const actor = new this.actorRepository[remoteObj.name](
      remoteObj.x,
      remoteObj.y,
      remoteObj.id,
      z,
      remoteObj.args
    );
    // console.log('adding actor', remoteObj)
    // console.log(actor);
    if (typeof remoteObj.color !== "undefined") {
      actor.setColor(remoteObj.color);
    }

    if (typeof remoteObj.label !== "undefined") {
      actor.setLabel(remoteObj.label);
    }
    this.actors.push(actor);
    return actor;
  }

  addRoleActor(role: Role, configActorForRole: any) {
    // @todo: actor factory
    // console.log('addRoleActor', configActorForRole)
    const actor = new configActorForRole.type(
      configActorForRole.x,
      configActorForRole.y,
      this.actorIdService.getNextActorId(),
      configActorForRole.z || 0
    );

    role.addCommands(actor, this);
    role.actors.push(actor);
    actor.setLabel(configActorForRole.label);

    if (typeof configActorForRole.color !== "undefined") {
      actor.setColor(configActorForRole.color);
    }

    if (typeof configActorForRole.associatedActors !== "undefined") {
      configActorForRole.associatedActors.forEach((associated: any) => {
        if (
          typeof associated.associationLabel === "undefined" ||
          typeof associated.actorLabel === "undefined"
        ) {
          throw new Error(
            "incorrect actor association config " + configActorForRole.label
          );
        }
        actor.setAssociatedActor(
          associated.associationLabel,
          this.findActorByLabel(associated.actorLabel)
        );
      });
    }

    if (typeof configActorForRole.orientation !== "undefined") {
      actor.setOrientation(configActorForRole.orientation);
    }

    if (typeof configActorForRole.z !== "undefined") {
      actor.setZ(configActorForRole.z);
    }

    if (typeof configActorForRole.components !== "undefined") {
      configActorForRole.components?.forEach(
        (compDef: IComponentDefinition) => {
          (actor as Actor3).addComponent(
            compDef.label,
            new compDef.component(actor)
          );
        }
      );
    }

    this.actors.push(actor);

    if (typeof configActorForRole.primary !== "undefined") {
      // @todo: refactor pls
      actor.setUsername(role.player.name);
      role.setPrimaryActorId(actor.getId());
      setTimeout(() => {
        EventHandler.publish(
          "server:primaryActorAdded",
          role.getPlayer().getId(),
          actor.getId()
        );
      }, 1500);
    }

    return actor;
  }

  getState(): object {
    const state: any = [];
    // let start3 = performance.now()
    this.actors.forEach((actor) => {
      if (actor.invisible !== true) {
        state.push(actor.getState());
      }
    });
    // console.log('processed actors getstate in: (ms)', performance.now() - start3)

    return {
      gameId: this.gameId,
      type: this.name,
      // players: this.roleManager.getScenarioPlayers(),
      state,
    };
  }

  getDiffState(): object {
    const state: any = [];
    // let start3 = performance.now()
    this.actors.forEach((actor) => {
      if (actor.invisible !== true) {
        state.push({
          id: actor.getId(),
          ...NetworkUtils.diffState(actor.getLastState(), actor.getState()),
        });
        actor.setLastState(actor.getState());
      }
    });
    // console.log('processed actors getstate in: (ms)', performance.now() - start3)

    return {
      // gameId: this.gameId,
      type: this.name,
      // players: this.roleManager.getScenarioPlayers(),
      state,
      removed: this.getRemovedActorList(),
    };
  }

  setDiffState(state: any) {
    const data = state.state;
    for (let i = 0, il = data.length; i < il; i++) {
      if (data[i] != null && typeof this.actors[i] !== "undefined") {
        this.actors[i].setProps(data[i]);
      }
    }
  }

  setState(state: any) {
    const data = state.state;
    for (let i = 0, il = data.length; i < il; i++) {
      if (data[i] != null && typeof this.actors[i] !== "undefined") {
        this.actors[i].setState(data[i]);
      }
    }
  }

  findRoleByLabel(label: string) {
    return this.roleManager.findRoleByLabel(label);
  }

  findRoleById(roleId: string) {
    return this.roleManager.findRoleById(roleId);
  }

  getActors() {
    return this.actors;
  }

  // refactor into RoleManager
  addActor(actor: IActor) {
    this.actors.push(actor);
  }

  getActorRepository() {
    return this.actorRepository;
  }

  public checkWinCondition() {
    // console.log('check win condition')
    this.scenarioHooks.checkWinCondition();
  }

  onTeamWon(team: number) {
    EventHandler.publish("server:teamWon", this.gameId, team);
  }

  getGameId(): string {
    return this.gameId;
  }

  getSpawnLocationManager() {
    return this.spawnLocationManager;
  }

  respawnActorByLabel(actorLabel: string) {
    const actor = this.findActorByLabel(actorLabel) as Actor3;
    if (!actor) {
      return;
    }

    if (typeof (actor as any).respawn !== "undefined") {
      const location = this.spawnLocationManager.getNextAvailable();
      actor.respawn(location);
    }
  }

  onEvent(socketId: string, data: { eventName: string; data: any }) {
    // console.log("Scenario onEvent", data)
    // console.log("scenario Events", this.events)
    const event = this.events.get(data.eventName);
    if (typeof event !== "undefined") {
      event(this, socketId, data.data);
    }
  }

  getComponent(componentName: string) {
    return this.components?.get(componentName);
  }

  addComponent(componentName: string, component: IScenarioComponent) {
    if (typeof this.components === "undefined") {
      this.components = new Map();
    }
    if (componentName && component) {
      this.components.set(componentName, component);
    }
  }

  getRoleManager() {
    return this.roleManager;
  }
}
