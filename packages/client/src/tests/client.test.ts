import * as THREE from "three";
import { ClientActorRegistry } from '../client-actors/ClientActorRegistry';
//import {ShipActor, BulletActor, FleetActor, BarrierActor} from '../../scenarios/space/actors';
import {Game} from '@cubic-eng/core';

let game = new Game('323', []);
game.setScenario(1);

let scene = new THREE.Scene();

let registry = new ClientActorRegistry(game, scene);

let status = [
{id: "58d6754c-3246-48dd-ab95-59397eb9baed", name: "Fleet", x: 50, y: 300},
{id: "7a46ba50-952d-4449-b53a-6af6e9598f2b", name: "Ship", x: 400, y: -80},
{id: "2ccc9485-390c-4530-8ce8-7a1ff11e4a65", name: "Bullet", x: 0, y: 0},
{id: "5d55b00f-5cb2-4980-a0ea-e8cab7ddebc3", name: "Ship", x: 250, y: 320},
{id: "430a8ee5-9417-4bd3-980b-f81d58fddf81", name: "Bullet", x: 0, y: 0},
];

let act0 = game.getScenario().addRemoteActor(status[0])
let act1 = game.getScenario().addRemoteActor(status[1])
let act2 = game.getScenario().addRemoteActor(status[2])

describe('calculate', function() {
  registry.create(act0);
  registry.create(act1);
  registry.create(act2);
  
  //let act = registry.getById("58d6754c-3246-48dd-ab95-59397eb9baed");
  //console.log(act);
  let arr = registry.getArr();
  //console.log('arr', arr[0]);
  //console.log('arr[0].id', arr[0].id);

  //console.log('status[0].id', status[0].id);
  //console.log('registry Arr');
  arr.forEach((el) => {
    console.log(el.id);
  });
  //console.log('status ****');
  status.forEach((ele) => {
    //console.log(ele.id);
  });

});