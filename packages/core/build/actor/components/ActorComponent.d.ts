import { Actor3 } from "../Actor3";
export declare class ActorComponent {
    actor: Actor3;
    constructor(actor: Actor3);
    init(): void;
    update(): void;
}
export interface IComponentDefinition {
    label: string;
    component: new (actor: Actor3) => ActorComponent;
}
