import * as THREE from "three";
import { Actor } from '@cuboid3/core';
import { ClientActor} from './ClientActor';
import { MeshPhongMaterial } from "three";
import {GeometryFactory} from './GeometryFactory'
import { IActor } from "@cuboid3/core";
export class ClientSingleTranslatedActor extends ClientActor{


  public id: string;
  public isMultiple = false;

  constructor(actor: IActor) {
    //this.scene = scene;
    super(actor);
    this.actor = actor;
    //console.log('construct clientActor2', actor);
    this.id = this.actor.getId();
  }

  update() {
    //this.actor.setState(status);
    this.updateMesh(this.actor);
    //this.actor.getState();
  }

  updateMesh(actor: IActor) {

    this.mesh.position.x = actor.getX()
    this.mesh.position.y = actor.getY() 
    this.mesh.position.z = actor.getZ()

    if (actor.isActive === 0) {
      this.mesh.visible = false
    } else if (actor.isActive === 1) {
      this.mesh.visible = true
    }

    this.mesh.rotation.z = actor.getR().z * Math.PI / 180
    this.mesh.rotation.x = actor.getR().x * Math.PI / 180
    this.mesh.rotation.y = actor.getR().y * Math.PI / 180
  }

  createMesh(callback: Function) {
    let geometry = GeometryFactory.createGeometry(this.actor.shape, this.actor.getCoordsAndDimensions())
    //@todo: vertexColors param?
    let mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial( { color: this.actor.getColor(), vertexColors: true, wireframe: this.actor.wireframe } )
      //color: 0x00ff00
    );

    mesh.receiveShadow = true;
    mesh.castShadow = true;


    mesh.geometry.translate( this.actor.getW() / 2, 0, 0);
    mesh.position.x = this.actor.getX()
    mesh.position.y = this.actor.getY()
    mesh.position.z = this.actor.getZ()

    if (!this.actor.wireframe) {
      var geo = new THREE.EdgesGeometry( geometry as THREE.Geometry);
      var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 8 } );
      var geoWireframe = new THREE.LineSegments( geo, mat );
      mesh.add(geoWireframe)
      geoWireframe.renderOrder = 1;  // make sure wireframes are rendered 2nd
    }
    this.mesh = mesh;
    callback()
    return mesh;
  }

  getMesh(): any {
    return this.mesh;
  }

  addToScene(scene: THREE.Scene) {
    scene.add(this.mesh)
  }

}