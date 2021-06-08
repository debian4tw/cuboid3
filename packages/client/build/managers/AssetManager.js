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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetManager = void 0;
const THREE = __importStar(require("three"));
const FBXLoader_js_1 = require("three/examples/jsm/loaders/FBXLoader.js");
const SkeletonUtils_js_1 = require("three/examples/jsm/utils/SkeletonUtils.js");
class AssetManager {
    constructor() {
        this.loader = new FBXLoader_js_1.FBXLoader();
        this.loadedAssets = {};
        this.loadedTextures = {};
        this.textureLoader = new THREE.TextureLoader();
        this.textureLoader.setCrossOrigin("anonymous");
        this.basePath = '/public/models/';
    }
    static getInstance() {
        if (this.instance === null) {
            this.instance = new AssetManager();
        }
        return this.instance;
    }
    loadModelWithPromise(fileName) {
        return new Promise((resolve, reject) => {
            this.loader.load(this.basePath + fileName, (object) => {
                resolve(object);
            }, () => { }, //onUpdate
            (error) => {
                reject(error);
            });
        });
    }
    loadModel(fileName, callback) {
        if (typeof this.loadedAssets[fileName] !== "undefined") {
            callback(this.cloneFBXWithAnims(this.loadedAssets[fileName]));
            return;
        }
        this.loader.load(this.basePath + fileName, (object) => {
            this.loadedAssets[fileName] = this.cloneFBXWithAnims(object);
            callback(object);
        });
    }
    loadModelAsync(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (typeof this.loadedAssets[fileName] !== "undefined") {
                    resolve(this.cloneFBXWithAnims(this.loadedAssets[fileName]));
                    return;
                }
                this.loader.load(this.basePath + fileName, (object) => {
                    this.loadedAssets[fileName] = this.cloneFBXWithAnims(object);
                    resolve(object);
                });
            });
        });
    }
    loadTexture(fileName, callback) {
        if (typeof this.loadedTextures[fileName] !== "undefined") {
            let tex = this.loadedTextures[fileName].clone();
            tex.needsUpdate = true;
            callback(tex);
            return;
        }
        this.textureLoader.load("/public/models/palettes/" + fileName, (texture) => {
            this.loadedTextures[fileName] = texture.clone();
            callback(texture);
        });
    }
    cloneFBXWithAnims(fbx) {
        let clone = SkeletonUtils_js_1.SkeletonUtils.clone(fbx);
        clone.animations = fbx.animations;
        return (clone);
    }
}
exports.AssetManager = AssetManager;
AssetManager.instance = null;
/*let handler = AssetManager.getInstance(loader)
export {handler as AssetManager} */
