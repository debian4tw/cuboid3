import * as THREE from "three"

export class THREEMaterialUtils {

  public static fixReplaceMaterialWithLambert(object: THREE.Object3D){
    object.traverse( ( child ) => {
      if ( child instanceof THREE.Mesh) {
      //if ( child instanceof THREE.SkinnedMesh ) {
           // switch the material here - you'll need to take the settings from the 
           //original material, or create your own new settings, something like:
          const oldMat = child.material;
          delete oldMat['specular']
          delete oldMat['shininess']
          delete oldMat['bumpMap']
          delete oldMat['bumpScale']
          delete oldMat['normalMap']
          delete oldMat['normalMapType']
          delete oldMat['normalScale']
          delete oldMat['displacementMap']
          delete oldMat['displacementScale']
          delete oldMat['displacementBias']
          
          child.material = new THREE.MeshLambertMaterial( {  
            ...oldMat,
            type: "MeshLambertMaterial",
            flatShading: true
          } );
      }
    });
  }

  public static fixMaterialTransparency(mesh: THREE.Mesh) {
    //@fix: axer showing up transparent after updarting three to 0.124.0
    setTimeout(() => {
      mesh.traverse(function (child: any) {
        //console.log("transversing");
        //console.log(child)
        if (child instanceof THREE.SkinnedMesh) {
          //console.log("setting skinnedMesh");
          child.material.transparent = false;
          child.material.opacity = 1;
          child.receiveShadow = false;
          child.castShadow = false;
        }
      })
      mesh.receiveShadow = false;
      mesh.castShadow = false;
    },2000)
  }

}