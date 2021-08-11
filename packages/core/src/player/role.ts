import {Actor} from '../actor/Actor';
import { Player } from './player'
import { IActor } from '../actor/IActor';
import { ISpawnLocationDef } from '../scenario/SpawnLocation.manager';
import { IScenario } from '../scenario';

export class Role {
    player: Player
    commands: any
    actors: IActor[]
    primaryActorId: string
    roleCommands: any
    id: string
    label: string

    constructor(player: Player, roleCommands: any, config: any) {
        this.id = player.getId()
        this.player = player
        this.roleCommands = roleCommands
        this.commands = {}
        this.actors = []
        this.label = config.label

        if (typeof config.color !== "undefined") {
            player.setColor(config.color)
        }

        if (typeof config.team !== "undefined") {
            player.setTeam(config.team)
        }

    }

    public setLabel(label: string) {
        this.label = label
    }

    public getLabel() {
        return this.label
    }

    public getPlayer() {
        return this.player
    }

    public getId() {
      return this.id
    }

    public setPrimaryActorId(id: string) {
        this.primaryActorId = id
    }

    public getPrimaryActorId() {
        return this.primaryActorId
    }

    public respawn(location: ISpawnLocationDef) {
        this.actors.forEach((actor) => {
            if(typeof (actor as any).respawn !== "undefined") {
                (actor as any).respawn(location)
            }
        })
    }

    addCommands(actor: Actor, scenario: IScenario) {
        this.roleCommands.forEach((roleCommand: any) => {
            if (roleCommand.type === actor.name) {
                //console.log('adding command: ', roleCommand)
                let label = roleCommand.label 
                let method = roleCommand.method
                let behavior = roleCommand.behavior
                //console.log("command has behavior", label, behavior)
                if (typeof roleCommand['behavior'] !== "undefined") {
                    this.addBehavior(scenario, roleCommand)
                    return
                } else {
                    if (typeof actor[method] === "undefined") {
                        throw(`Role:addCommands: command ${label}, actor ${actor.name} does not have method ${method}`)
                    } else {
                        if (typeof roleCommand.value !== "undefined") {
                            this.commands[label] = function(v: any) { actor[method](v) }
                        } else {
                            this.commands[label] = function() { actor[method]() }
                        }
    
                    }
                }

                //console.log(this.commands)
            }
        })
    }

    runCommand(command: string, value: any = false) {
        //console.log('role: runCommand', command, value)
        if (typeof this.commands[command] !== "undefined") {
            if (typeof value !== "undefined") {
                //console.log('exec command with value', value)
                //console.log(this.commands[command])
                this.commands[command](value)
            } else {
                //console.log('exec command no value')
                this.commands[command]()
            }

        } else {
            console.log('Role:runCommand: command not found', command, value);
            //console.log('Role:actors:', this.actors);
        }
    }

    addBehavior(scenario: IScenario, roleCommand: any) {
        //console.log("Add Behavior", roleCommand)
        const label = roleCommand.label
        const behavior = roleCommand.behavior
        this.commands[label] = (val = false) => {
            behavior(scenario, this, val)
        }
    }

}