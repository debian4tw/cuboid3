"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scenario = void 0;
const EventHandler_1 = require("../event/EventHandler");
const Role_manager_1 = require("../role/Role.manager");
const Collision_manager_1 = require("../collision/Collision.manager");
const SpawnLocation_manager_1 = require("./SpawnLocation.manager");
//import {spawnLocations} from './SpawnLocations'
const util_1 = require("../util");
const ActorIdService_1 = require("./ActorIdService");
const _1 = require("./");
const botActors = [];
class Scenario {
    constructor(scenarioDef) {
        this.actors = [];
        this.removedActorsBuffer = [];
        this.name = scenarioDef.name;
        this.configEnvActors = scenarioDef.envActors;
        this.configRoleActors = scenarioDef.roleActors;
        this.actorRepository = scenarioDef.actors;
        this.actorIdService = new ActorIdService_1.ActorIdService();
        this.events = new Map();
        if (scenarioDef.roleManager) {
            this.roleManager = new scenarioDef.roleManager(this, scenarioDef.envActors, scenarioDef.roleActors, scenarioDef.roleCommands);
        }
        else {
            this.roleManager = new Role_manager_1.RoleManager(this, scenarioDef.envActors, scenarioDef.roleActors, scenarioDef.roleCommands);
        }
        if (scenarioDef.collisionManager) {
            this.collisionManager = new scenarioDef.collisionManager(this, scenarioDef.collisions);
        }
        else {
            this.collisionManager = new Collision_manager_1.CollisionManager(this, scenarioDef.collisions);
        }
        if (scenarioDef.scenarioHooks) {
            this.scenarioHooks = new scenarioDef.scenarioHooks(this);
        }
        else {
            this.scenarioHooks = new _1.ScenarioHooks(this);
        }
        if (scenarioDef.spawnLocations) {
            if (scenarioDef.spawnLocationManager) {
                this.spawnLocationManager = new scenarioDef.spawnLocationManager(scenarioDef.spawnLocations);
            }
            else {
                this.spawnLocationManager = new SpawnLocation_manager_1.SpawnLocationManager(scenarioDef.spawnLocations);
            }
        }
        if (typeof scenarioDef.events !== "undefined") {
            scenarioDef.events.forEach((ev) => {
                this.events.set(ev.eventName, ev.callback);
            });
        }
        // this.setName(scenarioDef.name)
    }
    init(players, gameId) {
        this.gameId = gameId;
        this.collisionManager.init(this.gameId);
        this.roleManager.init(players);
        this.scenarioHooks.init();
    }
    destroy() {
        this.scenarioHooks.onDestroy();
    }
    addBot(index, spawn) {
        if (botActors.length === 0) {
            return;
        }
        if (typeof botActors[index] === "undefined") {
            return;
        }
        botActors[index].forEach((envActorConfig) => {
            const act = this.addEnvActor(envActorConfig);
            if (typeof envActorConfig.primary !== "undefined" &&
                envActorConfig.primary === true) {
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
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    findActorByLabel(label) {
        return this.actors.find((actor) => actor.label === label);
    }
    findActorById(id) {
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
        var _a;
        (_a = this.collisionManager) === null || _a === void 0 ? void 0 : _a.update();
    }
    onRoleCommand(playerId, command, value = false) {
        this.roleManager.onRoleCommand(playerId, command, value);
    }
    addPlayer(player) {
        this.roleManager.addPlayer(player);
    }
    roleSelected(player, roleName) {
        this.roleManager.roleSelected(player, roleName);
    }
    removePlayer(playerId) {
        this.roleManager.removePlayer(playerId);
    }
    removeActor(roleActor) {
        this.collisionManager.onActorRemove(roleActor.getLabel());
        this.addToRemovedActorList(roleActor.getId());
        this.actors = this.actors.filter((actor) => actor !== roleActor);
    }
    addToRemovedActorList(actorId) {
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
    addEnvActor(envActor) {
        var _a;
        // @todo: actor factory
        const act = new envActor.type(...envActor.params);
        act.setLabel(envActor.label);
        act.setId(this.actorIdService.getNextActorId());
        if (typeof envActor.associatedActors !== "undefined") {
            // console.log('actorForRole.associated', actorForRole.associated);
            envActor.associatedActors.forEach((associated) => {
                if (typeof associated.associationLabel === "undefined" ||
                    typeof associated.actorLabel === "undefined") {
                    throw new Error("incorrect actor association config " + envActor.label);
                }
                act.setAssociatedActor(associated.associationLabel, this.findActorByLabel(associated.actorLabel));
            });
        }
        if (typeof envActor.orientation !== "undefined") {
            // console.log('envActor.orientation', envActor.orientation);
            act.setOrientation(envActor.orientation);
        }
        if (typeof envActor.components !== "undefined") {
            (_a = envActor.components) === null || _a === void 0 ? void 0 : _a.forEach((compDef) => {
                act.addComponent(compDef.label, new compDef.component(act));
            });
        }
        this.actors.push(act);
        return act;
    }
    removeActorByLabel(label) {
        var _a;
        // console.log("removeActorByLabel", label)
        const actor = this.findActorByLabel(label);
        if (actor) {
            (_a = actor === null || actor === void 0 ? void 0 : actor.getAssociatedActors()) === null || _a === void 0 ? void 0 : _a.forEach((assocActor) => {
                this.removeActor(assocActor);
            });
            this.addToRemovedActorList(actor.getId());
            this.actors = this.actors.filter((act) => act.label !== label);
        }
    }
    addRemoteActor(remoteObj) {
        // console.log('addRemoreActor',z)
        if (typeof this.actorRepository[remoteObj.name] === "undefined") {
            console.log("this.actorRepository", this.actorRepository);
            throw new Error(`actor name: ${remoteObj.name} not found in actorRepository`);
        }
        const z = remoteObj.z || 0;
        const actor = new this.actorRepository[remoteObj.name](remoteObj.x, remoteObj.y, remoteObj.id, z, remoteObj.args);
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
    addRoleActor(role, configActorForRole) {
        var _a;
        // @todo: actor factory
        // console.log('addRoleActor', configActorForRole)
        const actor = new configActorForRole.type(configActorForRole.x, configActorForRole.y, this.actorIdService.getNextActorId(), configActorForRole.z || 0);
        role.addCommands(actor, this);
        role.actors.push(actor);
        actor.setLabel(configActorForRole.label);
        if (typeof configActorForRole.color !== "undefined") {
            actor.setColor(configActorForRole.color);
        }
        if (typeof configActorForRole.associatedActors !== "undefined") {
            configActorForRole.associatedActors.forEach((associated) => {
                if (typeof associated.associationLabel === "undefined" ||
                    typeof associated.actorLabel === "undefined") {
                    throw new Error("incorrect actor association config " + configActorForRole.label);
                }
                actor.setAssociatedActor(associated.associationLabel, this.findActorByLabel(associated.actorLabel));
            });
        }
        if (typeof configActorForRole.orientation !== "undefined") {
            actor.setOrientation(configActorForRole.orientation);
        }
        if (typeof configActorForRole.z !== "undefined") {
            actor.setZ(configActorForRole.z);
        }
        if (typeof configActorForRole.components !== "undefined") {
            (_a = configActorForRole.components) === null || _a === void 0 ? void 0 : _a.forEach((compDef) => {
                actor.addComponent(compDef.label, new compDef.component(actor));
            });
        }
        this.actors.push(actor);
        if (typeof configActorForRole.primary !== "undefined") {
            // @todo: refactor pls
            actor.setUsername(role.player.name);
            role.setPrimaryActorId(actor.getId());
            setTimeout(() => {
                EventHandler_1.EventHandler.publish("server:primaryActorAdded", role.getPlayer().getId(), actor.getId());
            }, 1500);
        }
        return actor;
    }
    getState() {
        const state = [];
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
    getDiffState() {
        const state = [];
        // let start3 = performance.now()
        this.actors.forEach((actor) => {
            if (actor.invisible !== true) {
                state.push(Object.assign({ id: actor.getId() }, util_1.NetworkUtils.diffState(actor.getLastState(), actor.getState())));
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
    setDiffState(state) {
        const data = state.state;
        for (let i = 0, il = data.length; i < il; i++) {
            if (data[i] != null && typeof this.actors[i] !== "undefined") {
                this.actors[i].setProps(data[i]);
            }
        }
    }
    setState(state) {
        const data = state.state;
        for (let i = 0, il = data.length; i < il; i++) {
            if (data[i] != null && typeof this.actors[i] !== "undefined") {
                this.actors[i].setState(data[i]);
            }
        }
    }
    findRoleByLabel(label) {
        return this.roleManager.findRoleByLabel(label);
    }
    findRoleById(roleId) {
        return this.roleManager.findRoleById(roleId);
    }
    getActors() {
        return this.actors;
    }
    // refactor into RoleManager
    addActor(actor) {
        this.actors.push(actor);
    }
    getActorRepository() {
        return this.actorRepository;
    }
    checkWinCondition() {
        // console.log('check win condition')
        this.scenarioHooks.checkWinCondition();
    }
    onTeamWon(team) {
        EventHandler_1.EventHandler.publish("server:teamWon", this.gameId, team);
    }
    getGameId() {
        return this.gameId;
    }
    getSpawnLocationManager() {
        return this.spawnLocationManager;
    }
    respawnActorByLabel(actorLabel) {
        const actor = this.findActorByLabel(actorLabel);
        if (!actor) {
            return;
        }
        if (typeof actor.respawn !== "undefined") {
            const location = this.spawnLocationManager.getNextAvailable();
            actor.respawn(location);
        }
    }
    onEvent(socketId, data) {
        // console.log("Scenario onEvent", data)
        // console.log("scenario Events", this.events)
        const event = this.events.get(data.eventName);
        if (typeof event !== "undefined") {
            event(this, socketId, data.data);
        }
    }
    getComponent(componentName) {
        var _a;
        return (_a = this.components) === null || _a === void 0 ? void 0 : _a.get(componentName);
    }
    addComponent(componentName, component) {
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
exports.Scenario = Scenario;
