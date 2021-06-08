import { Player } from '../player/player';
import { IScenario } from '../scenario/IScenario';
import { IRoleManager } from './IRoleManager';
export declare class RoleManager implements IRoleManager {
    private roles;
    scenarioPlayers: any[];
    configEnvActors: any[];
    configRoleActors: any[];
    roleCommands: any;
    scenario: IScenario;
    constructor(scenario: IScenario, configEnvActors: any[], configRoleActors: any[], roleCommands: any);
    init(players: Player[]): void;
    addPlayer(player: Player): void;
    addRole(player: Player): void;
    removePlayer(playerId: string): void;
    removeRole(playerId: string): void;
    findRoleByLabel(label: string): any;
    findRoleById(roleId: string): any;
    onRoleCommand(playerId: string, command: string, value?: any): void;
    roleSelected(player: Player, roleName: string): void;
    getScenarioPlayers(): any[];
    getRoles(): any;
}
