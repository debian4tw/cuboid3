"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleManager = void 0;
const role_1 = require("../player/role");
class RoleManager {
    constructor(scenario, configEnvActors, configRoleActors, roleCommands) {
        this.scenario = scenario;
        this.configEnvActors = configEnvActors;
        this.configRoleActors = configRoleActors;
        this.roleCommands = roleCommands;
        this.scenarioPlayers = [];
        this.roles = {};
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
        this.addRole(player);
    }
    addRole(player) {
        //console.log(this.roleActors);
        this.scenarioPlayers.push(player.getId());
        const slotIndex = this.scenarioPlayers.length - 1;
        if (typeof this.configRoleActors[slotIndex] == "undefined") {
            //@todo: spectator
            return;
        }
        let roleCommands;
        if (typeof this.roleCommands[this.configRoleActors[slotIndex].commands] !== "undefined") {
            roleCommands = this.roleCommands[this.configRoleActors[slotIndex].commands];
        }
        else {
            roleCommands = this.roleCommands;
        }
        let role = new role_1.Role(player, roleCommands, this.configRoleActors[slotIndex]);
        //@todo: refactor
        this.configRoleActors[slotIndex].actors.forEach((actorForRole, index) => {
            this.scenario.addRoleActor(role, actorForRole);
        });
        //role.addConfigCommands()
        this.roles[role.getId()] = role;
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
        for (let id in this.roles) {
            //console.log(this.roles[id]);
            if (this.roles[id].getLabel() === label) {
                return this.roles[id];
            }
        }
    }
    findRoleById(roleId) {
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
    roleSelected(player, roleName) {
    }
    getScenarioPlayers() {
        return this.scenarioPlayers;
    }
    getRoles() {
        return this.roles;
    }
}
exports.RoleManager = RoleManager;
