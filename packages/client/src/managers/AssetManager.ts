import * as THREE from "three"
import { Skeleton } from "three"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils.js'

export class AssetManager {

  private loader: FBXLoader
  private textureLoader: THREE.TextureLoader
  private loadedAssets: any
  private loadedTextures: any
  private basePath: string
  private static instance: AssetManager | null = null

  private constructor() {
    this.loader = new FBXLoader()
    this.loadedAssets = {}
    this.loadedTextures = {}
    this.textureLoader = new THREE.TextureLoader()
    this.textureLoader.setCrossOrigin("anonymous")

    this.basePath = '/public/models/'
  }

  public static getInstance() : AssetManager {
    if (this.instance === null) {
      this.instance = new AssetManager()
    }
    return this.instance
  }

  public loadModelWithPromise(fileName: string) {
    return new Promise((resolve, reject) => {
      this.loader.load( this.basePath+fileName, 
        ( object: any ) => {
          resolve(object)
        },
        () => {}, //onUpdate
        (error: any) => {
          reject(error)
        }
      )
    })
  }

  public loadModel(fileName: string, callback: Function) {
    if (typeof this.loadedAssets[fileName] !== "undefined") {
      callback(this.cloneFBXWithAnims(this.loadedAssets[fileName]))
      return 
    }

    this.loader.load( this.basePath+fileName, ( object: any ) => {
      this.loadedAssets[fileName] = this.cloneFBXWithAnims(object)
      callback(object)
    })
  }

  public async loadModelAsync(fileName: string) {
    return new Promise<THREE.Mesh>((resolve, reject) => {
      if (typeof this.loadedAssets[fileName] !== "undefined") {
        resolve(this.cloneFBXWithAnims(this.loadedAssets[fileName]))
        return 
      }

      this.loader.load( this.basePath+fileName, ( object: any ) => {
        this.loadedAssets[fileName] = this.cloneFBXWithAnims(object)
        resolve(object)
      })
    })
  }

  public loadTexture(fileName: string, callback: Function) {
    if (typeof this.loadedTextures[fileName] !== "undefined") {
      let tex = this.loadedTextures[fileName].clone()
      tex.needsUpdate = true
      callback(tex)
      return 
    }

    this.textureLoader.load("/public/models/palettes/"+fileName, (texture: any) => {
      this.loadedTextures[fileName] = texture.clone()
      callback(texture)
    })
  }

  cloneFBXWithAnims(fbx: THREE.Object3D): THREE.Mesh {
    let clone = SkeletonUtils.clone(fbx);
    (clone as any).animations = fbx.animations;

    return (clone) as THREE.Mesh;
  }
}

/*let handler = AssetManager.getInstance(loader)
export {handler as AssetManager} */
