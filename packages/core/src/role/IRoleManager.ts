import { Player } from "../player/player";
import { IScenario } from "../scenario/IScenario";

export type IRoleManagerClass = new (scenario: IScenario, configEnvActors: any[], configRoleActors: any, roleCommands: any) => IRoleManager


export interface IRoleManager {
  init(players: Player[]): void
  addPlayer(player: Player): void
  addRole(player: Player): void
  findRoleByLabel(label: string): any
  removePlayer(playerId: string): void
  removeRole(playerId: string): void


  onRoleCommand(playerId: string, command: string, value: any): void
  roleSelected(player: Player, roleName: string): void
  getScenarioPlayers(): any
  findRoleById(roleId: string): any
  getRoles(): any
}