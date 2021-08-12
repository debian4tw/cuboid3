import { GRotationCoords } from '@cuboid3/g-physics';
import { IActor } from './IActor';
import { Rectangle3 } from './Actor';
import { Shape } from '@cuboid3/g-physics';
import { GVector3 } from '@cuboid3/g-physics';
import { ActorComponent } from './components/ActorComponent';
import { GBox4 } from '@cuboid3/g-physics';
import { ClientActorType } from './ClientActorType';
export declare class Actor4 implements IActor {
    [key: string]: any;
    id: string;
    name: string;
    label: string;
    hitPoints: number;
    username: string;
    shape: Shape;
    box: GBox4;
    isActive: number;
    invisible: boolean;
    wireframe: boolean;
    protected associatedActors: Map<string, IActor>;
    protected color: any;
    protected previousPos: GVector3;
    assocLabel: string;
    clientActorType: ClientActorType;
    components: Map<string, ActorComponent>;
    lastState: Object;
    constructor(box: GBox4, id?: string | null);
    setPositionHeight(): void;
    setLastState(state: any): void;
    getLastState(): Object;
    setProp(prop: any, value: any): void;
    setProps(obj: any): void;
    setz(val: number): void;
    setx(val: number): void;
    sety(val: number): void;
    setr(val: GRotationCoords): void;
    setry(val: number): void;
    setrz(val: number): void;
    getComponent(componentName: string): ActorComponent | undefined;
    addComponent(componentName: string, component: ActorComponent): void;
    getClientActorType(): ClientActorType;
    setUsername(username: string): void;
    getPreviousPos(): GVector3;
    setAssociatedActor(associationLabel: string, actor: IActor): void;
    getAssociatedActors(): Map<string, IActor>;
    getAssociatedActor(associationLabel: string): IActor | undefined;
    getId(): string;
    setId(id: string): void;
    getColor(): any;
    getCoordsAndDimensions(): Rectangle3;
    getState(): {};
    setState(state: any): void;
    update(): void;
    setOrientation(orientation: number): void;
    setColor(color: any): void;
    setLabel(label: any): void;
    getLabel(): string;
    getX(): number;
    getY(): number;
    getZ(): number;
    getW(): number;
    getH(): number;
    getD(): number;
    getR(): GRotationCoords;
    setZ(z: number): void;
    isWithinMapLimits(GameOpts: any): boolean;
    restoreLastPosition(): void;
}
