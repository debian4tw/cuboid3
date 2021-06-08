import {Rectangle3} from '@cubic-eng/core'
import {Shape} from '@cubic-eng/g-physics'
import * as THREE from "three";

export class GeometryFactory {

  static createGeometry(shape: Shape, rect: Rectangle3) {
    switch (shape) {
    case Shape.Box:
      return new THREE.BoxGeometry(rect.w, rect.h, rect.d)

    case Shape.Circle:
      return new THREE.CircleGeometry(rect.w / 2 , 12, 0)

    case Shape.Cylinder:
      return new THREE.CylinderGeometry(rect.w / 2, rect.w / 2, rect.h, 4, 1 );

    case Shape.Sphere:
      return new THREE.SphereGeometry(rect.w / 2 , 12, 10)
    }
  }
}