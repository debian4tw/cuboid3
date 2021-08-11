"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleTypeManager = void 0;
const role_1 = require("../player/role");
const EventHandler_1 = require("../event/EventHandler");
class RoleTypeManager {
    constructor(scenario, configEnvActors, configRoleActors, roleCommands) {
        this.slotIndex = 0;
        this.scenario = scenario;
        this.configEnvActors = configEnvActors;
        this.configRoleActors = configRoleActors;
        this.roleCommands = roleCommands;
        this.scenarioPlayers = [];
        this.roles = {};
    }
    getNextSlotIndex() {
        return ++this.slotIndex;
    }
    init(players) {
        this.configEnvActors.forEach((envActor) => {
            this.scenario.addEnvActor(envActor);
        });
        players.forEach((player, index) => {
            this.addPlayer(player);
        });
    }
    addPlayer(player) {
        EventHandler_1.EventHandler.publish('server:displayPickRole', player.getId());
        // this.addRole(player)
    }
    roleSelected(player, roleName) {
        // console.log("RoleType:roleSelected")
        // console.log(player, roleName)
        // console.log(this.scenario.getGameId())
        this.addRole(player, roleName);
        EventHandler_1.EventHandler.publish('gameStateChanged', this.scenario.getGameId());
    }
    addRole(player, roleName = null) {
        if (typeof this.configRoleActors['Axer'] === 'undefined' || this.configRoleActors['Knight'] === 'undefined') {
            return;
        }
        this.scenarioPlayers.push(player.getId());
        const configRole = this.loadRoleConfig(roleName);
        const roleCommands = this.loadRoleComands(configRole);
        let role = new role_1.Role(player, roleCommands, configRole);
        this.roles[role.getId()] = role;
        configRole.actors.forEach((configActorForRole, index) => {
            this.scenario.addRoleActor(role, configActorForRole);
        });
        let location = this.scenario.getSpawnLocationManager().getNextAvailable();
        role.respawn(location);
    }
    loadRoleComands(configRole) {
        if (typeof this.roleCommands[configRole.commands] !== "undefined") {
            return this.roleCommands[configRole.commands];
        }
        return this.roleCommands;
    }
    loadRoleConfig(roleName) {
        const slotIndex = this.getNextSlotIndex();
        let configRole = { actors: [] };
        //@todo: refactor pls - 
        // polymorphic load config based on registered actor configs, 
        // this should never be hardcoded
        if (roleName) {
            if (roleName === "axer") {
                this.extend(this.configRoleActors['Axer'], configRole);
                this.extend(this.configRoleActors['Axer'].actors, configRole.actors);
            }
            else if (roleName === "knight") {
                this.extend(this.configRoleActors['Knight'], configRole);
                this.extend(this.configRoleActors['Knight'].actors, configRole.actors);
            }
            else if (roleName === "archer") {
                this.extend(this.configRoleActors['Archer'], configRole);
                this.extend(this.configRoleActors['Archer'].actors, configRole.actors);
            }
        }
        else {
            if (this.scenarioPlayers.length % 2 == 0) {
                this.extend(this.configRoleActors['Axer'], configRole);
                this.extend(this.configRoleActors['Axer'].actors, configRole.actors);
            }
            else {
                this.extend(this.configRoleActors['Knight'], configRole);
                this.extend(this.configRoleActors['Knight'].actors, configRole.actors);
            }
        }
        /*if (this.scenarioPlayers.length % 2 == 0) {
          configRole.team = 2
          configRole.color = 'red'
        } else {
          configRole.team = 1
          configRole.color = 'blue'
        }*/
        //console.log('configRole2', configRole.actors[2])
        this.addLabelIndex(configRole, slotIndex);
        return configRole;
    }
    addLabelIndex(configRole, slotIndex) {
        var _a;
        configRole.label = 'role' + slotIndex;
        (_a = configRole.actors) === null || _a === void 0 ? void 0 : _a.forEach((configActor) => {
            configActor.label = configActor.label + slotIndex;
            if (typeof configActor.associatedActors !== 'undefined') {
                configActor.associatedActors.forEach((associatedActorConfig) => {
                    associatedActorConfig.actorLabel = associatedActorConfig.actorLabel + slotIndex;
                    //console.log('associatedActor:' ,associatedActorConfig.actorLabel)
                });
            }
        });
    }
    extend(from, to) {
        if (from == null || typeof from != "object")
            return from;
        if (from.constructor != Object && from.constructor != Array)
            return from;
        if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
            from.constructor == String || from.constructor == Number || from.constructor == Boolean)
            return new from.constructor(from);
        to = to || new from.constructor();
        for (var name in from) {
            to[name] = typeof to[name] == "undefined" ? this.extend(from[name], null) : to[name];
        }
        return to;
    }
    removePlayer(playerId) {
        this.removeRole(playerId);
        this.scenarioPlayers = this.scenarioPlayers.filter(elem => elem !== playerId);
        console.log('removedScenario Player', playerId, this.scenarioPlayers);
    }
    removeRole(playerId) {
        if (typeof this.roles[playerId] === "undefined") {
            return;
        }
        this.roles[playerId].actors.forEach((roleActor) => {
            this.scenario.removeActor(roleActor);
            //this.actors = this.actors.filter(actor => actor !== roleActor)
        });
        delete this.roles[playerId];
    }
    findRoleByLabel(label) {
        for (var id in this.roles) {
            //console.log(this.roles[id]);
            if (this.roles[id].getLabel() === label) {
                return this.roles[id];
            }
        }
    }
    findRoleById(roleId) {
        //console.log('findRoleById')
        //console.log('roles', this.roles)
        if (typeof this.roles[roleId] !== "undefined") {
            return this.roles[roleId];
        }
        return undefined;
    }
    onRoleCommand(playerId, command, value = false) {
        //@todo: check command collision posibilities?
        //console.log('scenario:onRoleCommand', command, value)
        if (typeof this.roles[playerId] !== "undefined") {
            this.roles[playerId].runCommand(command, value);
        }
        else {
            console.log(playerId, 'not found in roles for command run', this.roles);
        }
    }
    getScenarioPlayers() {
        return this.scenarioPlayers;
    }
    getRoles() {
        return this.roles;
    }
}
exports.RoleTypeManager = RoleTypeManager;
