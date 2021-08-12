//threejs positional audio
//cone sound
//distance
import * as THREE from "three";
import {EventHandler} from '@cuboid3/core'

class AudioManager {

  private basePath: string = '/public/audio/'
  private listener: THREE.AudioListener
  private audioLoader: THREE.AudioLoader

  private static instance: AudioManager | null = null
  private loadedSounds : Map<string,THREE.Audio | THREE.PositionalAudio>

  private constructor() {
    this.listener = new THREE.AudioListener()
    this.audioLoader = new THREE.AudioLoader()
    this.loadedSounds = new Map()

    EventHandler.subscribe('attachAudioListener', (mesh: THREE.Mesh) => {
      mesh.add(this.listener)
    })
  }

  public getListener() {
    return this.listener
  }

  public static getInstance(): AudioManager {
    if(this.instance === null) {
      this.instance = new AudioManager()
    }

    return this.instance
  }

  attachListener(mesh: THREE.Mesh) {
    mesh.add(this.listener)
  }
  
  loadSound(fileName: string, callback: Function) {
    // create a global audio source
    var sound = new THREE.Audio( this.listener );
    // load a sound and set it as the Audio object's buffer
    this.audioLoader.load( this.basePath+ fileName, (buffer) => {
      sound.setBuffer( buffer )
      sound.setVolume( 1 );
      this.loadedSounds.set(fileName, sound.clone())
      callback(sound)
    })
  }

  loadPositionalSound(fileName: string, label: string, callback: Function) {

    if (this.loadedSounds.get(label) !== undefined) {
      callback(this.loadedSounds.get(label))
      return
    }

    this.audioLoader.load( this.basePath + fileName, (buffer) => {
      // load a sound and set it as the Audio object's buffer
      const sound = new THREE.PositionalAudio( this.listener );
      sound.setBuffer( buffer )
      sound.setRefDistance( 20 );
      sound.setVolume( 0.09 );
      this.loadedSounds.set(label, sound)
      callback(sound)
    })
  }

  play(label: string) {
    this.loadedSounds.get(label)?.play()
  }

  playSound(sound: THREE.Audio) {
    //sound.setVolume( 1 );
    sound.play();
  }
}

let handler = AudioManager.getInstance()
export {handler as AudioManager}
// let handler = AudioManager.getInstance()
//export {AudioManager}

