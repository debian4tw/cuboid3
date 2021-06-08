import { Actor3 } from "../Actor3";
export interface IActorComponent {
    update(): void;
    init(actor: Actor3): void;
}
