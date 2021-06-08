import { Shape } from '@cubic-eng/g-physics';
import { ClientActorType } from './ClientActorType';
import { IActor } from './IActor';
export interface Rotation {
    x: number;
    y: number;
    z: number;
}
export interface Rectangle3 {
    x: number;
    y: number;
    z: number;
    w: number;
    h: number;
    d: number;
}
export interface Rectangle2 {
    x: number;
    y: number;
    w: number;
    h: number;
}
export declare class Actor implements IActor {
    [key: string]: any;
    name: string;
    label: string;
    protected id: string;
    protected x: number;
    protected y: number;
    protected z: number;
    protected w: number;
    protected h: number;
    protected d: number;
    protected r: Rotation;
    protected color: any;
    isActive: number;
    invisible: boolean;
    clientActorType: ClientActorType;
    shape: Shape;
    wireframe: boolean;
    protected associatedActors: Map<string, IActor>;
    protected orientation: number;
    constructor(x: number, y: number, id?: string | null, z?: number);
    setPositionHeight(targetHeight: number): void;
    setLastState(state: any): void;
    getLastState(): any;
    setProp(prop: any, value: any): void;
    setProps(obj: any): void;
    getClientActorType(): ClientActorType;
    getAssociatedActors(): Map<string, IActor>;
    getAssociatedActor(associationLabel: string): IActor | undefined;
    setAssociatedActor(associationLabel: string, actor: IActor): void;
    setColor(color: any): void;
    setOrientation(orientation: number): void;
    getColor(): string;
    getState(): any;
    update(): void;
    getId(): string;
    setId(id: string): void;
    setState(state: any): void;
    setLabel(label: any): void;
    getLabel(): string;
    getX(): number;
    getY(): number;
    getZ(): number;
    getW(): number;
    getH(): number;
    getD(): number;
    getR(): Rotation;
    setZ(z: number): void;
    getCoordsAndDimensions(): Rectangle3;
    getIndexCoordsAndDimensions(i: number): Rectangle3;
    setUsername(username: string): void;
}
