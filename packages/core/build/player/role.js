"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
class Role {
    constructor(player, roleCommands, config) {
        this.id = player.getId();
        this.player = player;
        this.roleCommands = roleCommands;
        this.commands = {};
        this.actors = [];
        this.label = config.label;
        if (typeof config.color !== "undefined") {
            player.setColor(config.color);
        }
        if (typeof config.team !== "undefined") {
            player.setTeam(config.team);
        }
    }
    setLabel(label) {
        this.label = label;
    }
    getLabel() {
        return this.label;
    }
    getPlayer() {
        return this.player;
    }
    getId() {
        return this.id;
    }
    setPrimaryActorId(id) {
        this.primaryActorId = id;
    }
    getPrimaryActorId() {
        return this.primaryActorId;
    }
    respawn(location) {
        this.actors.forEach((actor) => {
            if (typeof actor.respawn !== "undefined") {
                actor.respawn(location);
            }
        });
    }
    addCommands(actor) {
        this.roleCommands.forEach((roleCommand) => {
            if (roleCommand.type === actor.name) {
                //console.log('adding command: ', roleCommand)
                let label = roleCommand.label;
                let method = roleCommand.method;
                if (typeof actor[method] === "undefined") {
                    throw (`Role:addCommands: command ${label}, actor ${actor.name} does not have method ${method}`);
                }
                else {
                    if (typeof roleCommand.value !== "undefined") {
                        this.commands[label] = function (v) { actor[method](v); };
                    }
                    else {
                        this.commands[label] = function () { actor[method](); };
                    }
                }
                //console.log(this.commands)
            }
        });
    }
    runCommand(command, value = false) {
        //console.log('role: runCommand', command, value)
        if (typeof this.commands[command] !== "undefined") {
            if (typeof value !== "undefined") {
                //console.log('exec command with value', value)
                //console.log(this.commands[command])
                this.commands[command](value);
            }
            else {
                //console.log('exec command no value')
                this.commands[command]();
            }
        }
        else {
            console.log('Role:runCommand: command not found', command, value);
            //console.log('Role:actors:', this.actors);
        }
    }
}
exports.Role = Role;
