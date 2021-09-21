import { Actor } from "../actor/Actor";
import { Player } from '../player/player'
import { Role } from '../player/role'
import { IActor } from "../actor/IActor";
import { ISpawnLocationManager } from "./ISpawnLocationManager";
import { IScenarioComponent } from "./IScenarioComponent";

export interface IScenario {

  update() : void

  update2() : void
  updateCollisions(): void

  getState(): object
  setState(state: string): void
  getActors(): IActor[]

  onRoleCommand(playerId: string, command: string, value: any): void
  addPlayer(player: Player): void
  roleSelected(player: Player, roleName: string): void
  removePlayer(player: string): void
  getName(): string | null
  setName(name: string): void
  addRemoteActor(remoteObj: any): Actor
  findRoleByLabel(roleLabel: string): Role
  findRoleById(roleId: string): Role
  init(players: any[], gameId: string): void
  destroy(): void

  removeActorByLabel(label: string): void
  findActorByLabel(label: string): IActor | undefined
  findActorById(id: string): IActor | undefined
  addActor(actor: IActor): void
  removeActor(actor: IActor): void
  addRoleActor(role: Role, actorForRole: any): IActor
  addEnvActor(envActor: any): IActor

  getActorRepository(): any
  checkWinCondition(): void
  getGameId(): string

  addBot(index: number, location: any): void
  removeBot(): void

  respawnActorByLabel(actorLabel: string): void
  getSpawnLocationManager(): ISpawnLocationManager | undefined

  getDiffState(): object

  onEvent(socketId: string, data: any): void

  getComponent(componentName: string): IScenarioComponent | undefined

  addComponent(componentName: string, component: IScenarioComponent): void

  onTeamWon(team: number): void
}