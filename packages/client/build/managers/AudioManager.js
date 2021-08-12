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
exports.AudioManager = void 0;
//threejs positional audio
//cone sound
//distance
const THREE = __importStar(require("three"));
const core_1 = require("@cuboid3/core");
class AudioManager {
    constructor() {
        this.basePath = '/public/audio/';
        this.listener = new THREE.AudioListener();
        this.audioLoader = new THREE.AudioLoader();
        this.loadedSounds = new Map();
        core_1.EventHandler.subscribe('attachAudioListener', (mesh) => {
            mesh.add(this.listener);
        });
    }
    getListener() {
        return this.listener;
    }
    static getInstance() {
        if (this.instance === null) {
            this.instance = new AudioManager();
        }
        return this.instance;
    }
    attachListener(mesh) {
        mesh.add(this.listener);
    }
    loadSound(fileName, callback) {
        // create a global audio source
        var sound = new THREE.Audio(this.listener);
        // load a sound and set it as the Audio object's buffer
        this.audioLoader.load(this.basePath + fileName, (buffer) => {
            sound.setBuffer(buffer);
            sound.setVolume(1);
            this.loadedSounds.set(fileName, sound.clone());
            callback(sound);
        });
    }
    loadPositionalSound(fileName, label, callback) {
        if (this.loadedSounds.get(label) !== undefined) {
            callback(this.loadedSounds.get(label));
            return;
        }
        this.audioLoader.load(this.basePath + fileName, (buffer) => {
            // load a sound and set it as the Audio object's buffer
            const sound = new THREE.PositionalAudio(this.listener);
            sound.setBuffer(buffer);
            sound.setRefDistance(20);
            sound.setVolume(0.09);
            this.loadedSounds.set(label, sound);
            callback(sound);
        });
    }
    play(label) {
        var _a;
        (_a = this.loadedSounds.get(label)) === null || _a === void 0 ? void 0 : _a.play();
    }
    playSound(sound) {
        //sound.setVolume( 1 );
        sound.play();
    }
}
AudioManager.instance = null;
let handler = AudioManager.getInstance();
exports.AudioManager = handler;
// let handler = AudioManager.getInstance()
//export {AudioManager}
