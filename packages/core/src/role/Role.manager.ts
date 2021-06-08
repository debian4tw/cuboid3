import { Player } from '../player/player';
import { Role } from '../player/role'
import { EventHandler } from '../event/EventHandler';
import { IScenario } from '../scenario/IScenario';
import { IActor } from '../actor/IActor';
import { IRoleManager } from './IRoleManager';


export class RoleManager implements IRoleManager{
  private roles: any
  public scenarioPlayers: any[]

  configEnvActors: any[]
  configRoleActors: any[]
  roleCommands: any;

  scenario: IScenario

  constructor(scenario: IScenario, configEnvActors: any[], configRoleActors: any[], roleCommands: any) {
    this.scenario = scenario
    this.configEnvActors = configEnvActors
    this.configRoleActors = configRoleActors
    this.roleCommands = roleCommands

    this.scenarioPlayers = []
    this.roles = {}
  }

  init(players: Player[]) {
    this.configEnvActors.forEach((envActor) => {
      this.scenario.addEnvActor(envActor)
    })

    players.forEach((player, index: number) => {
      this.addPlayer(player)
    })
  }

  addPlayer(player: Player) {
    this.addRole(player)
  }

  addRole(player: Player) {
    //console.log(this.roleActors);
    this.scenarioPlayers.push(player.getId())
    const slotIndex = this.scenarioPlayers.length-1

    if (typeof this.configRoleActors[slotIndex] == "undefined") {
        //@todo: spectator
        return;
    }
    let roleCommands;
    if (typeof this.roleCommands[this.configRoleActors[slotIndex].commands] !== "undefined") {
        roleCommands = this.roleCommands[this.configRoleActors[slotIndex].commands]
    } else {
        roleCommands = this.roleCommands
    }

    let role = new Role(player, roleCommands, this.configRoleActors[slotIndex])

    //@todo: refactor
    this.configRoleActors[slotIndex].actors.forEach((actorForRole: any, index: number) => {
      this.scenario.addRoleActor(role, actorForRole)
    })
    //role.addConfigCommands()
    this.roles[role.getId()] = role
  }

  removePlayer(playerId: string) {
    this.removeRole(playerId);
    this.scenarioPlayers = this.scenarioPlayers.filter(elem => elem !== playerId)
    console.log('removedScenario Player', playerId, this.scenarioPlayers)
  }

  removeRole(playerId: string) {
    if (typeof this.roles[playerId] === "undefined") {
        return
    }
    this.roles[playerId].actors.forEach((roleActor: IActor) => {
        this.scenario.removeActor(roleActor)
        //this.actors = this.actors.filter(actor => actor !== roleActor)
    })
    delete this.roles[playerId];
  }

  findRoleByLabel(label: string) {
    for (let id in this.roles) {
        //console.log(this.roles[id]);
        if (this.roles[id].getLabel() === label) {
            return this.roles[id]
        }
    }
  }

  findRoleById(roleId: string) {
    //console.log('roles', this.roles)
    if (typeof this.roles[roleId] !== "undefined") {
      return this.roles[roleId]
    }
    return undefined
  }

  onRoleCommand(playerId: string, command: string, value: any = false) {
    //@todo: check command collision posibilities?
    //console.log('scenario:onRoleCommand', command, value)
    if (typeof this.roles[playerId] !=="undefined") {
        this.roles[playerId].runCommand(command, value)
    } else {
        console.log(playerId, 'not found in roles for command run', this.roles);
    }
  }

  roleSelected(player: Player, roleName: string) {
  }

  getScenarioPlayers() {
    return this.scenarioPlayers
  }

  getRoles() {
    return this.roles
  }
}