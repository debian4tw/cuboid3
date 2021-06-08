import * as THREE from "three";
import { Actor, Rectangle3 } from '@cubic-eng/core';
import { ClientActor} from './ClientActor';

import {GeometryFactory} from './GeometryFactory'
import { Shape } from "@cubic-eng/g-physics";
import { IClientActor } from "./IClientActor";

export class ClientMultipleActor extends ClientActor implements IClientActor{

  public multipleMesh : Array<any>;
  public id: string;
  public isMultiple = true;
  protected actor: Actor

  constructor(actor: Actor) {
    super(actor);
    this.id = actor.getId();
    this.actor = actor
    // console.log("multiple check actor", this.actor)
    this.multipleMesh = [];
  }

  update() {
    this.updateMesh(this.actor);
  }

  updateMesh(actor: Actor) {
      for (var i=0; i<actor.qty; i++) {
          if(actor.active[i]){
              this.multipleMesh[i].visible = true;
          } else {
              this.multipleMesh[i].visible = false;
          }
          this.multipleMesh[i].position.x =  actor.rectangle[i].x + actor.rectangle[i].w / 2;
          this.multipleMesh[i].position.y =  actor.rectangle[i].y + actor.rectangle[i].h / 2;
          if (typeof actor.rectangle[i].z !== "undefined" && actor.rectangle[i].z !== 0) {
            this.multipleMesh[i].position.z =  actor.rectangle[i].z + actor.rectangle[i].h / 2;
          }
      }
  }
  

  createMesh(callback: Function) {
    console.log('createMultipleMesh', this.actor.name, this.actor.shape);
    this.multipleMesh = [];
    for(let i=0; i<this.actor.qty; i++) {

      let mesh = new THREE.Mesh(
        GeometryFactory.createGeometry(this.actor.shape, this.actor.getIndexCoordsAndDimensions(i)),
        new THREE.MeshBasicMaterial( { color: this.actor.getColor(), wireframe: false } )
      );
      //mesh.receiveShadow = true;
      //mesh.castShadow = true;
      mesh.position.x = this.actor.rectangle[i].x + this.actor.rectangle[i].w / 2;
      mesh.position.y = this.actor.rectangle[i].y + this.actor.rectangle[i].h / 2;
      mesh.position.z = (this.actor.rectangle[i].z + this.actor.rectangle[i].d / 2) | 0;

      if (!this.actor.wireframe && this.actor.shape !== Shape.Sphere) {
        var geo = new THREE.EdgesGeometry( mesh.geometry );
        var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 8 } );
        var geoWireframe = new THREE.LineSegments( geo, mat );
        mesh.add(geoWireframe)
        geoWireframe.renderOrder = 1
        //wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
      }
      if(this.actor.active[i]){
        mesh.visible = true;
      } 

      this.multipleMesh.push(mesh);
    }
    callback()
    return this.multipleMesh;
  }


  addToScene(scene: THREE.Scene) {
    let me = this.getMesh();
    for(let i=0; i<me.length; i++) {
      scene.add(me[i]);
    }
  }

  getMesh(): any {
    return this.multipleMesh;
  }


}