import * as THREE from "three";
import { ClientActor } from './ClientActor';

import {ClientActorFactory} from './ClientActorFactory'
import {Actor} from '@cubic-eng/core'
import { Game } from '@cubic-eng/core';
import { IActor } from "@cubic-eng/core";
import { IClientActor } from ".";
import { ClientMultipleActor } from "./ClientMultipleActor";
import { EventHandler } from "@cubic-eng/core";

export class ClientActorRegistry {

  private clientActors : IClientActor[];
  private scene: THREE.Scene;

  constructor(game: Game, scene: THREE.Scene) {
    this.scene = scene;
    this.clientActors = [];
  }

  findById(id: string): IClientActor | undefined {
    //console.log('getById', id, this.clientActors);
    return this.clientActors.find(cliActor => cliActor.id == id);
  }

  create(actor: IActor): Promise<IClientActor> {
    //let cliActor = ClientActorFactory.createClientActor(actor)
    let cliActor = ClientActorFactory.createClientActorType(actor)
    this.clientActors.push(cliActor)

    return new Promise((resolve) => {
      cliActor.createMesh((child: undefined | ClientActor) => {
        cliActor.addToScene(this.scene)
        if (child !== undefined) {
          child.addToScene(this.scene)
        }
        resolve(cliActor)
      })
    })
  }

  clean(){
    this.clientActors.forEach((cliActor) => {
      this.delete(cliActor);
    })
    this.clientActors = [];
    //this.scene.dispose()
  }

  delete(cliActor: IClientActor) {
    //console.log('deleteCliActor', cliActor);
    EventHandler.publish('remove2DCanvasUI', cliActor)
    if (cliActor instanceof ClientMultipleActor) {
      let me = cliActor.getMesh();
      for(let i=0; i<me.length;i++){
        this.scene.remove(me[i]);
      }
    } else {
      if (typeof (cliActor as any).child !== "undefined") {
        console.log("Should delete child")
        this.scene.remove((cliActor as any).child.getMesh())
      }
      this.scene.remove(cliActor.getMesh());
    }
    this.clientActors = this.clientActors.filter(cliAct => cliAct.id != cliActor.id)
  }

  deleteById(actorId: string) {
    const cliAct = this.findById(actorId)
    if (cliAct) {
      this.delete(cliAct)
    }
  }

  getArr() {
    return this.clientActors;
  }
}
