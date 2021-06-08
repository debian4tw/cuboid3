import { Actor } from '@cubic-eng/core';
import { IActor } from '@cubic-eng/core';

import * as THREE from "three";
import { IClientActor } from '.';

export class ClientActor implements IClientActor {

  protected mesh: THREE.Mesh;
  protected actor: IActor; 
  public id: string;
  //private scene: THREE.Scene;

  constructor(actor: IActor) {
    //this.scene = scene;
    this.actor = actor;
    //console.log('construct clientActor2', actor);
    //console.log('ClientActor:constructor with id', actor.getId())
    this.id = this.actor.getId();
    /*if (typeof this.actor.qty !== "undefined") {
      this.createMultipleMesh(this.actor);
    } else {*/
      //this.createMesh(this.actor);
    /*}*/
  }

  update() {
    //this.actor.setState(status);
    this.updateMesh(this.actor);
    //this.actor.getState();
  }

  updateActor(status: string) {
    this.actor?.setState(status)
  }

  updateMesh(actor: IActor) {
    this.mesh.position.x = this.actor.getX();
    this.mesh.position.y = this.actor.getY();
  }

  createMesh(callback: Function) {

  }

  addToScene(scene: THREE.Scene) {

  }

  getActor() {
    return this.actor
  }

  getMesh(): any {
    return this.mesh;
  }


}