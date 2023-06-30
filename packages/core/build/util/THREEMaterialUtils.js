"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.THREEMaterialUtils = void 0;
const THREE = __importStar(require("three"));
class THREEMaterialUtils {
    static fixReplaceMaterialWithLambert(object) {
        object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                //if ( child instanceof THREE.SkinnedMesh ) {
                // switch the material here - you'll need to take the settings from the 
                //original material, or create your own new settings, something like:
                const oldMat = child.material;
                delete oldMat['specular'];
                delete oldMat['shininess'];
                delete oldMat['bumpMap'];
                delete oldMat['bumpScale'];
                delete oldMat['normalMap'];
                delete oldMat['normalMapType'];
                delete oldMat['normalScale'];
                delete oldMat['displacementMap'];
                delete oldMat['displacementScale'];
                delete oldMat['displacementBias'];
                child.material = new THREE.MeshLambertMaterial(Object.assign(Object.assign({}, oldMat), { type: "MeshLambertMaterial", flatShading: true }));
            }
        });
    }
    static fixMaterialTransparency(mesh) {
        //@fix: axer showing up transparent after updarting three to 0.124.0
        setTimeout(() => {
            mesh.traverse(function (child) {
                //console.log("transversing");
                //console.log(child)
                if (child instanceof THREE.SkinnedMesh) {
                    //console.log("setting skinnedMesh");
                    child.material.transparent = false;
                    child.material.opacity = 1;
                    child.receiveShadow = false;
                    child.castShadow = false;
                }
            });
            mesh.receiveShadow = false;
            mesh.castShadow = false;
        }, 2000);
    }
}
exports.THREEMaterialUtils = THREEMaterialUtils;
