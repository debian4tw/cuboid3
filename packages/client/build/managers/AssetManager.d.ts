import * as THREE from "three";
export declare class AssetManager {
    private loader;
    private textureLoader;
    private loadedAssets;
    private loadedTextures;
    private basePath;
    private static instance;
    private constructor();
    static getInstance(): AssetManager;
    loadModelWithPromise(fileName: string): Promise<unknown>;
    loadModel(fileName: string, callback: Function): void;
    loadModelAsync(fileName: string): Promise<THREE.Mesh<THREE.Geometry | THREE.BufferGeometry, THREE.Material | THREE.Material[]>>;
    loadTexture(fileName: string, callback: Function): void;
    cloneFBXWithAnims(fbx: THREE.Object3D): THREE.Mesh;
}
