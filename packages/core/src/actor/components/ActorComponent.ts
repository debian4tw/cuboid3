import { GBox3 } from "@cubic-eng/g-physics";
import { Actor3 } from "../Actor3";
import { IActorComponent } from "./IActorComponent";

export class ActorComponent {
  actor: Actor3

  constructor(actor: Actor3) {
    this.actor = actor
  }

  init(): void {
    // override
  }
  update(): void {
    // override
  }
}

export interface IComponentDefinition{
  label: string
  component: new (actor: Actor3) => ActorComponent
}
