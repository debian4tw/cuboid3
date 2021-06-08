import { Player } from '../player/player';
import { IScenario } from '../scenario/IScenario';
import { IRoleManager } from './IRoleManager';
export declare class RoleTypeManager implements IRoleManager {
    private roles;
    scenarioPlayers: any[];
    configEnvActors: any[];
    configRoleActors: any;
    roleCommands: any;
    slotIndex: number;
    scenario: IScenario;
    constructor(scenario: IScenario, configEnvActors: any[], configRoleActors: any, roleCommands: any);
    getNextSlotIndex(): number;
    init(players: Player[]): void;
    addPlayer(player: Player): void;
    roleSelected(player: Player, roleName: string): void;
    addRole(player: Player, roleName?: string | null): void;
    loadRoleComands(configRole: any): any;
    loadRoleConfig(roleName: string | null): any;
    addLabelIndex(configRole: any, slotIndex: number): void;
    extend(from: any, to: any): any;
    removePlayer(playerId: string): void;
    removeRole(playerId: string): void;
    findRoleByLabel(label: string): any;
    findRoleById(roleId: string): any;
    onRoleCommand(playerId: string, command: string, value?: any): void;
    getScenarioPlayers(): any[];
    getRoles(): any;
}
