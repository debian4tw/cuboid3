import * as THREE from "three";
declare class AudioManager {
    private basePath;
    private listener;
    private audioLoader;
    private static instance;
    private loadedSounds;
    private constructor();
    getListener(): THREE.AudioListener;
    static getInstance(): AudioManager;
    attachListener(mesh: THREE.Mesh): void;
    loadSound(fileName: string, callback: Function): void;
    loadPositionalSound(fileName: string, label: string, callback: Function): void;
    play(label: string): void;
    playSound(sound: THREE.Audio): void;
}
export { AudioManager };
